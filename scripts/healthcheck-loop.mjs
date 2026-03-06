/**
 * 핵심 시나리오 5분 주기 헬스체크 루프
 *
 * 사용: node scripts/healthcheck-loop.mjs
 * 중지: Ctrl+C
 *
 * 매 5분마다 @핵심 태그 시나리오를 헤드리스로 실행하고
 * 결과를 gh-pages 리포트에 발행한다.
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const INTERVAL_MS = 5 * 60 * 1000; // 5분

function timestamp() {
  return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function run(cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit", timeout: 4 * 60 * 1000 });
    return true;
  } catch {
    return false;
  }
}

function killZombieChromium() {
  try {
    // Playwright가 남긴 Chromium 프로세스 정리
    const killed = execSync(
      "pkill -f 'chromium.*--headless' 2>/dev/null; pkill -f 'chrome.*--headless' 2>/dev/null; true",
      { cwd: ROOT, encoding: "utf-8", timeout: 5000 }
    );
    // playwright-browsers 하위 프로세스도 정리
    execSync(
      "pkill -f '.playwright-browsers.*chromium' 2>/dev/null; true",
      { cwd: ROOT, encoding: "utf-8", timeout: 5000 }
    );
  } catch {
    // pkill 실패는 무시 (프로세스가 없는 경우)
  }
}

async function runHealthcheck() {
  console.log(`\n[${ timestamp() }] === 핵심 헬스체크 시작 ===`);

  // 1. 좀비 Chromium 프로세스 정리
  killZombieChromium();

  // 2. allure 결과 초기화
  run("rm -rf allure-results");

  // 3. 핵심 시나리오 실행
  const testCmd = [
    "CI=true",
    "TEST_TYPE=코어",
    "PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers",
    "PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=mac15-arm64",
    "playwright test --project=chromium --grep @핵심"
  ].join(" ");

  const passed = run(testCmd);
  console.log(`[${ timestamp() }] 테스트 결과: ${ passed ? "PASS" : "FAIL" }`);

  // 4. 리포트 발행 (실패해도 계속)
  run("node scripts/publish-local-report.mjs");

  console.log(`[${ timestamp() }] === 핵심 헬스체크 완료 ===`);
  return passed;
}

async function main() {
  console.log("핵심 시나리오 헬스체크 루프 시작 (5분 간격)");
  console.log("중지: Ctrl+C\n");

  // 첫 실행
  await runHealthcheck();

  // 5분 간격 반복
  setInterval(async () => {
    await runHealthcheck();
  }, INTERVAL_MS);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
