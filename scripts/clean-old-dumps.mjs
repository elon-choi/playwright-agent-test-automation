/**
 * dom_dumps, dom_logs 디렉터리에서 지정 일수보다 오래된 파일만 삭제한다.
 * 보관: 1일 전 자료만 유지 (그 이전 파일 삭제).
 * 사용: node scripts/clean-old-dumps.mjs [보관일수]
 * 기본 보관일수: 1 (인자 없으면 1일 초과분 삭제)
 * cron 예시 (매일 새벽 2시, 1일치만 보관): 0 2 * * * /usr/bin/node /path/to/scripts/clean-old-dumps.mjs 1
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
