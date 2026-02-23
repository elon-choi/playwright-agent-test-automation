// Feature: KPA-063 웹툰 GNB 및 요일 서브탭 검증
import { And, Then, expect } from "./fixtures.js";
import type { DataTable } from "playwright-bdd";
import { setSelectedWorkUrl } from "./kpa-061.steps.js";

function getTableRows(dataTable: unknown): string[][] {
  if (!dataTable) return [];
  const raw = dataTable as { dataTable?: { rows?: Array<{ cells?: Array<{ value?: string }> }> }; rows?: () => string[][] };
  if (typeof raw.rows === "function") return raw.rows();
  const rows = raw.dataTable?.rows;
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => (r.cells ?? []).map((c) => c?.value ?? "").filter(Boolean));
}

And("요일 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(800);
  const byDataAttr = page.locator('div[data-t-obj*="요일"]').first();
  const byStructure = page.locator('div.cursor-pointer').filter({
    has: page.locator('span.font-small1').filter({ hasText: /^요일$/ }),
  }).first();
  let clickTarget = null;
  if ((await byDataAttr.count()) > 0) {
    clickTarget = byDataAttr;
  } else if ((await byStructure.count()) > 0) {
    clickTarget = byStructure;
  } else {
    clickTarget = page.locator("main").first().locator("div, a, button, span").filter({ hasText: /^요일$/ }).first();
  }
  await clickTarget.waitFor({ state: "attached", timeout: 10000 });
  await clickTarget.scrollIntoViewIfNeeded({ timeout: 5000 });
  await page.waitForTimeout(300);
  await clickTarget.click({ timeout: 10000, force: true });
  const deadline = Date.now() + 8000;
  let onDayMenu = false;
  while (Date.now() < deadline) {
    await page.waitForTimeout(800);
    const hasFilter = (await page.getByText(/기다무|전체|연재무료|장르/i).count()) > 0;
    const hasTabLink = (await page.locator('a[href*="bm=W"], a[href*="tab_uid="]').count()) > 0;
    const hasTabsAndList = (await page.getByText(/신작|요일|완결/i).count()) >= 2 && (await page.locator('a[href*="/content/"]').count()) >= 1;
    onDayMenu = hasFilter || hasTabLink || hasTabsAndList;
    if (onDayMenu) break;
  }
  expect(onDayMenu, "요일 서브탭 클릭 후 요일 메뉴(기다무/전체/연재무료/장르 또는 작품 리스트)가 노출되어야 합니다.").toBe(true);
});

Then("요일 메뉴 하단에 다음과 같은 메뉴가 노출된다:", async ({ page }, dataTable?: DataTable | unknown) => {
  await page.waitForTimeout(500);
  const rows = getTableRows(dataTable);
  const checks: Array<{ name: string; test: () => Promise<boolean> }> = [
    { name: "신작 / 요일 (월~일) / 완결 메뉴", test: async () => (await page.getByText(/신작|요일|완결|월~일/i).count()) > 0 },
    { name: "신작 / 요일 / 완결 메뉴", test: async () => (await page.getByText(/신작|요일|완결/i).count()) > 0 },
    { name: "전체 / 기다무 웹툰 / 연재무료 / 장르 필터", test: async () => (await page.getByText(/전체|기다무|연재무료|장르/i).count()) > 0 },
    { name: "선택한 요일에 연재 중인 웹툰 작품 리스트", test: async () => (await page.locator('a[href*="/content/"]').count()) >= 1 },
  ];
  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const label = (rows[i][0] ?? "").trim();
      if (!label || label === "항목") continue;
      const match = checks.find((c) => label.includes(c.name) || c.name.includes(label));
      if (match) {
        const ok = await match.test();
        expect(ok, `요일 메뉴에 "${match.name}"이(가) 노출되어야 합니다.`).toBe(true);
      }
    }
  }
});

And("신작탭 > 기다무웹툰 메뉴를 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(400);
  const root = page.locator("#__next");
  const sinjakLink = root.locator("a").filter({ has: page.locator("div span").filter({ hasText: /^신작$/ }) }).filter({ hasText: /^신작$/ }).first();
  const sinjakFallback = page.locator('a').filter({ hasText: /^신작$/ }).first();
  const sinjakTab = (await sinjakLink.count()) > 0 ? sinjakLink : sinjakFallback;
  await sinjakTab.waitFor({ state: "attached", timeout: 8000 });
  await sinjakTab.scrollIntoViewIfNeeded({ timeout: 5000 });
  await page.waitForTimeout(200);
  await sinjakTab.click({ timeout: 8000, force: true });
  await page.waitForTimeout(600);
  const gidamooLink = page.locator('a').filter({ hasText: /기다무\s*웹툰/ }).first();
  await gidamooLink.waitFor({ state: "attached", timeout: 10000 });
  await gidamooLink.scrollIntoViewIfNeeded({ timeout: 5000 });
  await page.waitForTimeout(300);
  await gidamooLink.click({ timeout: 8000, force: true });
  await page.waitForTimeout(600);
});

Then("기다무 BM 작품 리스트가 화면에 노출된다.", async ({ page }) => {
  await page.waitForTimeout(500);
  const list = page.locator('a[href*="/content/"]');
  await list.first().waitFor({ state: "visible", timeout: 10000 });
  expect(await list.count()).toBeGreaterThanOrEqual(1);
});

And("사용자는 첫번째 작품을 클릭한다.", async ({ page }) => {
  const workCard = page.locator('a[href*="/content/"]').first();
  await workCard.waitFor({ state: "visible", timeout: 15000 });
  await workCard.scrollIntoViewIfNeeded({ block: "center" }).catch(() => null);
  const href = await workCard.getAttribute("href").catch(() => null);
  if (href) setSelectedWorkUrl(href.startsWith("http") ? href : new URL(href, page.url()).href);
  await workCard.click({ timeout: 15000, force: true });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 });
  await page.waitForTimeout(500);
});

And("작품의 작품홈으로 이동한다", async ({ page }) => {
  const pathname = new URL(page.url()).pathname;
  const isWorkHome = /\/(content|landing\/series)\//i.test(pathname);
  expect(isWorkHome, `클릭한 작품의 작품홈으로 이동했어야 합니다. 현재: ${pathname}`).toBe(true);
});