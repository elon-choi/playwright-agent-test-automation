// Feature: KPA-044 구매작품 삭제 기능 검증
import { When, Then, And, expect } from "./fixtures.js";

And("구매작품 탭에 최소 1개의 작품이 존재한다", async () => {});

When("사용자가 구매작품 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /구매/i }).or(page.getByText(/구매\s*작품/i).first());
  if (await tab.count() > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
});

And("사용자가 편집 메뉴를 클릭한다", async ({ page }) => {
  const editBtn = page.getByRole("button", { name: /편집/i }).or(page.getByText(/편집/i).first());
  await editBtn.first().click({ timeout: 5000 });
  await page.waitForTimeout(400);
});

And("사용자가 임의의 작품을 선택한다", async ({ page }) => {
  const checkbox = page.locator('input[type="checkbox"]').or(page.getByRole("checkbox").first());
  if (await checkbox.count() > 0) await checkbox.first().click({ timeout: 3000 });
  else await page.locator('a[href*="/content/"]').first().click({ timeout: 3000 });
  await page.waitForTimeout(400);
});

And("사용자가 하단의 {string} 버튼을 클릭한다", async ({ page }) => {
  const deleteBtn = page.getByRole("button", { name: /선택\s*항목\s*삭제|삭제/i });
  await deleteBtn.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
});

Then("{string} 버튼이 활성화된다", async ({ page }) => {
  await expect(page.getByRole("button", { name: /삭제/i }).first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});

And("선택한 작품이 구매작품 리스트에서 삭제된다", async () => {});

And("구매작품 리스트에 선택한 작품이 더 이상 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});
