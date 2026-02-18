// report-site/reports/*/summary.json list -> report-site/index.html (run history for GitHub Pages)
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const REPORT_SITE = process.env.REPORT_SITE || "report-site";
const REPORTS_DIR = join(REPORT_SITE, "reports");

async function loadSummaries() {
  const entries = await readdir(REPORTS_DIR, { withFileTypes: true }).catch(() => []);
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const summaries = [];
  for (const dir of dirs) {
    const p = join(REPORTS_DIR, dir, "summary.json");
    try {
      const raw = await readFile(p, "utf-8");
      const data = JSON.parse(raw);
      summaries.push({ id: dir, ...data });
    } catch {
      // skip invalid or missing summary
    }
  }
  summaries.sort((a, b) => (b.timestamp || b.id).localeCompare(a.timestamp || a.id));
  return summaries;
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  });
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDuration(sec) {
  if (sec == null) return "-";
  if (sec < 60) return `${Math.round(sec)}초`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s ? `${m}분 ${s}초` : `${m}분`;
}

function buildHtml(summaries) {
  const rows = summaries
    .map(
      (s) =>
        `<tr>
  <td>${formatDate(s.date)}</td>
  <td>${formatTime(s.date)}</td>
  <td><a href="reports/${s.id}/index.html">${s.id}</a></td>
  <td>${s.total ?? "-"}</td>
  <td class="pass">${s.passed ?? 0}</td>
  <td class="fail">${s.failed ?? 0}</td>
  <td>${s.skipped ?? 0}</td>
  <td>${formatDuration(s.durationSeconds)}</td>
</tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Playwright 테스트 실행 이력</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; background: #1a1a1a; color: #e0e0e0; }
    h1 { font-size: 1.5rem; }
    table { border-collapse: collapse; width: 100%; max-width: 900px; }
    th, td { border: 1px solid #444; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #333; }
    a { color: #6eb; }
    a:hover { text-decoration: underline; }
    .pass { color: #6eb; }
    .fail { color: #e66; }
    .meta { color: #888; font-size: 0.9rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h1>Playwright 테스트 실행 이력</h1>
  <p class="meta">요일/실행 주기별 이전 Run을 클릭하면 해당 시점의 상세 리포트를 볼 수 있습니다.</p>
  <table>
    <thead>
      <tr>
        <th>날짜</th>
        <th>시각</th>
        <th>Run</th>
        <th>총계</th>
        <th>통과</th>
        <th>실패</th>
        <th>스킵</th>
        <th>소요</th>
      </tr>
    </thead>
    <tbody>${rows || "<tr><td colspan=\"8\">아직 실행 이력이 없습니다.</td></tr>"}
    </tbody>
  </table>
</body>
</html>`;
}

async function main() {
  const summaries = await loadSummaries();
  const html = buildHtml(summaries);
  const outPath = join(REPORT_SITE, "index.html");
  await writeFile(outPath, html, "utf-8");
  console.log("Wrote", outPath, "(" + summaries.length + " runs)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
