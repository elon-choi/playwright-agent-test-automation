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
import { mkdir, readdir, cp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const REPORT_SITE = join(ROOT, "report-site");
const REPORTS_DIR = join(REPORT_SITE, "reports");

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

  execSync("REPORT_SITE=report-site node scripts/generate-report-index.mjs", { cwd: ROOT, stdio: "inherit" });

  const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: ROOT, encoding: "utf-8" }).trim();

  // 미커밋 변경사항이 있으면 stash 후 복원
  const hasChanges = execSync("git status --porcelain", { cwd: ROOT, encoding: "utf-8" }).trim().length > 0;
  if (hasChanges) {
    run("git stash push -m \"publish-local-report auto-stash\"", { stdio: "pipe" });
  }

  try {
    // 원격 gh-pages에 맞춰 로컬 브랜치를 리셋 (CI force_orphan과 호환)
    try {
      run("git checkout -B gh-pages origin/gh-pages", { stdio: "pipe" });
    } catch {
      run("git checkout --orphan gh-pages", { stdio: "pipe" });
    }
    const toCopy = ["index.html", "reports"];
    for (const name of toCopy) {
      const src = join(REPORT_SITE, name);
      const dest = join(ROOT, name);
      await cp(src, dest, { recursive: true });
    }
    run("git add index.html reports");
    run("git status");
    try {
      run("git commit -m \"Report: add local run " + runId + "\"");
    } catch {
      run("git commit -m \"Report: add local run " + runId + "\" --allow-empty");
    }
    run("git push origin gh-pages");
  } finally {
    // 안전하게 원래 브랜치로 복원
    try {
      run("git checkout " + currentBranch, { stdio: "pipe" });
    } catch {
      // detached HEAD 등 예외 상황 — force checkout
      run("git checkout -f " + currentBranch, { stdio: "pipe" });
    }
    // gh-pages 파일이 index에 남아 있을 수 있으므로 정리
    try {
      run("git reset HEAD -- . 2>/dev/null", { stdio: "pipe" });
      run("git checkout -- . 2>/dev/null", { stdio: "pipe" });
    } catch { /* ignore */ }
    if (hasChanges) {
      try { run("git stash pop", { stdio: "pipe" }); } catch { /* ignore */ }
    }
  }

  console.log("Done. See https://elon-choi.github.io/playwright-agent-test-automation/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
