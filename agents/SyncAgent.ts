/**
 * 양방향 동기화 에이전트 (Sheets ↔ BDD).
 * Agent A: Sheets → Gherkin → .feature (pull)
 * Agent B: .feature → JSON(사전조건/수행절차/기대결과) → Sheets (push)
 * LLM은 '언어 통역'만 수행. temperature=0, 역방향은 response_format json_schema로 환각 통제.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncConfig } from "../config/sync.config.js";
import {
  getTcRow,
  updateTcRow,
  findRowByTcId,
} from "../lib/sheets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/** TC_ID → feature 파일 경로 검색 (기존 구조: features/pcw/.../kpa-092.feature) */
function resolveFeaturePathSync(tcId: string): string | null {
  const normalized = tcId.replace(/^KPA-?/i, "kpa-").toLowerCase();
  const targetFile = `${normalized}.feature`;
  const featuresDir = syncConfig.featuresDir;

  function walk(dir: string): string | null {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const found = walk(full);
        if (found) return found;
      } else if (e.isFile() && e.name === targetFile) return full;
    }
    return null;
  }

  return walk(featuresDir);
}

/**
 * Agent A: 시트에서 TC 한 행 읽어서 Gherkin으로 번역 후 .feature 파일 생성/덮어쓰기.
 * 명령 예: npm run sync:pull kpa-092
 */
export async function pull(tcId: string): Promise<{ ok: boolean; path?: string; error?: string }> {
  try {
    const row = await getTcRow(tcId);
    if (!row) {
      return { ok: false, error: `시트에서 TC ID "${tcId}"를 찾을 수 없습니다.` };
    }

    const gherkin = await translateToGherkin({
      precondition: row.precondition,
      steps: row.steps,
      expected: row.expected,
    });

    const existingPath = resolveFeaturePathSync(tcId);
    const outPath = existingPath ?? defaultFeaturePath(tcId);
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, gherkin, "utf8");

    return { ok: true, path: outPath };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}

/**
 * Agent B: .feature 파일 읽어서 사전조건/수행절차/기대결과 JSON으로 역번역 후 시트 해당 행 덮어쓰기.
 * 명령 예: npm run sync:push kpa-092
 */
export async function push(tcId: string): Promise<{ ok: boolean; rowIndex?: number; error?: string }> {
  try {
    const featurePath = resolveFeaturePathSync(tcId);
    if (!featurePath || !fs.existsSync(featurePath)) {
      return { ok: false, error: `feature 파일을 찾을 수 없습니다: ${tcId}` };
    }

    const featureContent = fs.readFileSync(featurePath, "utf8");
    const structured = await translateToStructuredJson(featureContent);

    const rowIndex = await findRowByTcId(
      syncConfig.spreadsheetId,
      syncConfig.sheetName,
      tcId,
      syncConfig.columnTcId,
      syncConfig.dataStartRow
    );
    if (rowIndex == null) {
      return { ok: false, error: `시트에서 TC ID "${tcId}"를 찾을 수 없습니다.` };
    }

    await updateTcRow(tcId, rowIndex, {
      precondition: structured.precondition,
      steps: structured.steps,
      expected: structured.expected,
    });

    return { ok: true, rowIndex };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}

/** 시트 3컬럼 → Gherkin (OpenAI 호출). temperature=0 */
async function translateToGherkin(payload: {
  precondition: string;
  steps: string;
  expected: string;
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");

  const model = process.env.OPENAI_MODEL ?? "gpt-4o";
  const system = `당신은 테스트 케이스를 Gherkin BDD 문법으로만 변환하는 번역기입니다.
출력은 반드시 Feature, Scenario, Given/When/Then/And만 사용한 .feature 본문만 출력하세요. 설명이나 마크다운 없이.`;
  const user = `[사전조건]\n${payload.precondition}\n\n[수행절차]\n${payload.steps}\n\n[기대결과]\n${payload.expected}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API 오류: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!content) throw new Error("OpenAI가 빈 응답을 반환했습니다.");
  return content;
}

/** Gherkin 본문 → { precondition, steps, expected } (JSON Schema strict) */
async function translateToStructuredJson(featureContent: string): Promise<{
  precondition: string;
  steps: string;
  expected: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");

  const model = process.env.OPENAI_MODEL ?? "gpt-4o";
  const schema = {
    type: "object",
    properties: {
      precondition: { type: "string", description: "사전조건" },
      steps: { type: "string", description: "수행절차" },
      expected: { type: "string", description: "기대결과" },
    },
    required: ["precondition", "steps", "expected"],
    additionalProperties: false,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: "json_schema", json_schema: { name: "tc_fields", strict: true, schema } },
      messages: [
        {
          role: "system",
          content:
            "주어진 Gherkin 시나리오만을 해석하여, 본문에 없는 동작을 창조하지 말고 반드시 precondition/steps/expected 세 키의 JSON만 출력하세요.",
        },
        { role: "user", content: featureContent },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API 오류: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!raw) throw new Error("OpenAI가 빈 응답을 반환했습니다.");

  const parsed = JSON.parse(raw) as { precondition?: string; steps?: string; expected?: string };
  return {
    precondition: String(parsed.precondition ?? ""),
    steps: String(parsed.steps ?? ""),
    expected: String(parsed.expected ?? ""),
  };
}

/** pull 시 시트에 해당 TC가 없을 때 새로 쓸 feature 경로 (기본: features/pcw/06-콘텐츠홈/{tcId}.feature) */
function defaultFeaturePath(tcId: string): string {
  const normalized = tcId.replace(/^KPA-?/i, "kpa-").toLowerCase();
  return path.join(syncConfig.featuresDir, "pcw", "06-콘텐츠홈", `${normalized}.feature`);
}
