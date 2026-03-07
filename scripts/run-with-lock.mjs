/**
 * 락을 획득한 뒤 전달받은 npm script를 실행하고, 완료 후 락을 해제한다.
 *
 * 사용: node scripts/run-with-lock.mjs <npm-script-name>
 * 예:   node scripts/run-with-lock.mjs test:headless
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { isLocked, acquire, release, lockInfo } from "./test-lock.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const scriptName = process.argv[2];

if (!scriptName) {
  console.error("사용법: node scripts/run-with-lock.mjs <npm-script-name>");
  process.exit(1);
}

// 락이 걸려 있으면 최대 3분 대기 (헬스체크는 1~2분이면 끝남)
const MAX_WAIT_MS = 3 * 60 * 1000;
const POLL_MS = 5000;
let waited = 0;

while (isLocked() && waited < MAX_WAIT_MS) {
  const info = lockInfo();
  console.log(`[lock] 다른 테스트 실행 중 (owner: ${info?.owner ?? "?"}) → 대기 중... (${Math.round(waited / 1000)}s)`);
  execSync(`sleep ${POLL_MS / 1000}`, { stdio: "ignore" });
  waited += POLL_MS;
}

if (isLocked()) {
  console.warn("[lock] 대기 시간 초과 → 강제 락 해제 후 진행");
  release();
}

acquire("full-test");
console.log(`[lock] 락 획득 → npm run ${scriptName} 실행`);

let exitCode = 0;
try {
  execSync(`npm run ${scriptName}`, { cwd: ROOT, stdio: "inherit" });
} catch (err) {
  exitCode = err.status ?? 1;
} finally {
  release();
  console.log("[lock] 락 해제 완료");
}

process.exit(exitCode);
