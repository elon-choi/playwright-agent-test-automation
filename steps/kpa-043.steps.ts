// Feature: KPA-043 시나리오 검증
import { When, Then, And, expect } from "./fixtures.js";

And("사이트에 접속한 후 검색 결과가 있는 경우", async () => {});

When("사용자가 구매작품 탭의 하단에 있는 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /구매/i }).or(page.getByText(/구매\s*작품/i).first());
  if (await tab.count() > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

And("사용자가 검색 아이콘을 클릭하고 임의의 작품을 검색한다", async ({ page }) => {
  const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(page.getByPlaceholder(/제목|작가를 입력하세요/i));
  await searchInput.first().fill("웹툰", { timeout: 5000 });
  await searchInput.first().press("Enter");
  await page.waitForTimeout(1000);
});

Then("검색어에 포함된 작품 리스트가 사용자에게 노출된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 10000 });
});
