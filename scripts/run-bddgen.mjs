/**
 * Feature 기준으로 BDD Gen 실행.
 * playwright.config.ts와 features/가 있는 프로젝트 루트를 cwd로 고정한 뒤
 * playwright-bdd를 실행하여, 수정한 feature 파일 내용이 그대로 스펙에 반영되도록 한다.
 *
 * 사용: npm run bddgen [-- --verbose 등 추가 옵션]
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const child = spawn("npx", ["playwright-bdd", ...args], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
