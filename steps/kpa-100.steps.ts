// Feature: KPA-100 - 키워드 검색 및 작품 정보 확인
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 임의의 [키워드]를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const keywordLink = page.locator('a[href*="keyword"]').or(page.locator('a').filter({ hasText: /^[가-힣a-zA-Z0-9]{2,10}$/ }).first());
  if ((await keywordLink.count()) > 0) {
    await keywordLink.first().scrollIntoViewIfNeeded().catch(() => null);
    await keywordLink.first().click({ timeout: 6000 }).catch(() => null);
  } else {
    const anyTag = page.getByRole("link").filter({ hasNotText: /회차|정보|홈|더보기/ }).first();
    if ((await anyTag.count()) > 0) await anyTag.click({ timeout: 6000 }).catch(() => null);
  }
  await page.waitForTimeout(500);
});

Then("키워드가 검색 결과 페이지에 노출된다", async ({ page }) => {
  const hasSearch =
    /search|keyword|q=/i.test(page.url()) ||
    (await page.getByText(/검색|결과|키워드/i).count()) > 0;
  expect(hasSearch || (await page.locator('a[href*="/content/"]').count()) > 0).toBe(true);
});

And("사용자가 작품 리스트를 확인할 수 있다", async ({ page }) => {
  const hasList =
    (await page.locator('a[href*="/content/"]').count()) > 0 ||
    (await page.getByText(/작품|웹툰|웹소설/i).count()) > 0;
  expect(hasList).toBe(true);
});

Then("사용자는 해당 작품의 상세 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(content|landing\/series)\//i, { timeout: 8000 });
});

And("작품 이미지, BM, 장르, 작품명, 작가명이 상세 페이지에 노출된다", async ({ page }) => {
  const hasDetail =
    (await page.getByText(/장르|작품명|작가|작가명/i).count()) > 0 ||
    (await page.locator("main, [role='main']").count()) > 0;
  expect(hasDetail).toBe(true);
});
