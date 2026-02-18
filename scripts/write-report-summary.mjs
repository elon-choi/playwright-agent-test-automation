/**
 * test-results/results.json 을 읽어 summary.json 한 개를 생성한다.
 * CI에서 Run별 리포트 디렉터리에 넣기 위해 사용.
 * env: RESULTS_JSON, SUMMARY_JSON, RUN_DATE_ISO, RUN_ID
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const RESULTS_JSON = process.env.RESULTS_JSON || "test-results/results.json";
const SUMMARY_JSON = process.env.SUMMARY_JSON;
const RUN_DATE_ISO = process.env.RUN_DATE_ISO || new Date().toISOString();
const RUN_ID = process.env.RUN_ID || "";

if (!SUMMARY_JSON) {
  console.error("SUMMARY_JSON env required");
  process.exit(1);
}

async function main() {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let flaky = 0;
  let durationSeconds = null;

  try {
    const raw = await readFile(RESULTS_JSON, "utf-8");
    const data = JSON.parse(raw);
    const stats = data.stats ?? {};
    passed = stats.expected ?? 0;
    failed = stats.unexpected ?? 0;
    skipped = stats.skipped ?? 0;
    flaky = stats.flaky ?? 0;
    if (typeof data.stats?.duration === "number") durationSeconds = data.stats.duration / 1000;
  } catch (e) {
    console.warn("Could not read results.json:", e.message);
  }

  const total = passed + failed + skipped + flaky;
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
  console.log("Wrote", SUMMARY_JSON, "total:", total, "passed:", passed, "failed:", failed);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
