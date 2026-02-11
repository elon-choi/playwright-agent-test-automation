/**
 * dom_dumps, dom_logs 디렉터리에서 지정 일수보다 오래된 파일만 삭제한다.
 * 사용: node scripts/clean-old-dumps.mjs [보관일수]
 * 기본 보관일수: 1 (오늘 기준 1일 초과된 파일 삭제)
 * 프로젝트 루트는 스크립트 위치(scripts/) 기준으로 결정하므로, cron에서 cwd 없이 실행해도 동작한다.
 * cron 예시 (매일 새벽 2시): 0 2 * * * /usr/bin/node /Volumes/Project/playwright-agent-test-automation/scripts/clean-old-dumps.mjs 1
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOM_DUMPS_DIR = join(ROOT, "dom_dumps");
const DOM_LOGS_DIR = join(ROOT, "dom_logs");

const keepDays = Math.max(0, parseInt(process.argv[2], 10) || 1);
const cutoffMs = Date.now() - keepDays * 24 * 60 * 60 * 1000;

async function deleteOlderThan(dir, cutoff) {
  let deleted = 0;
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isFile()) continue;
      const full = join(dir, ent.name);
      const st = await stat(full);
      if (st.mtimeMs < cutoff) {
        await unlink(full);
        deleted++;
      }
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  return deleted;
}

async function main() {
  const fromDumps = await deleteOlderThan(DOM_DUMPS_DIR, cutoffMs);
  const fromLogs = await deleteOlderThan(DOM_LOGS_DIR, cutoffMs);
  console.log("Deleted: dom_dumps " + fromDumps + ", dom_logs " + fromLogs + " (older than " + keepDays + " day(s))");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
