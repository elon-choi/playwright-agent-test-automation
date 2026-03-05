/**
 * 테스트 결과 요약을 슬랙으로 전송한다.
 * SLACK_WEBHOOK_URL 이 없으면 전송하지 않고 종료한다.
 * CI/Node에서 ts-node 없이 실행 가능한 ESM 버전.
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(PROJECT_ROOT, ".env"), quiet: true });
const RESULTS_PATH = path.join(PROJECT_ROOT, "test-results", "results.json");

function extractKpaId(suite) {
  // suite.file or suite.title から kpa-XXX を抽出
  const file = suite?.file ?? suite?.title ?? "";
  const m = file.match(/kpa-(\d+(?:-\d+)?)/i);
  return m ? `KPA-${m[1].toUpperCase()}` : null;
}

function collectFailedTitles(suites, out, parentKpaId) {
  if (!Array.isArray(suites)) return;
  for (const suite of suites) {
    const kpaId = extractKpaId(suite) ?? parentKpaId;
    const specs = suite?.specs;
    if (Array.isArray(specs)) {
      for (const spec of specs) {
        const tests = spec?.tests;
        if (Array.isArray(tests)) {
          for (const test of tests) {
            if (test?.status === "unexpected") {
              const title = test.title ?? spec.title ?? suite.title ?? "Unknown";
              const prefix = kpaId ? `[${kpaId}] ` : "";
              out.push(`${prefix}${String(title)}`);
            }
          }
        }
      }
    }
    if (Array.isArray(suite?.suites)) collectFailedTitles(suite.suites, out, kpaId);
  }
}

async function loadSummary(exitCode) {
  const summary = { passed: 0, failed: 0, skipped: 0, flaky: 0, total: 0, failedTitles: [] };
  if (existsSync(RESULTS_PATH)) {
    try {
      const raw = await readFile(RESULTS_PATH, "utf-8");
      const data = JSON.parse(raw);
      const stats = data.stats ?? {};
      summary.passed = stats.expected ?? 0;
      summary.failed = stats.unexpected ?? 0;
      summary.skipped = stats.skipped ?? 0;
      summary.flaky = stats.flaky ?? 0;
      summary.total = summary.passed + summary.failed + summary.skipped + summary.flaky;
      collectFailedTitles(data.suites, summary.failedTitles);
    } catch {
      summary.total = 0;
      summary.failed = exitCode === 0 ? 0 : 1;
    }
  } else {
    summary.failed = exitCode === 0 ? 0 : 1;
    summary.total = summary.passed + summary.failed;
  }
  return summary;
}

const REPORT_PAGE_URL = "https://elon-choi.github.io/playwright-agent-test-automation/";

function buildMessage(summary, runUrl) {
  const status = summary.failed > 0 ? "실패" : "성공";
  const lines = [
    `[Playwright] 카카오페이지 테스트 결과: *${status}*`,
    `통과: ${summary.passed} | 실패: ${summary.failed} | 스킵: ${summary.skipped} | 플레이키: ${summary.flaky} | 총 ${summary.total}`
  ];
  if (summary.failedTitles.length > 0) {
    lines.push("");
    lines.push("실패 시나리오:");
    summary.failedTitles.slice(0, 10).forEach((t) => lines.push(`• ${t}`));
    if (summary.failedTitles.length > 10) {
      lines.push(`… 외 ${summary.failedTitles.length - 10}건`);
    }
  }
  const links = [];
  if (runUrl) links.push(`<${runUrl}|워크플로 보기>`);
  links.push(`<${REPORT_PAGE_URL}|리포트 페이지>`);
  lines.push("", links.join(" | "));
  return { text: lines.join("\n") };
}

async function main() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.log("SLACK_WEBHOOK_URL이 비어 있어 슬랙 전송을 건너뜁니다.");
    process.exit(0);
    return;
  }
  const exitCode = parseInt(process.env.TEST_EXIT_CODE ?? "0", 10);
  const runUrl = process.env.GITHUB_RUN_URL ?? process.env.CI_JOB_URL ?? undefined;

  const summary = await loadSummary(exitCode);
  const payload = buildMessage(summary, runUrl);

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    console.error("Slack 전송 실패:", res.status, await res.text());
    process.exit(1);
  }
  console.log("슬랙으로 결과를 전송했습니다.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
