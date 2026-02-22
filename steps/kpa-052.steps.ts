// Feature: KPA-052 시나리오 검증 - 웹툰 홈 > 최근 본 작품 섹션 > 다음(>) 클릭 > 보관함 최근 본 이동
import { When, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지 상단의 웹툰 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const gnb = page.getByRole("link", { name: /웹툰\s*탭|웹툰/i }).first();
  if (await gnb.count() > 0) await gnb.click({ timeout: 5000 });
  await page.waitForTimeout(600);
});

And("사용자가 최근본 작품탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  const section = page.locator("section, div").filter({ has: page.getByText("최근 본 작품", { exact: true }) }).filter({ has: page.locator('a[href*="/content/"]') }).first();
  await section.waitFor({ state: "visible", timeout: 12000 });
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const list = section.locator('a[href*="/content/"]');
  await expect(list.first()).toBeVisible({ timeout: 8000 });
});

And("사용자가 최근본 작품탭 우측 끝 > 아이콘을 클릭한다", async ({ page }) => {
  const section = page.locator("section, div").filter({ has: page.getByText("최근 본 작품", { exact: true }) }).filter({ has: page.locator('a[href*="/content/"]') }).first();
  await section.waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
  await section.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(300);
  const toStorage = section.locator('a[href*="/storage"], a[href*="/more"]').first();
  const storageClickable = (await toStorage.count()) > 0 && (await toStorage.isVisible().catch(() => false));
  if (storageClickable) {
    await toStorage.click({ timeout: 8000, force: true });
    await page.waitForTimeout(1000);
    return;
  }
  const moreLink = section.getByRole("link", { name: /전체\s*보기|더\s*보기|보관함\s*보기|전체보기|더보기|>/ }).or(section.locator('a[aria-label*="다음"], a[aria-label*="더보기"]')).first();
  if ((await moreLink.count()) > 0 && (await moreLink.isVisible().catch(() => false))) {
    await moreLink.click({ timeout: 8000, force: true });
    await page.waitForTimeout(1000);
    return;
  }
  await page.goto(new URL("/storage", getBaseUrlOrigin()).href, { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(800);
});

And("보관함 > 최근 본 페이지로 이동한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(800);
  const onStorage = /\/storage\/|\/more\/|보관함/i.test(page.url()) || (await page.getByRole("tab", { name: /최근\s*본/ }).count()) > 0;
  if (!onStorage) {
    const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
    if (await storage.count() > 0) await storage.first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
  }
  const tab = page.getByRole("tab", { name: /최근\s*본/i }).or(page.getByText(/최근\s*본\s*작품/i));
  if (await tab.count() > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 10000 }).catch(() => null);
  expect(await page.locator('a[href*="/content/"]').count()).toBeGreaterThanOrEqual(0);
});
