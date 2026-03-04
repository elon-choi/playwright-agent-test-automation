/**
 * KPA-085 테스트 실행 (Cursor 터미널 spawn 이슈 우회용).
 * node로 진입한 뒤 child_process로 playwright test를 실행합니다.
 *
 * 사용: node scripts/run-kpa-085.mjs [--ui] [--repeat-each=10]
 * 또는: npm run test:085
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const env = {
  ...process.env,
  PLAYWRIGHT_BROWSERS_PATH: ".playwright-browsers",
  PLAYWRIGHT_HOST_PLATFORM_OVERRIDE: "mac15-arm64",
};

const specPath = ".features-gen/features/pcw/06-콘텐츠홈/kpa-085.feature.spec.js";
const baseArgs = ["playwright", "test", specPath, "--project=chromium-085"];
const extraArgs = process.argv.slice(2).filter((a) => a.startsWith("--"));
const args = [...baseArgs, ...extraArgs];

const child = spawn("npx", args, {
  cwd: projectRoot,
  env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});

child.on("error", (err) => {
  console.error("run-kpa-085:", err.message);
  process.exit(1);
});
