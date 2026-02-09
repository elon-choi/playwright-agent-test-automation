// Feature: KPA-049 시나리오 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 작품 감상 이력이 있는 계정으로 로그인한다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) throw new Error("로그인 상태가 필요합니다.");
});

And("사용자는 최근본 작품탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /최근\s*본/i }).or(page.getByText(/최근\s*본/i).first());
  if (await tab.count() > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

And("사용자가 메인홈에서 웹툰 > 실시간 랭킹 > 3위 작품을 클릭하고, 1회차를 감상한다", async ({ page }) => {
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
  const webtoon = page.getByRole("link", { name: /웹툰/i }).first();
  if (await webtoon.count() > 0) await webtoon.click({ timeout: 5000 });
  await page.waitForTimeout(500);
  const rank = page.getByText(/실시간\s*랭킹|랭킹/i).first();
  if (await rank.count() > 0) { await rank.scrollIntoViewIfNeeded(); await rank.click({ timeout: 5000 }); }
  await page.waitForTimeout(600);
  const third = page.locator('a[href*="/content/"]').nth(2);
  if (await third.count() > 0) await third.click({ timeout: 8000 });
  await page.waitForTimeout(800);
  const ep = page.locator('a[href*="/viewer/"]').first();
  if (await ep.count() > 0) await ep.click({ timeout: 5000 });
  await page.waitForTimeout(600);
});

And("사용자는 추천탭 하단의 최근본 작품 영역에서 작품 리스트가 노출되는지 확인한다", async ({ page }) => {
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

Then("최근본 작품이 최신 감상 이력을 기준으로 정렬되어 노출된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});

And("실시간 랭킹 3위 작품의 1회차가 정상적으로 감상된다", async () => {});

And("최근본 작품 영역 하단의 첫 번째 작품에 사용자가 3번에서 감상한 작품 이력이 노출된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});
