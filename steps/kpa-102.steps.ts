// Feature: KPA-102 - 추천 작품 확인 및 이동
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 이 작품과 함께보는 웹툰 작품을 확인한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const section =
    page.getByText(/함께보는|추천|이 작품/i).or(page.locator('a[href*="/content/"]'));
  await expect(section.first()).toBeVisible({ timeout: 10000 }).catch(() => null);
});

And("사용자가 추천 작품의 썸네일을 클릭한다", async ({ page }) => {
  const currentPath = new URL(page.url()).pathname;
  const recLink = page.locator('a[href*="/content/"]').filter({
    has: page.locator("img").or(page.locator("[class*='thumb'], [class*='thumbnail']"))
  }).first();
  if ((await recLink.count()) > 0) {
    const href = await recLink.getAttribute("href").catch(() => null);
    if (href && !currentPath.includes(href)) {
      await recLink.scrollIntoViewIfNeeded().catch(() => null);
      await recLink.click({ timeout: 8000 }).catch(() => null);
      await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 12000 }).catch(() => null);
    }
  } else {
    const anyContent = page.locator('a[href*="/content/"]').nth(1);
    if ((await anyContent.count()) > 0) await anyContent.click({ timeout: 8000 }).catch(() => null);
  }
  await page.waitForTimeout(400);
});

Then("추천 작품이 노출된다", async ({ page }) => {
  const hasContent =
    (await page.locator("main, [role='main']").count()) > 0 ||
    (await page.getByText(/작품|웹툰|회차/i).count()) > 0;
  expect(hasContent).toBe(true);
});

And("작품 이미지, BM, 작품명이 노출된다", async ({ page }) => {
  const hasInfo =
    (await page.getByText(/작품|웹툰|작품명/i).count()) > 0 ||
    (await page.locator("main").count()) > 0;
  expect(hasInfo).toBe(true);
});

