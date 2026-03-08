/**
 * 테스트 결과 요약을 슬랙으로 전송한다.
 * SLACK_WEBHOOK_URL 이 없으면 전송하지 않고 종료한다.
 * 실패 시 "결함 등록" 버튼 → Jira 이슈 생성 폼 (pre-filled) 으로 이동.
 * 사람이 확인 후 등록하는 Human Review 방식.
 */

import { readFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(PROJECT_ROOT, ".env"), quiet: true });
const RESULTS_PATH = path.join(PROJECT_ROOT, "test-results", "results.json");

function extractKpaId(suite) {
  const file = suite?.file ?? suite?.title ?? "";
  const m = file.match(/kpa-(\d+(?:-\d+)?)/i);
  return m ? `KPA-${m[1].toUpperCase()}` : null;
}

/** 실패 테스트에서 실행된 BDD 스텝 목록을 추출 */
function extractBddSteps(result) {
  const steps = [];
  function walk(items) {
    if (!Array.isArray(items)) return;
    for (const step of items) {
      const title = step?.title ?? "";
      if (/^(Given|When|Then|And|But)\s/i.test(title)) {
        steps.push({ title, failed: !!step.error });
      }
      walk(step.steps);
    }
  }
  walk(result?.steps);
  return steps;
}

/** 에러 메시지에서 핵심 내용만 추출 */
function summarizeError(errorMsg) {
  if (!errorMsg) return "";
  const clean = errorMsg.replace(/\u001b\[[0-9;]*m/g, "");
  const lines = clean.split("\n").map(l => l.trim()).filter(Boolean);
  const keyLine = lines.find(l => /Error:|expect|Timeout|locator\./i.test(l)) || lines[0] || "";
  return keyLine.slice(0, 200);
}

/** BDD 스텝에서 Given/When/Then 키워드를 제거하여 자연어로 변환 */
function humanizeStep(stepTitle) {
  return stepTitle.replace(/^(Given|When|Then|And|But)\s+/i, "").trim();
}

/** 에러를 분석해서 사람이 이해하기 쉬운 현상 설명으로 변환 */
function describeFailure(errorMsg) {
  const clean = (errorMsg || "").replace(/\u001b\[[0-9;]*m/g, "");
  if (/Timeout\s+(\d+)ms/i.test(clean)) {
    const sec = Math.round(parseInt(clean.match(/Timeout\s+(\d+)ms/i)[1]) / 1000);
    return `${sec}초 동안 대기했으나 해당 요소가 화면에 나타나지 않음`;
  }
  if (/toBeVisible/i.test(clean)) return "해당 요소가 화면에 보이지 않음";
  if (/toHaveURL/i.test(clean)) return "예상한 페이지로 이동되지 않음";
  if (/expect\(received\)|toBe|toContainText/i.test(clean)) return "예상값과 실제값이 다름";
  if (/Target closed/i.test(clean)) return "페이지가 예기치 않게 닫힘";
  if (/locator\.\w+|waiting for/i.test(clean)) return "해당 요소를 찾을 수 없음";
  return "검증 조건이 충족되지 않음";
}

/** 스텝명과 에러 현상을 하나의 자연어 문장으로 통합 */
function buildIssueSummary(kpaId, errorMsg, failedStep) {
  const step = failedStep || "시나리오 검증";
  const clean = (errorMsg || "").replace(/\u001b\[[0-9;]*m/g, "");

  // 에러 유형별로 스텝명을 자연스럽게 포함한 문장 생성
  if (/Timeout\s+(\d+)ms/i.test(clean)) {
    const sec = Math.round(parseInt(clean.match(/Timeout\s+(\d+)ms/i)[1]) / 1000);
    return `${kpaId}) ${step} 시 ${sec}초 대기 후에도 화면에 나타나지 않음`;
  }
  if (/toBeVisible/i.test(clean)) {
    return `${kpaId}) ${step} 요소가 화면에 보이지 않음`;
  }
  if (/toHaveURL/i.test(clean)) {
    return `${kpaId}) ${step} 후 예상한 페이지로 이동되지 않음`;
  }
  if (/expect\(received\)|toBe|toContainText/i.test(clean)) {
    return `${kpaId}) ${step} 검증 시 예상과 다른 결과 노출`;
  }
  if (/Target closed/i.test(clean)) {
    return `${kpaId}) ${step} 중 페이지가 예기치 않게 닫힘`;
  }
  if (/locator\.\w+|waiting for/i.test(clean)) {
    return `${kpaId}) ${step} 요소를 찾을 수 없음`;
  }
  return `${kpaId}) ${step} 검증 조건이 충족되지 않음`;
}

/** 실패 상세 정보를 수집 */
function collectFailures(suites, out, parentKpaId) {
  if (!Array.isArray(suites)) return;
  for (const suite of suites) {
    const kpaId = extractKpaId(suite) ?? parentKpaId;
    if (Array.isArray(suite?.specs)) {
      for (const spec of suite.specs) {
        if (Array.isArray(spec?.tests)) {
          for (const test of spec.tests) {
            if (test?.status === "unexpected") {
              const title = test.title ?? spec.title ?? suite.title ?? "Unknown";
              const result = test.results?.[0] ?? {};
              const errorMsg = result.error?.message ?? "";
              const bddSteps = extractBddSteps(result);
              const failedStepObj = bddSteps.find(s => s.failed);
              const failedStep = failedStepObj?.title?.replace(/^(Given|When|Then|And|But)\s+/i, "") ?? "";

              out.push({
                kpaId: kpaId || "UNKNOWN",
                title,
                errorMsg,
                errorSummary: summarizeError(errorMsg),
                bddSteps,
                failedStep,
                displayTitle: `${kpaId ? `[${kpaId}] ` : ""}${title}`,
              });
            }
          }
        }
      }
    }
    if (Array.isArray(suite?.suites)) collectFailures(suite.suites, out, kpaId);
  }
}

async function loadSummary(exitCode) {
  const summary = { passed: 0, failed: 0, skipped: 0, flaky: 0, total: 0, failures: [] };
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
      collectFailures(data.suites, summary.failures);
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
const JIRA_BASE_URL = process.env.JIRA_BASE_URL?.replace(/\/$/, "") || "";
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || "";
const JIRA_ISSUE_TYPE = process.env.JIRA_ISSUE_TYPE || "버그";
const JIRA_EMAIL = process.env.JIRA_EMAIL || "";
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || "";

const JIRA_AUTH = (JIRA_EMAIL && JIRA_API_TOKEN)
  ? Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")
  : "";

/** 리포트 URL을 생성 (메인 페이지 — 최신 리포트가 상단에 표시됨) */
function buildReportUrl(runId) {
  if (runId) return `${REPORT_PAGE_URL}reports/${runId}/`;
  return REPORT_PAGE_URL;
}

/** 가장 최근 리포트의 runId를 찾는다 (report-site/reports/ 하위 디렉토리) */
function findLatestRunId() {
  try {
    const reportsDir = path.join(PROJECT_ROOT, "report-site", "reports");
    const entries = readdirSync(reportsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort()
      .reverse();
    return entries[0] || "";
  } catch { return ""; }
}

/** Jira Cloud 프로젝트 숫자 ID와 이슈 타입 ID 조회 */
async function fetchJiraIds() {
  if (!JIRA_BASE_URL || !JIRA_AUTH || !JIRA_PROJECT_KEY) return null;
  try {
    const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/project/${JIRA_PROJECT_KEY}`, {
      headers: { Authorization: `Basic ${JIRA_AUTH}`, Accept: "application/json" },
    });
    if (!res.ok) return null;
    const project = await res.json();
    const issueType = (project.issueTypes ?? []).find(
      (t) => t.name === JIRA_ISSUE_TYPE || t.name === "Bug" || t.name === "버그"
    );
    return { pid: project.id, issuetypeId: issueType?.id || "1" };
  } catch {
    return null;
  }
}

let _jiraIds = null;

/** Jira 이슈 생성 URL을 빌드하되 Slack 3000자 제한에 맞춤 */
function buildJiraCreateUrl(failure) {
  if (!JIRA_BASE_URL || !_jiraIds) return "";

  const { kpaId, title, errorMsg, bddSteps, failedStep } = failure;
  const latestRunId = findLatestRunId();
  const reportUrl = buildReportUrl(latestRunId);
  const phenomenon = describeFailure(errorMsg);

  // 타이틀 (한국어 URL 인코딩: 1글자→9바이트이므로 최대한 짧게)
  const summary = `[Pageweb] ${buildIssueSummary(kpaId, errorMsg, failedStep)}`;

  const stepLabel = failedStep || title;
  const shortStepLabel = stepLabel.length > 20 ? stepLabel.slice(0, 18) + ".." : stepLabel;

  const baseUrl = `${JIRA_BASE_URL}/secure/CreateIssueDetails!init.jspa?pid=${_jiraIds.pid}&issuetype=${_jiraIds.issuetypeId}&`;

  // 전체 BDD 스텝 (축약 없이 전체 포함)
  const allStepsLines = bddSteps.map((step, i) => {
    let h = humanizeStep(step.title);
    if (h.length > 40) h = h.slice(0, 38) + "..";
    return `${i + 1}. ${h}${step.failed ? " (실패)" : ""}`;
  });

  // 스텝 수를 줄여가며 2900자 이내로 맞춤
  const buildDesc = (steps) => [
    `[현상] ${phenomenon}`,
    `[환경] Production (https://page.kakao.com)`,
    `[재현스텝]\n${steps.length > 0 ? steps.join("\n") : `1. ${title.slice(0, 40)}`}`,
    `[리포트] ${reportUrl}`,
  ].join("\n\n");

  const candidates = [];
  // 전체 → 9 → 5 → 3 순으로 스텝 수를 줄여가며 시도
  const stepCounts = [allStepsLines.length, 9, 5, 3].filter((v, i, a) => a.indexOf(v) === i);
  for (const n of stepCounts) {
    candidates.push(() => buildDesc(allStepsLines.slice(0, n)));
  }
  // 스텝 없이
  candidates.push(() => [
    `[현상] ${phenomenon}`,
    `[환경] Production (https://page.kakao.com)`,
    `[리포트] ${reportUrl}`,
  ].join("\n\n"));
  // description 없이 summary만
  candidates.push(() => "");

  for (const buildDesc of candidates) {
    const description = buildDesc();
    const params = description
      ? new URLSearchParams({ summary, description })
      : new URLSearchParams({ summary });
    const url = baseUrl + params;
    if (url.length <= 2900) return url;
  }

  // 최종 fallback: summary도 축약
  const shortSummary = `[Pageweb] ${kpaId}) ${shortStepLabel}`;
  return baseUrl + new URLSearchParams({ summary: shortSummary });
}

function buildMessage(summary, runUrl) {
  const status = summary.failed > 0 ? "실패" : "성공";
  const emoji = summary.failed > 0 ? ":rotating_light:" : ":white_check_mark:";

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: `${summary.failed > 0 ? "!" : "v"} Playwright 테스트 결과: ${status}` }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${emoji} *통과:* ${summary.passed}  |  *실패:* ${summary.failed}  |  *스킵:* ${summary.skipped}  |  *플레이키:* ${summary.flaky}  |  *총:* ${summary.total}`
      }
    }
  ];

  if (summary.failures.length > 0) {
    const failLines = summary.failures.slice(0, 10).map((f) => `• ${f.displayTitle}`);
    if (summary.failures.length > 10) {
      failLines.push(`… 외 ${summary.failures.length - 10}건`);
    }
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*실패 시나리오:*\n${failLines.join("\n")}` }
    });

    // 결함 등록 버튼 (Jira 연동 시 — 클릭하면 pre-filled 이슈 생성 폼)
    if (_jiraIds) {
      const buttons = summary.failures.slice(0, 5).map((f) => {
        const url = buildJiraCreateUrl(f);
        return {
          type: "button",
          text: { type: "plain_text", text: `${f.kpaId} 결함 등록` },
          url,
          style: "danger"
        };
      }).filter(b => b.url);
      if (buttons.length > 0) {
        blocks.push({ type: "actions", elements: buttons });
      }
    }
  }

  const linkButtons = [];
  if (runUrl) {
    linkButtons.push({ type: "button", text: { type: "plain_text", text: "워크플로 보기" }, url: runUrl });
  }
  linkButtons.push({ type: "button", text: { type: "plain_text", text: "리포트 페이지" }, url: REPORT_PAGE_URL });
  blocks.push({ type: "actions", elements: linkButtons });

  const fallback = `[Playwright] 카카오페이지 테스트 결과: ${status} — 통과: ${summary.passed}, 실패: ${summary.failed}`;
  return { text: fallback, blocks };
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

  // Jira Cloud 프로젝트 ID 조회 (결함 등록 버튼 URL에 필요)
  _jiraIds = await fetchJiraIds();

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
