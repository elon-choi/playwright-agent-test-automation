// report-site/reports/*/summary.json → report-site/index.html (dashboard with charts)
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const REPORT_SITE = process.env.REPORT_SITE || "report-site";
const REPORTS_DIR = join(REPORT_SITE, "reports");

async function loadSummaries() {
  const entries = await readdir(REPORTS_DIR, { withFileTypes: true }).catch(() => []);
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const summaries = [];
  // 이전 testType 값 → 새 값 매핑
  const TYPE_MIGRATION = { "전체": "통합", "핵심": "코어" };

  for (const dir of dirs) {
    const p = join(REPORTS_DIR, dir, "summary.json");
    try {
      const raw = await readFile(p, "utf-8");
      const data = JSON.parse(raw);
      const entry = { id: dir, project: "카카오페이지", platform: "PCW", testType: "통합", ...data };
      entry.testType = TYPE_MIGRATION[entry.testType] || entry.testType;
      // 코어 데이터는 디렉토리 summary에서 제외 (healthcheck-history.json에서 로드)
      if (entry.testType === "코어") continue;
      summaries.push(entry);
    } catch {
      // skip
    }
  }

  // healthcheck-history.json에서 코어 데이터 로드 (Heartbeat UI 전용)
  const hcPath = join(REPORTS_DIR, "healthcheck-history.json");
  try {
    const raw = await readFile(hcPath, "utf-8");
    const history = JSON.parse(raw);
    for (const h of history) {
      summaries.push({ id: h.runId || "hc", project: "카카오페이지", platform: "PCW", testType: "코어", ...h });
    }
  } catch {
    // no healthcheck history yet
  }

  summaries.sort((a, b) => (b.timestamp || b.id).localeCompare(a.timestamp || a.id));
  return summaries;
}

