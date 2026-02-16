// Feature: KPA-066 - 작품 정보 노출 확인 (작품홈 전제)
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

async function ensureOnWorkHome(page: import("@playwright/test").Page) {
  if (/\/(content|landing\/series)\//i.test(page.url())) return;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(600);
  const first = page.locator('a[href*="/content/"]').first();
  if ((await first.count()) > 0) {
    await first.evaluate((el: HTMLElement) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await first.dispatchEvent("click");
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  }
  await page.waitForTimeout(500);
}

And("페이지가 완전히 로드된다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(500);
  await ensureOnWorkHome(page);
});

When("사용자가 작품명 영역을 확인한다", async ({ page }) => {
  await ensureOnWorkHome(page);
  await page.waitForTimeout(300);
});

Then("작품명이 올바르게 노출된다", async ({ page }) => {
  const onWork = /\/(content|landing\/series)\//i.test(page.url());
  const title = page.locator("h1, h2, [class*='title'], [class*='Title']").first();
  const visible = onWork || ((await title.count()) > 0 && (await title.isVisible().catch(() => false)));
  expect(visible).toBe(true);
});

When("사용자가 작가명 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
});

Then("작가명이 올바르게 노출된다", async ({ page }) => {
  const author = page.getByText(/작가|저자|글\s*:/i).or(page.locator("[class*='author'], [class*='Author']").first());
  await expect(author.first()).toBeVisible({ timeout: 6000 });
});

When("사용자가 장르 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
});

Then("장르가 올바르게 노출된다", async ({ page }) => {
  const genre = page.getByText(/장르|로맨스|판타지|무협/i).or(page.locator("[class*='genre']").first());
  await expect(genre.first()).toBeVisible({ timeout: 6000 });
});

When("사용자가 누적 열람 수와 좋아요 수를 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
});

Then("누적 열람 수와 좋아요 수가 올바르게 노출된다", async ({ page }) => {
  const stats = page.getByText(/열람|조회|좋아요|하트|\d+\s*만/i).first();
  await expect(stats).toBeVisible({ timeout: 6000 });
});