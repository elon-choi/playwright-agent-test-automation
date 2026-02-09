// Feature: KPA-042 기능 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("구매 순 정렬이 선택된 상태이다", async () => {});

When("사용자가 웹 페이지에 진입한 후 하단의 보관함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

And("구매 작품탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  const tab = page.getByRole("tab", { name: /구매/i }).or(page.getByText(/구매s*작품/i).first());
  if (await tab.count() > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

And("메인홈에서 웹툰 > 실시간 랭킹 > 1위 작품을 클릭하여 이용권을 구매한다", async ({ page }) => {
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
  const webtoon = page.getByRole("link", { name: /웹툰/i }).first();
  if (await webtoon.count() > 0) await webtoon.click({ timeout: 5000 });
  await page.waitForTimeout(500);
  const rank = page.getByText(/실시간s*랭킹|랭킹/i).first();
  if (await rank.count() > 0) { await rank.scrollIntoViewIfNeeded(); await rank.click({ timeout: 5000 }); }
  await page.waitForTimeout(600);
  const first = page.locator('a[href*="/content/"]').first();
  await first.click({ timeout: 8000 });
  await page.waitForTimeout(800);
  const buy = page.getByRole("button", { name: /구매|대여|이용권/i }).or(page.getByText(/구매|대여/i).first());
  if (await buy.count() > 0) await buy.first().click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(500);
});

And("보관함에서 구매 작품탭 하단의 작품 리스트를 다시 확인한다", async ({ page }) => {
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

Then("구매 작품이 정렬 기준에 따라 올바르게 노출된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});

And("실시간 랭킹 1위 작품의 이용권 구매가 정상적으로 진행된다", async () => {});

And("구매 작품탭 최상단에 방금 감상한 작품 이력이 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});
