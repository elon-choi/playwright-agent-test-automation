/**
 * allure-results 디렉터리 정리. 용량 부담이 큰 trace zip/스크린샷을 줄인다.
 * 보관: 1일 전 자료만 유지 (그 이전 파일 삭제). 스케줄러에서는 --older-than 1 사용.
 *
 * 사용:
 *   node scripts/clean-allure-results.mjs                  # 전체 삭제 (--all 동일)
 *   node scripts/clean-allure-results.mjs --all             # 전체 삭제
 *   node scripts/clean-allure-results.mjs --older-than 1    # 1일 초과된 파일만 삭제 (스케줄 권장)
 *   node scripts/clean-allure-results.mjs --only-attachments  # 첨부(zip/png 등)만 삭제, result.json 유지
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ALLURE_RESULTS_DIR = join(ROOT, "allure-results");

const args = process.argv.slice(2);
const isAll = args.includes("--all") || args.length === 0;
const onlyAttachments = args.includes("--only-attachments");
const olderThanIdx = args.indexOf("--older-than");
const keepDays = olderThanIdx >= 0 && args[olderThanIdx + 1] != null
  ? Math.max(0, parseInt(args[olderThanIdx + 1], 10))
  : null;

async function getStats(dir) {
  let count = 0;
  let bytes = 0;
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isFile()) continue;
      const full = join(dir, ent.name);
      const st = await stat(full).catch(() => null);
      if (st) {
        count += 1;
        bytes += st.size;
      }
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  return { count, bytes };
}

function formatBytes(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " GB";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + " MB";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + " KB";
  return n + " B";
}

async function runClean(dir) {
  let deleted = 0;
  let freed = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const full = join(dir, ent.name);
    const st = await stat(full);
    let remove = false;
    if (onlyAttachments) {
      remove = /-attachment\.(zip|png|jpg|jpeg|webm|webp|txt|md)$/i.test(ent.name);
    } else if (keepDays != null) {
      remove = st.mtimeMs < (Date.now() - keepDays * 24 * 60 * 60 * 1000);
    } else if (isAll) {
      remove = true;
    }
    if (remove) {
      await unlink(full);
      deleted += 1;
      freed += st.size;
    }
  }
  return { deleted, freed };
}

async function main() {
  const before = await getStats(ALLURE_RESULTS_DIR);
  if (before.count === 0) {
    console.log("allure-results is empty. Nothing to clean.");
    return;
  }
  console.log("allure-results before:", before.count, "files,", formatBytes(before.bytes));

  let deleted = 0;
  let freed = 0;

  if (onlyAttachments) {
    const r = await runClean(ALLURE_RESULTS_DIR);
    deleted = r.deleted;
    freed = r.freed;
    console.log("Deleted", deleted, "attachment(s), freed", formatBytes(freed));
  } else if (keepDays != null) {
    const r = await runClean(ALLURE_RESULTS_DIR);
    deleted = r.deleted;
    freed = r.freed;
    console.log("Deleted", deleted, "file(s) older than", keepDays, "day(s), freed", formatBytes(freed));
  } else {
    const r = await runClean(ALLURE_RESULTS_DIR);
    deleted = r.deleted;
    freed = r.freed;
    console.log("Deleted", deleted, "file(s), freed", formatBytes(freed));
  }

  const after = await getStats(ALLURE_RESULTS_DIR);
  console.log("allure-results after:", after.count, "files,", formatBytes(after.bytes));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
