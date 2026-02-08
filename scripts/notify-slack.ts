/**
 * 테스트 결과 요약을 슬랙으로 전송한다.
 * SLACK_WEBHOOK_URL 이 없으면 전송하지 않고 종료한다.
 * 사용: npm run test && npm run notify-slack (또는 CI에서 exit code 전달)
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const PROJECT_ROOT = process.cwd();
dotenv.config({ path: path.join(PROJECT_ROOT, ".env"), quiet: true });
const RESULTS_PATH = path.join(PROJECT_ROOT, "test-results", "results.json");

interface Summary {
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  total: number;
  failedTitles: string[];
}

interface JsonReport {
  stats?: { expected?: number; unexpected?: number; skipped?: number; flaky?: number };
  suites?: Array<{
    title?: string;
    specs?: Array<{ title?: string; tests?: Array<{ title?: string; status?: string }> }>;
    suites?: Array<unknown>;
  }>;
}

function collectFailedTitles(suites: JsonReport["suites"], out: string[]): void {
  if (!Array.isArray(suites)) return;
  for (const suite of suites) {
    const specs = suite?.specs;
    if (Array.isArray(specs)) {
      for (const spec of specs) {
        const tests = spec?.tests;
        if (Array.isArray(tests)) {
          for (const test of tests) {
            if (test?.status === "unexpected") {
              const title = test.title ?? spec.title ?? suite.title ?? "Unknown";
              out.push(String(title));
            }
          }
        }
      }
    }
    if (Array.isArray(suite?.suites)) collectFailedTitles(suite.suites, out);
  }
}

async function loadSummary(exitCode: number): Promise<Summary> {
  const summary: Summary = { passed: 0, failed: 0, skipped: 0, flaky: 0, total: 0, failedTitles: [] };
  if (existsSync(RESULTS_PATH)) {
    try {
      const raw = await readFile(RESULTS_PATH, "utf-8");
      const data = JSON.parse(raw) as JsonReport;
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

function buildMessage(summary: Summary, runUrl?: string): { text: string } {
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
  if (runUrl) lines.push("", `<${runUrl}|워크플로 보기>`);
  return { text: lines.join("\n") };
}

async function main(): Promise<void> {
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
