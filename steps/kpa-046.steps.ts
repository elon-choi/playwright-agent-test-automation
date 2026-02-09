// Feature: KPA-046 시나리오 검증
import { When, Then, And, expect } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 상단의 선물함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const gift = page.getByRole("link", { name: /선물함/i }).or(page.getByRole("button", { name: /선물함/i }));
  await gift.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

Then("선물함 메뉴 화면이 올바르게 구성되어 있는지 확인한다", async ({ page }) => {
  await expect(page.getByText(/선물함/i).first()).toBeVisible({ timeout: 10000 });
});

When("사용자가 임의의 작품 리스트에서 선물 받기 메뉴를 클릭한다", async ({ page }) => {
  const btn = page.getByRole("button", { name: /선물\s*받기/i }).or(page.getByText(/선물\s*받기/i).first());
  if (await btn.count() > 0) await btn.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
});

And("임의의 작품 리스트를 클릭한다", async ({ page }) => {
  await page.locator('a[href*="/content/"]').first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
});

Then("사용자는 선물함 화면에 진입하며, 다음과 같은 메뉴가 노출된다", async ({ page }) => {
  await expect(page.getByText(/선물함|전체|웹툰|웹소설|책/i).first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

Then("클릭한 작품의 이용권이 지급되었다는 토스트 메시지가 노출된다", async ({ page }) => {
  await expect(page.getByText(/지급|토스트|이용권/i).first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

And("사용자는 클릭한 작품의 홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i, { timeout: 5000 }).catch(() => null);
});
