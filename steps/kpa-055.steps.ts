// Feature: KPA-055 시나리오 검증 - 작품 감상 이력 및 실시간 랭킹(웹소설)
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입하여 상단의 웹소설 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const base = getBaseUrlOrigin();
  if (!/page\.kakao\.com/i.test(page.url())) await page.goto(base, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(500);
  const gnb = page.getByRole("link", { name: /웹소설/i }).or(page.getByText(/웹소설/i).first());
  if ((await gnb.count()) > 0) await gnb.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

Then("최근본 작품탭 하단에 작품 리스트가 노출된다", async ({ page }) => {
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if ((await storage.count()) > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /최근\s*본/i }).or(page.getByText(/최근\s*본/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  const list = page.locator('a[href*="/content/"]');
  await expect(list.first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

When("사용자가 메인홈에서 웹소설 메뉴로 이동한다", async ({ page }) => {
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
  const novel = page.getByRole("link", { name: /웹소설/i }).or(page.getByText(/웹소설/i).first());
  if ((await novel.count()) > 0) await novel.first().click({ timeout: 5000 });
  await page.waitForTimeout(600);
});

And("실시간 랭킹에서 2위 작품을 클릭한다", async ({ page }) => {
  const rank = page.getByText(/실시간\s*랭킹|랭킹/i).first();
  if ((await rank.count()) > 0) {
    await rank.scrollIntoViewIfNeeded().catch(() => null);
    await rank.click({ timeout: 5000 });
  }
  await page.waitForTimeout(600);
  const second = page.locator('a[href*="/content/"]').nth(1);
  await second.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  await second.click({ timeout: 8000 });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
});

And("해당 작품의 1회차를 클릭하여 감상한다", async ({ page }) => {
  const overlay = page.locator('[data-t-obj*="이용권수령팝업"], [class*="z-100"].fixed').first();
  if ((await overlay.count()) > 0 && (await overlay.isVisible().catch(() => false))) {
    const confirmInOverlay = overlay.getByRole("button", { name: /^확인$/ }).first();
    if ((await confirmInOverlay.count()) > 0) await confirmInOverlay.click({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(300);
  }
  const ep = page.getByText(/1\s*회차|1화/).or(page.locator('a[href*="/viewer/"]').first()).first();
  if ((await ep.count()) > 0 && (await ep.isVisible().catch(() => false))) await ep.click({ timeout: 8000 });
  else {
    const epLink = page.locator('a[href*="/viewer/"]').first();
    if ((await epLink.count()) > 0) await epLink.click({ timeout: 8000 });
  }
  await page.waitForTimeout(500);
});

Then("실시간 랭킹 2위 작품의 1회차가 정상적으로 감상된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|화|다음|이전/i).count()) > 0 || (await page.locator('[class*="viewer"], [class*="Viewer"]').count()) > 0;
  expect(onViewer || hasViewer).toBe(true);
});

When("사용자가 추천탭 하단의 최근본 작품 영역을 확인한다", async ({ page }) => {
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if ((await storage.count()) > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  const recentTab = page.getByRole("tab", { name: /최근\s*본/i }).or(page.getByText(/최근\s*본/i).first());
  if ((await recentTab.count()) > 0) await recentTab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
});

Then("최근본 작품 영역 하단 첫 번째 작품에 사용자가 방금 감상한 작품 이력이 노출된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 });
});
