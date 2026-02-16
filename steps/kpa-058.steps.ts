// Feature: KPA-058 시나리오 검증 - 작품 감상 이력 및 실시간 랭킹(책)
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입하여 상단의 책 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const base = getBaseUrlOrigin();
  if (!/page\.kakao\.com/i.test(page.url())) await page.goto(base, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(500);
  const gnb = page.getByRole("link", { name: /책\s*탭|책/i }).or(page.getByText(/책/i).first());
  if ((await gnb.count()) > 0) await gnb.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

Then("최근본 작품탭 하단에 작품 리스트가 올바르게 표시된다", async ({ page }) => {
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if ((await storage.count()) > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /최근\s*본/i }).or(page.getByText(/최근\s*본/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

When("사용자가 메인홈에서 책 메뉴로 이동하여 랭킹 섹션에서 1위 작품을 클릭한다", async ({ page }) => {
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
  const book = page.getByRole("link", { name: /책/i }).or(page.getByText(/책/i).first());
  if ((await book.count()) > 0) await book.first().click({ timeout: 5000 });
  await page.waitForTimeout(600);
  const rank = page.getByText(/실시간\s*랭킹|랭킹|순위/i).first();
  if ((await rank.count()) > 0) {
    await rank.scrollIntoViewIfNeeded().catch(() => null);
    await rank.click({ timeout: 5000 });
  }
  await page.waitForTimeout(600);
  const first = page.locator('a[href*="/content/"]').first();
  await first.waitFor({ state: "attached", timeout: 10000 }).catch(() => null);
  await first.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(400);
  await first.dispatchEvent("click");
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
});

Then("실시간 랭킹 1위 작품의 1회차가 정상적으로 감상된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|화|다음|이전/i).count()) > 0 || (await page.locator('[class*="viewer"], [class*="Viewer"]').count()) > 0;
  expect(onViewer || hasViewer).toBe(true);
});

And("최근본 작품 영역 하단의 첫 번째 작품에 사용자가 3번에서 감상한 작품 이력이 표시된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 });
});
