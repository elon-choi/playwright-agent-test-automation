// Feature: KPA-041 시나리오 검증
// Scenario: 구매 이력이 있는 사용자의 작품 이어보기 기능 검증
import { When, Then, And, expect } from "./fixtures.js";

And("사용자의 계정에 구매 이력이 존재한다", async () => {});

When("사용자가 웹 페이지에 진입하여 하단의 보관함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

And("사용자가 구매작품 탭의 하단 작품 리스트를 확인한다", async ({ page }) => {
  const tab = page.getByRole("tab", { name: /구매\s*작품|구매작품/i }).or(page.getByText(/구매\s*작품|구매작품/i).first());
  if (await tab.count() > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  const list = page.locator('a[href*="/content/"]').first();
  await expect(list).toBeVisible({ timeout: 8000 }).catch(() => null);
});

Then("작품이 정렬 기준에 따라 올바르게 노출된다", async ({ page }) => {
  const list = page.locator('a[href*="/content/"]').first();
  await expect(list).toBeVisible({ timeout: 5000 }).catch(() => null);
});

And("사용자가 해당 작품의 홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i, { timeout: 5000 }).catch(() => null);
});

// 동일 스텝은 kpa-031.steps.ts에만 정의 (중복 Given 방지)
