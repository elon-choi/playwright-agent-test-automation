/**
 * 로컬 결과 폴더 전체 정리. 리포트 페이지는 gh-pages에 이미 배포된 내용만 사용하므로 삭제해도 영향 없음.
 * 사용: node scripts/clean-all-results.mjs [--dry-run]
 * --dry-run: 삭제하지 않고 지울 대상만 출력.
 */
import { readdir, stat, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const DIRS = [
  "allure-results",
  "allure-report",
  "test-results",
  "playwright-report",
  "blob-report",
  "dom_dumps",
  "dom_logs"
];

const dryRun = process.argv.includes("--dry-run");

async function getDirSize(dirPath) {
  let bytes = 0;
  let files = 0;
  try {
    const entries = await readdir(dirPath, { withFileTypes: true, recursive: true });
    for (const ent of entries) {
      if (ent.isFile()) {
        const full = join(dirPath, ent.name);
        const st = await stat(full).catch(() => null);
        if (st) {
          bytes += st.size;
          files += 1;
        }
      }
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  return { bytes, files };
}

function formatBytes(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " GB";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + " MB";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + " KB";
  return n + " B";
}

async function main() {
  let totalFreed = 0;
  let totalFiles = 0;

  for (const dir of DIRS) {
    const full = join(ROOT, dir);
    const { bytes, files } = await getDirSize(full);
    if (files === 0) continue;

    console.log(dir + ":", files, "files,", formatBytes(bytes));
    totalFreed += bytes;
    totalFiles += files;

    if (!dryRun) {
      try {
        await rm(full, { recursive: true, force: true });
        console.log("  -> removed");
      } catch (e) {
        if (e.code === "ENOENT") console.log("  -> (already gone)");
        else console.error("  -> error:", e.message);
      }
    }
  }

  if (totalFiles === 0) {
    console.log("No result data found. All clean.");
    return;
  }
  console.log("---");
  if (dryRun) {
    console.log("Total:", totalFiles, "files,", formatBytes(totalFreed), "(run without --dry-run to delete)");
  } else {
    console.log("Freed:", formatBytes(totalFreed));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