function buildHtml(summaries) {
  const dataJson = JSON.stringify(summaries);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Playwright 테스트 대시보드</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Pretendard', system-ui, -apple-system, sans-serif; background: #0f1117; color: #e0e0e0; }

    /* Header */
    .header { background: #1a1d28; padding: 1.25rem 2rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #2a2d3a; }
    .header h1 { font-size: 1.25rem; font-weight: 700; color: #fff; }
    .header .badge { background: #3b82f6; color: #fff; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; font-weight: 600; }

    /* Filters */
    .filters { background: #1a1d28; padding: 1rem 2rem; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; border-bottom: 1px solid #2a2d3a; }
    .filter-group { display: flex; align-items: center; gap: 0.4rem; }
    .filter-group label { font-size: 0.8rem; color: #888; font-weight: 500; }
    select {
      background: #252836; color: #e0e0e0; border: 1px solid #3a3d4a; border-radius: 6px;
      padding: 0.4rem 0.6rem; font-size: 0.85rem; cursor: pointer; outline: none;
    }
    select:hover { border-color: #5a5d6a; }
    select:focus { border-color: #3b82f6; }

    /* Content */
    .content { padding: 1.5rem 2rem; max-width: 1400px; margin: 0 auto; }

    /* Summary cards */
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .card { background: #1a1d28; border-radius: 10px; padding: 1.25rem; border: 1px solid #2a2d3a; }
    .card .card-label { font-size: 0.75rem; color: #888; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .card .card-value { font-size: 1.75rem; font-weight: 700; }
    .card .card-sub { font-size: 0.75rem; color: #666; margin-top: 0.25rem; }
    .v-total { color: #e0e0e0; }
    .v-pass { color: #34d399; }
    .v-fail { color: #f87171; }
    .v-rate { color: #60a5fa; }
    .v-duration { color: #fbbf24; }

    /* Charts */
    .charts { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .chart-box { background: #1a1d28; border-radius: 10px; padding: 1.25rem; border: 1px solid #2a2d3a; }
    .chart-box h3 { font-size: 0.9rem; color: #ccc; margin-bottom: 0.75rem; font-weight: 600; }
    .chart-box canvas { max-height: 220px; }
    .chart-full { grid-column: 1 / -1; }
    .chart-full canvas { max-height: 160px; }

    /* Table */
    .table-section { background: #1a1d28; border-radius: 10px; padding: 1.25rem; border: 1px solid #2a2d3a; }
    .table-section h3 { font-size: 0.9rem; color: #ccc; margin-bottom: 0.75rem; font-weight: 600; }
    table { border-collapse: collapse; width: 100%; font-size: 0.85rem; }
    th, td { padding: 0.6rem 0.75rem; text-align: left; border-bottom: 1px solid #2a2d3a; }
    th { color: #888; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; background: #151720; position: sticky; top: 0; }
    td { color: #ccc; }
    tr:hover td { background: #1e2130; }
    .pass { color: #34d399; font-weight: 600; }
    .fail { color: #f87171; font-weight: 600; }
    a { color: #60a5fa; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .empty-msg { text-align: center; padding: 3rem; color: #666; }

    /* Heartbeat */
    .heartbeat-section { background: #1a1d28; padding: 1.5rem 2rem; border-bottom: 1px solid #2a2d3a; }
    .heartbeat-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .heartbeat-header h2 { font-size: 1.1rem; font-weight: 600; color: #ccc; }
    .heartbeat-status { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; font-weight: 600; }
    .heartbeat-status.up { color: #34d399; }
    .heartbeat-status.down { color: #f87171; }
    .heartbeat-status.unknown { color: #888; }
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .pulse-dot.up { background: #34d399; box-shadow: 0 0 6px #34d399; animation: pulse 2s ease-in-out infinite; }
    .pulse-dot.down { background: #f87171; box-shadow: 0 0 6px #f87171; }
    .pulse-dot.unknown { background: #555; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
    .heartbeat-timeline { display: flex; align-items: flex-end; gap: 2px; height: 40px; }
    .hb-bar { width: 6px; min-height: 4px; border-radius: 1px; cursor: pointer; transition: opacity 0.15s; position: relative; }
    .hb-bar:hover { opacity: 0.7; }
    .hb-bar.pass { background: #34d399; }
    .hb-bar.fail { background: #f87171; }
    .hb-bar.partial { background: linear-gradient(to top, #f87171 0%, #f87171 var(--fail-pct), #34d399 var(--fail-pct), #34d399 100%); }
    .hb-tooltip { display: none; position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); background: #252836; color: #e0e0e0; padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 0.7rem; white-space: nowrap; z-index: 10; border: 1px solid #3a3d4a; pointer-events: none; }
    .hb-bar:hover .hb-tooltip { display: block; }
    .heartbeat-meta { display: flex; gap: 1.5rem; margin-top: 0.75rem; font-size: 0.8rem; color: #666; }

    @media (max-width: 768px) {
      .charts { grid-template-columns: 1fr; }
      .filters { padding: 0.75rem 1rem; }
      .content { padding: 1rem; }
      .heartbeat-section { padding: 0.75rem 1rem; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Playwright 테스트 대시보드</h1>
    <span class="badge">LIVE</span>
  </div>

  <div class="heartbeat-section" id="heartbeatSection"></div>

  <div class="filters">
    <div class="filter-group">
      <label>프로젝트</label>
      <select id="filterProject"></select>
    </div>
    <div class="filter-group">
      <label>플랫폼</label>
      <select id="filterPlatform"></select>
    </div>
    <div class="filter-group">
      <label>타입</label>
      <select id="filterType"></select>
    </div>
    <div class="filter-group" style="margin-left:1rem;">
      <label>년</label>
      <select id="filterYear"></select>
    </div>
    <div class="filter-group">
      <label>월</label>
      <select id="filterMonth"></select>
    </div>
    <div class="filter-group">
      <label>일</label>
      <select id="filterDay"></select>
    </div>
  </div>

  <div class="content">
    <div class="summary-cards" id="summaryCards"></div>

    <div class="charts">
      <div class="chart-box">
        <h3>통과 / 실패 추이</h3>
        <canvas id="chartPassFail"></canvas>
      </div>
      <div class="chart-box">
        <h3>성공률 추이 (%)</h3>
        <canvas id="chartRate"></canvas>
      </div>
      <div class="chart-box chart-full">
        <h3>소요 시간 추이 (분)</h3>
        <canvas id="chartDuration"></canvas>
      </div>
    </div>

    <div class="table-section">
      <h3>실행 이력</h3>
      <div style="max-height:500px; overflow-y:auto;">
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>시각</th>
              <th>Run</th>
              <th>프로젝트</th>
              <th>플랫폼</th>
              <th>타입</th>
              <th>총계</th>
              <th>통과</th>
              <th>실패</th>
              <th>스킵</th>
              <th>성공률</th>
              <th>소요</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>
    </div>
  </div>

<script>
const ALL_DATA = ${dataJson};

// ── Helpers ──
function fmtDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit', weekday:'short' });
}
function fmtTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('ko-KR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
function fmtDuration(sec) {
  if (sec == null) return '-';
  if (sec < 60) return Math.round(sec) + '초';
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return s ? m + '분 ' + s + '초' : m + '분';
}
function fmtRate(p, t) { return t > 0 ? (p / t * 100).toFixed(1) + '%' : '-'; }
function dateKey(iso) { return iso ? iso.slice(0, 10) : ''; }

// ── Filters ──
const $proj = document.getElementById('filterProject');
const $plat = document.getElementById('filterPlatform');
const $type = document.getElementById('filterType');
const $year = document.getElementById('filterYear');
const $month = document.getElementById('filterMonth');
const $day = document.getElementById('filterDay');

function unique(arr) { return [...new Set(arr)].sort(); }

function initFilters() {
  const projects = unique(ALL_DATA.map(d => d.project || '카카오페이지'));
  const platforms = unique(ALL_DATA.map(d => d.platform || 'PCW'));
  const types = unique(ALL_DATA.map(d => d.testType || '통합').filter(t => t !== '코어'));
  fillSelect($proj, projects, '전체');
  fillSelect($plat, platforms, '전체');
  fillSelect($type, types, '전체');
  // 타입이 1개뿐이면 필터 숨김
  $type.closest('.filter-group').style.display = types.length <= 1 ? 'none' : '';
  populateDateFilters();
}

function fillSelect(el, items, allLabel) {
  el.innerHTML = '<option value="">' + allLabel + '</option>' + items.map(v => '<option value="' + v + '">' + v + '</option>').join('');
}

function populateDateFilters() {
  const filtered = getProjectPlatformFiltered();
  const dates = filtered.map(d => d.date || d.timestamp || '').filter(Boolean);
  const years = unique(dates.map(d => d.slice(0, 4)));
  const selYear = $year.value;
  fillSelect($year, years, '전체');
  if (years.includes(selYear)) $year.value = selYear;

  const months = unique(dates.filter(d => !$year.value || d.startsWith($year.value)).map(d => d.slice(5, 7)));
  const selMonth = $month.value;
  fillSelect($month, months, '전체');
  if (months.includes(selMonth)) $month.value = selMonth;

  const days = unique(dates.filter(d => {
    if ($year.value && !d.startsWith($year.value)) return false;
    if ($month.value && d.slice(5, 7) !== $month.value) return false;
    return true;
  }).map(d => d.slice(8, 10)));
  const selDay = $day.value;
  fillSelect($day, days, '전체');
  if (days.includes(selDay)) $day.value = selDay;
}

function getProjectPlatformFiltered() {
  return ALL_DATA.filter(d => {
    if ($proj.value && (d.project || '카카오페이지') !== $proj.value) return false;
    if ($plat.value && (d.platform || 'PCW') !== $plat.value) return false;
    const dtype = d.testType || '통합';
    if ($type.value) {
      if (dtype !== $type.value) return false;
    } else {
      if (dtype === '코어') return false;
    }
    return true;
  });
}

function getFiltered() {
  return ALL_DATA.filter(d => {
    if ($proj.value && (d.project || '카카오페이지') !== $proj.value) return false;
    if ($plat.value && (d.platform || 'PCW') !== $plat.value) return false;
    // 타입 필터: 기본(빈값)일 때 코어 헬스체크는 제외 (상단 심장박동 UI에서 표시)
    const dtype = d.testType || '통합';
    if ($type.value) {
      if (dtype !== $type.value) return false;
    } else {
      if (dtype === '코어') return false;
    }
    const iso = d.date || d.timestamp || '';
    if ($year.value && !iso.startsWith($year.value)) return false;
    if ($month.value && iso.slice(5, 7) !== $month.value) return false;
    if ($day.value && iso.slice(8, 10) !== $day.value) return false;
    return true;
  });
}

[$proj, $plat, $type].forEach(el => el.addEventListener('change', () => { populateDateFilters(); render(); }));
[$year].forEach(el => el.addEventListener('change', () => { populateDateFilters(); render(); }));
[$month].forEach(el => el.addEventListener('change', () => { populateDateFilters(); render(); }));
[$day].forEach(el => el.addEventListener('change', () => { render(); }));

// ── Summary Cards ──
function renderCards(data) {
  const totalRuns = data.length;
  const totalTests = data.reduce((s, d) => s + (d.total || 0), 0);
  const totalPass = data.reduce((s, d) => s + (d.passed || 0), 0);
  const totalFail = data.reduce((s, d) => s + (d.failed || 0), 0);
  const avgRate = totalTests > 0 ? (totalPass / totalTests * 100).toFixed(1) : '0.0';
  const avgDur = data.filter(d => d.durationSeconds).length > 0
    ? Math.round(data.reduce((s, d) => s + (d.durationSeconds || 0), 0) / data.filter(d => d.durationSeconds).length / 60)
    : 0;

  document.getElementById('summaryCards').innerHTML =
    card('총 실행', totalRuns + '회', '필터 기간 내', 'v-total') +
    card('평균 통과', totalPass > 0 ? Math.round(totalPass / totalRuns) + '건' : '0건', '실행당 평균', 'v-pass') +
    card('평균 실패', totalFail > 0 ? Math.round(totalFail / totalRuns) + '건' : '0건', '실행당 평균', 'v-fail') +
    card('평균 성공률', avgRate + '%', '전체 기간', 'v-rate') +
    card('평균 소요', avgDur + '분', '실행당 평균', 'v-duration');
}

function card(label, value, sub, cls) {
  return '<div class="card"><div class="card-label">' + label + '</div><div class="card-value ' + cls + '">' + value + '</div><div class="card-sub">' + sub + '</div></div>';
}

// ── Charts ──
let chartPF, chartRate, chartDur;

function renderCharts(data) {
  // 일별 집계 (오래된 순)
  const reversed = [...data].reverse();
  const byDay = new Map();
  for (const d of reversed) {
    const dk = dateKey(d.date || d.timestamp);
    if (!dk) continue;
    if (!byDay.has(dk)) byDay.set(dk, { passed: 0, failed: 0, total: 0, dur: 0, cnt: 0 });
    const b = byDay.get(dk);
    b.passed += d.passed || 0;
    b.failed += d.failed || 0;
    b.total += d.total || 0;
    if (d.durationSeconds) { b.dur += d.durationSeconds; b.cnt += 1; }
  }

  const labels = [...byDay.keys()].map(k => k.slice(5)); // MM-DD
  const passArr = [...byDay.values()].map(v => v.passed);
  const failArr = [...byDay.values()].map(v => v.failed);
  const rateArr = [...byDay.values()].map(v => v.total > 0 ? +(v.passed / v.total * 100).toFixed(1) : 0);
  const durArr = [...byDay.values()].map(v => v.cnt > 0 ? +(v.dur / v.cnt / 60).toFixed(1) : 0);

  const commonOpts = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { labels: { color: '#aaa', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#888', font: { size: 10 } }, grid: { color: '#2a2d3a' } },
      y: { ticks: { color: '#888', font: { size: 10 } }, grid: { color: '#2a2d3a' }, beginAtZero: true }
    }
  };

  if (chartPF) chartPF.destroy();
  chartPF = new Chart(document.getElementById('chartPassFail'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: '통과', data: passArr, backgroundColor: '#34d39980', borderColor: '#34d399', borderWidth: 1 },
        { label: '실패', data: failArr, backgroundColor: '#f8717180', borderColor: '#f87171', borderWidth: 1 }
      ]
    },
    options: { ...commonOpts, scales: { ...commonOpts.scales, x: { ...commonOpts.scales.x, stacked: true }, y: { ...commonOpts.scales.y, stacked: true } } }
  });

  if (chartRate) chartRate.destroy();
  chartRate = new Chart(document.getElementById('chartRate'), {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: '성공률 (%)', data: rateArr, borderColor: '#60a5fa', backgroundColor: '#60a5fa20', fill: true, tension: 0.3, pointRadius: 3 }]
    },
    options: { ...commonOpts, scales: { ...commonOpts.scales, y: { ...commonOpts.scales.y, min: 0, max: 100 } } }
  });

  if (chartDur) chartDur.destroy();
  chartDur = new Chart(document.getElementById('chartDuration'), {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: '소요 시간 (분)', data: durArr, borderColor: '#fbbf24', backgroundColor: '#fbbf2420', fill: true, tension: 0.3, pointRadius: 3 }]
    },
    options: commonOpts
  });
}

// ── Table ──
function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" class="empty-msg">필터 조건에 맞는 실행 이력이 없습니다.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(s => '<tr>' +
    '<td>' + fmtDate(s.date) + '</td>' +
    '<td>' + fmtTime(s.date) + '</td>' +
    '<td><a href="reports/' + s.id + '/index.html">' + s.id + '</a></td>' +
    '<td>' + (s.project || '카카오페이지') + '</td>' +
    '<td>' + (s.platform || 'PCW') + '</td>' +
    '<td>' + (s.testType || '통합') + '</td>' +
    '<td>' + (s.total ?? '-') + '</td>' +
    '<td class="pass">' + (s.passed ?? 0) + '</td>' +
    '<td class="fail">' + (s.failed ?? 0) + '</td>' +
    '<td>' + (s.skipped ?? 0) + '</td>' +
    '<td>' + fmtRate(s.passed, s.total) + '</td>' +
    '<td>' + fmtDuration(s.durationSeconds) + '</td>' +
    '</tr>').join('');
}

// ── Heartbeat ──
function renderHeartbeat() {
  const hbData = ALL_DATA.filter(d => (d.testType || '통합') === '코어').sort((a, b) => (a.timestamp || a.id).localeCompare(b.timestamp || b.id));
  const section = document.getElementById('heartbeatSection');

  if (hbData.length === 0) {
    section.innerHTML = '<div class="heartbeat-header"><h2>Healthcheck</h2><span class="heartbeat-status unknown"><span class="pulse-dot unknown"></span> 데이터 없음</span></div><div style="font-size:0.8rem;color:#666;">코어 시나리오 실행 결과가 아직 없습니다.</div>';
    return;
  }

  const last = hbData[hbData.length - 1];
  const isUp = last.failed === 0;
  const statusClass = isUp ? 'up' : 'down';
  const statusText = isUp ? 'UP' : 'DOWN';
  const lastTime = fmtDate(last.date) + ' ' + fmtTime(last.date);

  // 최근 60건만 표시 (5분 간격이면 ~5시간)
  const recent = hbData.slice(-60);
  const maxTotal = Math.max(...recent.map(d => d.total || 1), 1);

  const bars = recent.map(d => {
    const total = d.total || 0;
    const passed = d.passed || 0;
    const failed = d.failed || 0;
    const height = Math.max(4, Math.round((total / maxTotal) * 28));
    const rate = total > 0 ? (passed / total * 100).toFixed(0) : '0';
    const time = fmtTime(d.date || d.timestamp);
    const date = (d.date || d.timestamp || '').slice(5, 10);

    let cls = 'pass';
    let style = 'height:' + height + 'px';
    if (failed > 0 && passed > 0) {
      const failPct = Math.round(failed / total * 100);
      cls = 'partial';
      style += ';--fail-pct:' + failPct + '%';
    } else if (failed > 0) {
      cls = 'fail';
    }

    return '<div class="hb-bar ' + cls + '" style="' + style + '"><div class="hb-tooltip">' + date + ' ' + time + '<br>' + rate + '% (' + passed + '/' + total + ')</div></div>';
  }).join('');

  const totalRuns = hbData.length;
  const passRuns = hbData.filter(d => d.failed === 0).length;
  const uptime = totalRuns > 0 ? (passRuns / totalRuns * 100).toFixed(1) : '0.0';

  section.innerHTML =
    '<div class="heartbeat-header">' +
      '<h2>Healthcheck</h2>' +
      '<span class="heartbeat-status ' + statusClass + '"><span class="pulse-dot ' + statusClass + '"></span> ' + statusText + '</span>' +
    '</div>' +
    '<div class="heartbeat-timeline">' + bars + '</div>' +
    '<div class="heartbeat-meta">' +
      '<span>최근 실행: ' + lastTime + '</span>' +
      '<span>가동률: ' + uptime + '% (' + passRuns + '/' + totalRuns + ')</span>' +
      '<span>성공률: ' + fmtRate(last.passed, last.total) + '</span>' +
    '</div>';
}

// ── Render ──
function render() {
  const data = getFiltered();
  renderCards(data);
  renderCharts(data);
  renderTable(data);
}

renderHeartbeat();
initFilters();
render();
</script>
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
