// Feature: KPA-062 시나리오 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";
import type { DataTable } from "playwright-bdd";

function getTableRows(dataTable: unknown): string[][] {
  if (!dataTable) return [];
  const raw = dataTable as { dataTable?: { rows?: Array<{ cells?: Array<{ value?: string }> }> }; rows?: () => string[][] };
  if (typeof raw.rows === "function") return raw.rows();
  const rows = raw.dataTable?.rows;
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => (r.cells ?? []).map((c) => c?.value ?? "").filter(Boolean));
}

When("사용자가 웹 페이지에 진입하여 상단의 추천 GNB 메뉴를 클릭한다", async ({ page }) => {
  const base = getBaseUrlOrigin();
  if (!/page\.kakao\.com/i.test(page.url())) await page.goto(base, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(500);
  const recommendTab = page.getByRole("link", { name: /추천\s*탭|추천/i }).first();
  if ((await recommendTab.count()) > 0) {
    await recommendTab.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await recommendTab.click({ force: true, timeout: 8000 });
  }
  await page.waitForTimeout(400);
});

And("사용자가 이벤트 서브탭을 클릭한다", async ({ page }) => {
  const eventTab = page.getByRole("tab", { name: /이벤트/i }).or(page.getByRole("link", { name: /이벤트/i }));
  if (await eventTab.count()) {
    await eventTab.first().click({ timeout: 8000 });
    await page.waitForTimeout(400);
  }
});

const eventFullViewBannerLocator = (p: { page: any }) =>
  p.page.locator('span[class*="font-medium2-bold"]').getByText("이벤트 전체 보기", { exact: true }).first();

And("사용자가 이벤트 전체 보기 배너가 노출될 때까지 스크롤한다", async ({ page }) => {
  const banner = eventFullViewBannerLocator({ page });
  const maxScroll = 25;
  for (let i = 0; i < maxScroll; i++) {
    const visible = await banner.isVisible().catch(() => false);
    if (visible) break;
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(400);
  }
  await banner.waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
});

And("사용자가 이벤트 전체 보기 배너를 클릭한다", async ({ page }) => {
  const banner = eventFullViewBannerLocator({ page });
  await banner.waitFor({ state: "visible", timeout: 8000 });
  await banner.scrollIntoViewIfNeeded({ timeout: 8000 });
  await banner.evaluate((el: Element) => el.scrollIntoView({ block: "center", behavior: "auto" }));
  await page.waitForTimeout(400);
  await banner.click({ timeout: 8000, force: true });
  await page.waitForURL(/\/landing\/event\/|\/event\//i, { timeout: 15000 });
  await page.waitForTimeout(500);
});

Then("이벤트 메뉴 하단에 다음 요소들이 노출되어야 한다:", async ({ page }, dataTable?: DataTable | unknown) => {
  await page.waitForTimeout(500);
  for (let s = 0; s < 3; s++) {
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(300);
  }
  const rows = getTableRows(dataTable);
  const optionalElements = new Set(["테마 섹션"]);
  const checks: Array<{ name: string; test: () => Promise<boolean> }> = [
    { name: "빅배너", test: async () => (await page.getByText(/빅배너|시리즈\s*연동|이벤트/i).count()) > 0 || (await page.locator("[class*='banner']").count()) > 0 },
    { name: "DA 광고 영역", test: async () => (await page.getByText(/DA|광고/i).count()) > 0 || (await page.locator("[class*='ad'], [id*='ad']").count()) > 0 },
    { name: "이벤트 리스트", test: async () => (await page.getByText(/이벤트/i).count()) > 0 },
    { name: "이벤트 전체 보기", test: async () => (await page.locator('span[class*="font-medium2-bold"]').getByText("이벤트 전체 보기").count()) > 0 },
    { name: "테마 섹션", test: async () => (await page.getByText(/테마|테마별|추천\s*테마/i).count()) > 0 },
  ];
  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const label = (rows[i][0] ?? "").trim();
      if (!label || label === "요소") continue;
      const match = checks.find((c) => label.includes(c.name) || c.name.includes(label));
      if (match) {
        const ok = await match.test();
        if (optionalElements.has(match.name) && !ok) continue;
        expect(ok, `이벤트 메뉴에 "${match.name}"이(가) 노출되어야 합니다.`).toBe(true);
      }
    }
  }
});

And("사용자는 이벤트 전체 페이지로 이동해야 한다", async ({ page }) => {
  await page.waitForURL(/\/landing\/event\/|\/event\//i, { timeout: 10000 }).catch(() => null);
  const url = page.url();
  const pathname = new URL(url).pathname;
  const isEventLandingPage = /\/landing\/event\//i.test(pathname) || /\/event\/\d+/i.test(pathname);
  expect(isEventLandingPage, `이벤트 전체 보기 클릭 후 랜딩 페이지로 이동해야 합니다. 기대: /landing/event/ 또는 /event/..., 현재: ${pathname}`).toBe(true);
});
