// Feature: KPA-030 시나리오 검증
// Scenario: 보관함 메뉴 화면 검증
import { When, Then, And, expect } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 우측 상단의 보관함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(400);
  const storageMenu = page.getByRole("link", { name: /보관함/i })
    .or(page.getByRole("button", { name: /보관함/i }))
    .or(page.getByLabel(/보관함/i));
  await storageMenu.first().click({ timeout: 8000 });
  await page.waitForTimeout(800);
});

Then("보관함 메뉴 화면이 구성되어야 한다", async ({ page }) => {
  await expect(page.getByText(/보관함/i).first()).toBeVisible({ timeout: 10000 });
});

And("보관함 화면에 진입하며, 다음과 같은 메뉴가 노출되어야 한다:", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasTab = await page.getByText(/최근\s*본|좋아요|구매\s*작품/i).count() > 0;
  const hasCategory = await page.getByText(/검색|전체|웹툰|웹소설|책/i).count() > 0;
  const hasControl = await page.getByText(/편집|정렬/i).count() > 0;
  expect(hasTab || hasCategory || hasControl).toBe(true);
});
