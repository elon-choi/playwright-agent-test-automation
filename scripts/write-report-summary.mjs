/**
 * Run별 summary.json 생성. 우선순위:
 * 1) allure-results/*-result.json 집계 (ALLURE_RESULTS_DIR 설정 시)
 * 2) test-results/results.json
 * 3) report-site/reports/$RUN_ID/report.json (HTML 리포터)
 * env: RESULTS_JSON, SUMMARY_JSON, RUN_DATE_ISO, RUN_ID, ALLURE_RESULTS_DIR
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const RESULTS_JSON = process.env.RESULTS_JSON || "test-results/results.json";
const SUMMARY_JSON = process.env.SUMMARY_JSON;
const RUN_DATE_ISO = process.env.RUN_DATE_ISO || new Date().toISOString();
const RUN_ID = process.env.RUN_ID || "";
const ALLURE_RESULTS_DIR = process.env.ALLURE_RESULTS_DIR || "";

if (!SUMMARY_JSON) {
  console.error("SUMMARY_JSON env required");
  process.exit(1);
}

async function aggregateAllureResults(dir) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let flaky = 0;
  let durationMs = 0;
  const files = await readdir(dir).catch(() => []);
  const resultFiles = files.filter((f) => f.endsWith("-result.json"));
  for (const name of resultFiles) {
    try {
      const raw = await readFile(join(dir, name), "utf-8");
      const one = JSON.parse(raw);
      const status = (one.status || "").toLowerCase();
      if (status === "passed") passed += 1;
      else if (status === "failed" || status === "timedout" || status === "broken" || status === "interrupted") failed += 1;
      else if (status === "skipped") skipped += 1;
      else passed += 1;
      if (typeof one.start === "number" && typeof one.stop === "number") {
        durationMs += one.stop - one.start;
      }
    } catch {
      // skip invalid file
    }
  }
  const total = passed + failed + skipped + flaky;
  return {
    passed,
    failed,
    skipped,
    flaky,
    total,
    durationSeconds: total > 0 && durationMs > 0 ? Math.round(durationMs / 1000) : null
  };
}

async function main() {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let flaky = 0;
  let durationSeconds = null;
  let source = "none";

  if (ALLURE_RESULTS_DIR) {
    const agg = await aggregateAllureResults(ALLURE_RESULTS_DIR);
    if (agg.total > 0) {
      passed = agg.passed;
      failed = agg.failed;
      skipped = agg.skipped;
      flaky = agg.flaky;
      durationSeconds = agg.durationSeconds;
      source = "allure-results";
    }
  }

  if (source === "none") {
    try {
      const raw = await readFile(RESULTS_JSON, "utf-8");
      const data = JSON.parse(raw);
      const stats = data.stats ?? {};
      passed = stats.expected ?? 0;
      failed = stats.unexpected ?? 0;
      skipped = stats.skipped ?? 0;
      flaky = stats.flaky ?? 0;
      if (typeof data.stats?.duration === "number") durationSeconds = data.stats.duration / 1000;
      source = "results.json";
    } catch (e) {
      console.warn("Could not read results.json:", e.message);
    }
  }

  let total = passed + failed + skipped + flaky;
  if (total === 0) {
    const reportPath = join(dirname(SUMMARY_JSON), "report.json");
    try {
      const reportRaw = await readFile(reportPath, "utf-8");
      const report = JSON.parse(reportRaw);
      const s = report.stats ?? {};
      passed = s.expected ?? 0;
      failed = s.unexpected ?? 0;
      skipped = s.skipped ?? 0;
      flaky = s.flaky ?? 0;
      total = passed + failed + skipped + flaky;
      if (typeof report.duration === "number") durationSeconds = report.duration / 1000;
      source = "report.json";
    } catch (e) {
      console.warn("Could not read report.json fallback:", e.message);
    }
  }

  const summary = {
    date: RUN_DATE_ISO,
    timestamp: RUN_DATE_ISO,
    runId: RUN_ID,
    passed,
    failed,
    skipped,
    flaky,
    total,
    durationSeconds
  };

  await mkdir(dirname(SUMMARY_JSON), { recursive: true });
  await writeFile(SUMMARY_JSON, JSON.stringify(summary, null, 2), "utf-8");
  console.log("Wrote", SUMMARY_JSON, "total:", total, "passed:", passed, "failed:", failed, "source:", source);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
