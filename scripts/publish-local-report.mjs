/**
 * 로컬(또는 UI 모드) 실행 결과를 리포트 페이지(gh-pages)에 추가한다.
 * 실행 후 playwright-report, test-results, allure-results 중 하나는 있어야 한다.
 *
 * 사용: node scripts/publish-local-report.mjs
 * 필요: git push 권한 (gh-pages 브랜치에 푸시)
 *
 * 1) report-site을 gh-pages에서 가져오거나 빈 상태로 준비
 * 2) 현재 시각으로 RUN_ID 생성
 * 3) 로컬 playwright-report → report-site/reports/$RUN_ID/
 * 4) write-report-summary로 summary.json 생성
 * 5) generate-report-index로 index.html 갱신
 * 6) gh-pages 브랜치로 체크아웃 후 report-site 내용 푸시
 */
import { mkdir, readdir, cp, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const REPORT_SITE = join(ROOT, "report-site");
const REPORTS_DIR = join(REPORT_SITE, "reports");
const HEALTHCHECK_HISTORY = join(REPORTS_DIR, "healthcheck-history.json");
const TEST_TYPE = process.env.TEST_TYPE || "";
const RETENTION_DAYS = 7;

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: "inherit", ...opts });
}

async function main() {
  const runId = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const runDateIso = new Date().toISOString();

  console.log("RUN_ID:", runId);

  try {
    run("git fetch origin gh-pages 2>/dev/null || true", { stdio: "pipe" });
  } catch {
    // no gh-pages yet
  }

  // git archive로 추출 — main의 index를 오염시키지 않음
  try {
    execSync("git archive origin/gh-pages | tar -x -C " + REPORT_SITE, { cwd: ROOT, stdio: "pipe" });
  } catch {
    // no gh-pages yet — start fresh
  }

  await mkdir(REPORTS_DIR, { recursive: true });

  const isHealthcheck = TEST_TYPE === "코어";

  if (isHealthcheck) {
    // 핵심: HTML 복사 없이 summary만 생성 후 healthcheck-history.json에 append
    const tmpSummary = join(ROOT, "test-results", "hc-summary.json");
    const env = {
      ...process.env,
      RESULTS_JSON: join(ROOT, "test-results", "hc-results.json"),
      SUMMARY_JSON: tmpSummary,
      RUN_DATE_ISO: runDateIso,
      RUN_ID: runId,
      ALLURE_RESULTS_DIR: join(ROOT, "allure-results")
    };
    execSync("node scripts/write-report-summary.mjs", { cwd: ROOT, env, stdio: "inherit" });

    // summary를 읽고 healthcheck-history.json에 append
    const summaryRaw = await readFile(tmpSummary, "utf-8");
    const summaryData = JSON.parse(summaryRaw);

    let history = [];
    try {
      const histRaw = await readFile(HEALTHCHECK_HISTORY, "utf-8");
      history = JSON.parse(histRaw);
    } catch { /* 첫 실행 시 빈 배열 */ }

    history.push(summaryData);

    // 7일 이상 된 데이터 정리
    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    history = history.filter(h => new Date(h.date || h.timestamp).getTime() > cutoff);

    await writeFile(HEALTHCHECK_HISTORY, JSON.stringify(history, null, 2), "utf-8");
    console.log("Appended healthcheck result to", HEALTHCHECK_HISTORY, "(" + history.length + " entries)");
  } else {
    // 전체: 기존 방식 — HTML 리포트를 reports/{runId}/에 복사
    const runDir = join(REPORTS_DIR, runId);
    await mkdir(runDir, { recursive: true });

    const playwrightReport = join(ROOT, "playwright-report");
    const hasReport = await readdir(playwrightReport).then(() => true).catch(() => false);
    if (hasReport) {
      await cp(playwrightReport, runDir, { recursive: true });
      console.log("Copied playwright-report to", runDir);
    } else {
      await writeFile(
        join(runDir, "index.html"),
        "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>No report</title></head><body><p>No report for this run (local).</p></body></html>",
        "utf-8"
      );
    }

    const env = {
      ...process.env,
      RESULTS_JSON: join(ROOT, "test-results", "results.json"),
      SUMMARY_JSON: join(runDir, "summary.json"),
      RUN_DATE_ISO: runDateIso,
      RUN_ID: runId,
      ALLURE_RESULTS_DIR: join(ROOT, "allure-results")
    };
    execSync("node scripts/write-report-summary.mjs", { cwd: ROOT, env, stdio: "inherit" });
  }

  execSync("REPORT_SITE=report-site node scripts/generate-report-index.mjs", { cwd: ROOT, stdio: "inherit" });

  // git worktree를 사용하여 메인 브랜치 파일에 영향 없이 gh-pages에 푸시
  const WORKTREE_DIR = join(ROOT, ".gh-pages-worktree");

  // 이전 worktree 잔재 정리
  try { execSync(`git worktree remove --force "${WORKTREE_DIR}" 2>/dev/null`, { cwd: ROOT, stdio: "pipe" }); } catch { /* ignore */ }
  try { execSync(`rm -rf "${WORKTREE_DIR}"`, { cwd: ROOT, stdio: "pipe" }); } catch { /* ignore */ }

  try {
    // gh-pages 브랜치를 별도 디렉토리에 체크아웃
    try {
      execSync("git fetch origin gh-pages 2>/dev/null", { cwd: ROOT, stdio: "pipe" });
      execSync(`git worktree add "${WORKTREE_DIR}" origin/gh-pages`, { cwd: ROOT, stdio: "pipe" });
    } catch {
      // gh-pages가 없으면 orphan으로 생성
      execSync(`git worktree add --detach "${WORKTREE_DIR}"`, { cwd: ROOT, stdio: "pipe" });
      execSync("git checkout --orphan gh-pages", { cwd: WORKTREE_DIR, stdio: "pipe" });
      execSync("git rm -rf . 2>/dev/null || true", { cwd: WORKTREE_DIR, stdio: "pipe" });
    }

    // report-site 내용을 worktree로 복사
    const toCopy = ["index.html", "reports"];
    for (const name of toCopy) {
      const src = join(REPORT_SITE, name);
      const dest = join(WORKTREE_DIR, name);
      await cp(src, dest, { recursive: true });
    }

    const commitLabel = isHealthcheck ? "Healthcheck" : "Report";
    execSync("git add index.html reports", { cwd: WORKTREE_DIR, stdio: "inherit" });
    try {
      execSync(`git commit -m "${commitLabel}: ${runId}"`, { cwd: WORKTREE_DIR, stdio: "inherit" });
    } catch {
      execSync(`git commit -m "${commitLabel}: ${runId}" --allow-empty`, { cwd: WORKTREE_DIR, stdio: "inherit" });
    }
    execSync("git push origin HEAD:gh-pages", { cwd: WORKTREE_DIR, stdio: "inherit" });
  } finally {
    // worktree 정리 (메인 브랜치에 영향 없음)
    try { execSync(`git worktree remove --force "${WORKTREE_DIR}" 2>/dev/null`, { cwd: ROOT, stdio: "pipe" }); } catch { /* ignore */ }
    try { execSync(`rm -rf "${WORKTREE_DIR}"`, { cwd: ROOT, stdio: "pipe" }); } catch { /* ignore */ }
  }

  console.log("Done. See https://elon-choi.github.io/playwright-agent-test-automation/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
