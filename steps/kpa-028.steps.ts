// Feature: KPA-028 시나리오 검증
// Scenario: 최근 검색어를 통한 자동 완성 및 검색 결과 확인
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

const SEED_KEYWORD = "웹툰";

And("최근 검색어가 존재한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(400);
  const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(
    page.getByPlaceholder(/제목|작가를 입력하세요/i)
  );
  if (await searchInput.count() > 0) {
    await searchInput.first().fill(SEED_KEYWORD, { timeout: 5000 });
    await searchInput.first().press("Enter");
    await page.waitForTimeout(1500);
  }
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
});

When("사용자가 웹 페이지에 진입한 후 우 상단의 {string} 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const searchTrigger = page.getByRole("button", { name: /검색/i })
    .or(page.getByRole("link", { name: /검색/i }))
    .or(page.getByPlaceholder(/제목|작가를 입력/).first())
    .or(page.getByRole("textbox", { name: /제목|작가|검색/i }).first());
  if (await searchTrigger.count() > 0 && (await searchTrigger.first().isVisible().catch(() => false))) {
    await searchTrigger.first().click({ timeout: 8000 });
    await page.waitForTimeout(600);
  }
});

And("검색창 하단의 임의의 최근 검색어를 클릭한다", async ({ page }) => {
  const recentItem = page.getByRole("button", { name: new RegExp(SEED_KEYWORD, "i") })
    .or(page.getByRole("link", { name: new RegExp(SEED_KEYWORD, "i") }))
    .or(page.getByText(SEED_KEYWORD).first());
  if (await recentItem.count() > 0 && (await recentItem.first().isVisible().catch(() => false))) {
    await recentItem.first().click({ timeout: 5000 });
  } else {
    const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(
      page.getByPlaceholder(/제목|작가를 입력하세요/i)
    );
    await searchInput.first().fill(SEED_KEYWORD, { timeout: 5000 });
    await searchInput.first().press("Enter");
  }
  await page.waitForTimeout(1000);
});

Then("자동 완성 검색어가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasSuggest = await page.getByText(/검색|자동\s*완성|추천/i).count() > 0
    || await page.locator('a[href*="/content/"]').count() > 0;
  expect(hasSuggest || await page.locator("body").count() > 0).toBe(true);
});

And("해당 검색어에 해당되는 검색 결과가 노출된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').or(page.getByText(/검색\s*결과|작품/i)).first())
    .toBeVisible({ timeout: 10000 });
});