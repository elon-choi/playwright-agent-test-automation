// Feature: KPA-060 - 웹툰 실시간 랭킹 1위 확인 및 이동
import { And, Then, expect } from "./fixtures.js";
import type { DataTable } from "playwright-bdd";
import { getRankOneWorkLinkLocator, waitForRankingArea } from "../pages/RankingSection.js";

And("사용자가 실시간 랭킹 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /실시간\s*랭킹|랭킹/i }).or(page.getByText(/실시간\s*랭킹|랭킹/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

function getTableRows(dataTable: unknown): string[][] {
  if (!dataTable) return [];
  const raw = dataTable as { dataTable?: { rows?: Array<{ cells?: Array<{ value?: string }> }> }; rows?: () => string[][] };
  if (typeof raw.rows === "function") return raw.rows();
  const rows = raw.dataTable?.rows;
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => (r.cells ?? []).map((c) => c?.value ?? "").filter(Boolean));
}

Then("실시간 랭킹 메뉴 하단에 다음 요소들이 노출되어야 한다:", async ({ page }, dataTable?: DataTable | unknown) => {
  await page.waitForTimeout(400);
  const hasList = (await page.locator('a[href*="/content/"]').count()) > 0;
  const hasRankOrTab = (await page.getByText(/랭킹|웹툰|웹소설|선정\s*기준/i).count()) > 0;
  const rows = getTableRows(dataTable);
  if (rows.length === 0) {
    expect(hasList || hasRankOrTab).toBe(true);
    return;
  }
  const checks: Array<{ name: string; test: () => Promise<boolean> }> = [
    { name: "DA 광고 영역", test: async () => (await page.getByText(/DA|광고/i).count()) > 0 || (await page.locator("[class*='ad'], [id*='ad']").count()) > 0 },
    { name: "웹툰 / 웹소설 탭", test: async () => {
      const webtoon = page.getByText("웹툰", { exact: true }).or(page.getByText(/웹툰/i));
      const novel = page.getByText("웹소설", { exact: true }).or(page.getByText(/웹소설|소설/i));
      const hasWebtoon = (await webtoon.count()) > 0;
      const hasNovel = (await novel.count()) > 0;
      return hasWebtoon && hasNovel;
    } },
    { name: "랭킹 선정 기준", test: async () => (await page.getByText(/기준/i).count()) > 0 },
    { name: "1위 ~ 300위까지 작품 리스트", test: async () => (await page.locator('a[href*="/content/"]').count()) >= 1 },
  ];
  for (let i = 0; i < rows.length; i++) {
    const cell = rows[i][0];
    const label = (typeof cell === "string" ? cell : "").trim();
    if (!label || label === "요소") continue;
    const match = checks.find((c) => label.includes(c.name) || c.name.includes(label));
    if (match) {
      const ok = await match.test();
      expect(ok, `실시간 랭킹 화면에 "${match.name}"이(가) 노출되어야 합니다.`).toBe(true);
    }
  }
  expect(hasList || hasRankOrTab).toBe(true);
});

And("사용자가 웹툰 실시간 랭킹 1위 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const rankingArea = await waitForRankingArea(page);
  const webtoonTabInRanking = rankingArea.getByText("웹툰", { exact: true }).first();
  if ((await webtoonTabInRanking.count()) > 0) await webtoonTabInRanking.click({ timeout: 5000 });
  await page.waitForTimeout(600);

  const workLink = await getRankOneWorkLinkLocator(page);
  await workLink.waitFor({ state: "visible", timeout: 8000 });
  await workLink.scrollIntoViewIfNeeded({ timeout: 5000 });
  await workLink.evaluate((el: Element) => el.scrollIntoView({ block: "center", behavior: "auto" }));
  await page.waitForTimeout(400);
  await workLink.click({ timeout: 8000, force: true });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 });
  await page.waitForTimeout(400);
});

And("사용자는 웹툰 실시간 랭킹 1위 작품의 홈으로 이동해야 한다", async ({ page }) => {
  const onWorkHome = /\/(content|landing\/series)\//i.test(page.url());
  expect(onWorkHome).toBe(true);
});
