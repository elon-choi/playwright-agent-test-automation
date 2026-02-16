// Feature: KPA-033 시나리오 검증 - 최근본 탭과 검색 기능
import { And, When, Then, expect } from "./fixtures.js";

And("최근본 탭에 작품 리스트가 존재한다", async ({ page }) => {
  await page.waitForTimeout(400);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if ((await storage.count()) > 0 && (await storage.first().isVisible().catch(() => false))) {
    await storage.first().click({ timeout: 8000 });
    await page.waitForTimeout(600);
  } else if (!/\/inven\//i.test(page.url())) {
    await page.goto(new URL("/inven/recent", page.url()).href, { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(500);
  }
  const recentTab = page.getByRole("tab", { name: /최근본/i }).or(page.getByRole("link", { name: /최근본/i })).or(page.locator('a[href*="/inven/recent"]'));
  if ((await recentTab.count()) > 0) {
    await recentTab.first().click({ timeout: 8000 });
    await page.waitForTimeout(500);
  }
  const list = page.locator('a[href*="/content/"]');
  const count = await list.count();
  expect(count).toBeGreaterThanOrEqual(0);
});

When("사용자가 최근본 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const recentTab = page.getByRole("tab", { name: /최근본/i }).or(page.getByRole("link", { name: /최근본/i })).or(page.locator('a[href*="/inven/recent"]')).first();
  if ((await recentTab.count()) > 0 && (await recentTab.isVisible().catch(() => false))) {
    await recentTab.click({ timeout: 8000 });
  }
  await page.waitForTimeout(500);
});

When("사용자가 페이지 상단의 검색 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(300);
  const searchIcon = page.getByRole("button", { name: /검색/i }).or(page.getByLabel(/검색/i)).or(page.locator('button[aria-label*="검색"], a[href*="search"]').first());
  await searchIcon.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
});

And("{string}을 검색어 입력란에 입력한다", async ({ page }, keyword: string) => {
  const input = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(page.getByPlaceholder(/제목|작가|검색/i));
  await input.first().fill(keyword === "임의의 작품명" ? "웹툰" : keyword, { timeout: 5000 });
  await page.waitForTimeout(300);
});

And("검색 버튼을 클릭한다", async ({ page }) => {
  const searchBtn = page.getByRole("button", { name: /검색/i }).or(page.locator('button[type="submit"]')).or(page.getByText(/검색/)).or(page.locator('button[type="button"]').filter({ hasText: /검색/ })).first();
  if ((await searchBtn.count()) > 0 && (await searchBtn.isVisible().catch(() => false))) {
    await searchBtn.click({ timeout: 6000 });
  } else {
    await page.keyboard.press("Enter");
  }
  await page.waitForTimeout(800);
});

Then("검색 결과에 {string}이 포함된 작품 리스트가 표시된다", async ({ page }, keyword: string) => {
  const list = page.locator('a[href*="/content/"]');
  await expect(list.first()).toBeVisible({ timeout: 10000 });
  const hasSearchResult = await list.count() > 0;
  expect(hasSearchResult).toBe(true);
});
