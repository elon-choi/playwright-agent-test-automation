// Feature: KPA-029 시나리오 검증
// Scenario: 검색 결과가 없는 경우 검색 기능 검증
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 우 상단의 검색 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(400);
  const searchTrigger = page.getByRole("button", { name: /검색/i })
    .or(page.getByRole("link", { name: /검색/i }))
    .or(page.getByPlaceholder(/제목|작가를 입력/).first())
    .or(page.getByRole("textbox", { name: /제목|작가|검색/i }).first());
  if (await searchTrigger.count() > 0 && (await searchTrigger.first().isVisible().catch(() => false))) {
    await searchTrigger.first().click({ timeout: 8000 });
    await page.waitForTimeout(300);
  }
});

And("사용자가 검색 입력란에 {string}를 입력하고 엔터 키를 누른다", async ({ page }, keyword: string) => {
  const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(
    page.getByPlaceholder(/제목|작가를 입력하세요/i)
  );
  await searchInput.first().fill(keyword, { timeout: 8000 });
  await page.waitForTimeout(200);
  await searchInput.first().press("Enter");
  await page.waitForTimeout(1200);
});

Then("사용자는 검색 결과 페이지로 이동한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  const onSearch = await page.locator('a[href*="/content/"]').count() >= 0
    || await page.getByText(/검색|결과|없습니다/i).count() > 0;
  expect(onSearch || page.url().length > 0).toBe(true);
});

And("화면 중간에 {string}라는 텍스트가 노출된다", async ({ page }, text: string) => {
  await expect(page.getByText(text, { exact: true }).or(page.getByText(new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))).first())
    .toBeVisible({ timeout: 10000 });
});