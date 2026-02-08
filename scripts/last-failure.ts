/**
 * 마지막 실패한 테스트의 dom_log 경로와 dom_dumps HTML 경로를 출력한다.
 * 실패 원인 분석 시 dom_dumps/*.html 을 브라우저로 열어 DOM을 확인할 수 있다.
 *
 * 사용: npx ts-node scripts/last-failure.ts [--open]
 * --open 이 있으면 최신 실패의 HTML 덤프를 기본 브라우저로 연다.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const projectRoot = process.cwd();
const DOM_LOGS_DIR = join(projectRoot, "dom_logs");
const DOM_DUMPS_DIR = join(projectRoot, "dom_dumps");

async function getLatestFile(dir: string, ext: string): Promise<{ path: string; mtime: number } | null> {
  let entries: string[] = [];
  try {
    entries = await readdir(dir);
  } catch {
    return null;
  }
  let latest: { path: string; mtime: number } | null = null;
  for (const name of entries) {
    if (ext && !name.endsWith(ext)) continue;
    const full = join(dir, name);
    const s = await stat(full).catch(() => null);
    if (!s || !s.isFile()) continue;
    if (!latest || s.mtimeMs > latest.mtime) {
      latest = { path: full, mtime: s.mtimeMs };
    }
  }
  return latest;
}

async function listRecentFailures(dir: string, limit: number) {
  let entries: string[] = [];
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }
  const withTime: { name: string; mtime: number }[] = [];
  for (const name of entries) {
    if (!name.endsWith(".json")) continue;
    const full = join(dir, name);
    const s = await stat(full).catch(() => null);
    if (!s || !s.isFile()) continue;
    withTime.push({ name, mtime: s.mtimeMs });
  }
  withTime.sort((a, b) => b.mtime - a.mtime);
  return withTime.slice(0, limit).map((t) => join(dir, t.name));
}

async function main() {
  const openDump = process.argv.includes("--open");
  const listMode = process.argv.includes("--list");
  const listLimit = 10;

  if (listMode) {
    const recent = await listRecentFailures(DOM_LOGS_DIR, listLimit);
    if (recent.length === 0) {
      console.log("dom_logs/ 에 실패 로그가 없습니다.");
      return;
    }
    console.log(`최근 실패 ${recent.length}건 (최신 순):\n`);
    for (let i = 0; i < recent.length; i++) {
      let content: { title?: string; error?: string } = {};
      try {
        content = JSON.parse(await readFile(recent[i], "utf-8"));
      } catch {
        // ignore
      }
      const err = content.error ? content.error.split("\n")[0].trim() : "-";
      console.log(`${i + 1}. ${content.title || "(제목 없음)"}`);
      console.log(`   에러: ${err}`);
      console.log(`   로그: ${recent[i]}\n`);
    }
    return;
  }

  const latestLog = await getLatestFile(DOM_LOGS_DIR, ".json");
  if (!latestLog) {
    console.log("dom_logs/ 에 실패 로그가 없습니다.");
    return;
  }

  let logContent: { dumpPath?: string; title?: string; error?: string; url?: string } = {};
  try {
    const raw = await readFile(latestLog.path, "utf-8");
    logContent = JSON.parse(raw);
  } catch {
    // ignore
  }

  const dumpPath = logContent.dumpPath || join(DOM_DUMPS_DIR, latestLog.path.replace(/^.*[/\\]/, "").replace(/\.json$/, ".html"));
  console.log("마지막 실패 로그:", latestLog.path);
  console.log("대응 DOM 덤프:", dumpPath);
  if (logContent.title) console.log("테스트:", logContent.title);
  if (logContent.error) console.log("에러:", logContent.error);
  if (logContent.url) console.log("URL:", logContent.url);

  if (openDump) {
    const { execSync } = await import("node:child_process");
    const open =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
          ? "start"
          : "xdg-open";
    try {
      execSync(`${open} "${dumpPath}"`, { stdio: "inherit" });
    } catch {
      console.log("덤프 파일을 열 수 없습니다. 위 경로를 수동으로 열어보세요.");
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
