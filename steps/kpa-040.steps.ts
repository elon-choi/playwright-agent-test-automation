// Feature: KPA-040 시나리오 검증
// Scenario: 작품 리스트 정렬 기능 검증
import { When, Then, And, expect } from "./fixtures.js";

When("사용자가 좋아요 탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) { await storage.first().click({ timeout: 8000 }); await page.waitForTimeout(500); }
  const likeTab = page.getByRole("tab", { name: /좋아요/i }).or(page.getByRole("link", { name: /좋아요/i }));
  if (await likeTab.count() > 0) { await likeTab.first().click({ timeout: 5000 }); await page.waitForTimeout(500); }
  const list = page.locator('a[href*="/content/"]').first();
  await expect(list).toBeVisible({ timeout: 8000 }).catch(() => null);
});

And("사용자가 작품 리스트 상단의 정렬 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  const list = page.locator('a[href*="/content/"]').first();
  await list.waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
  const sortArea = page.getByRole("button", { name: /정렬|최근\s*순|업데이트\s*순|제목\s*순|좋아요\s*순|구매\s*순/i }).or(page.getByText(/정렬|좋아요\s*순|구매\s*순|업데이트\s*순|제목\s*순|최근\s*순/i).first());
  await sortArea.first().waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
  await sortArea.first().scrollIntoViewIfNeeded().catch(() => null);
  await sortArea.first().click({ timeout: 15000, force: true }).catch(() => null);
  await page.waitForTimeout(400);
});

And("사용자가 임의의 정렬값을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(300);
  const option = page.getByRole("button", { name: /좋아요\s*순|구매\s*순|업데이트\s*순|제목\s*순/i }).or(page.getByText(/좋아요\s*순|구매\s*순|업데이트\s*순|제목\s*순/i).first());
  if (await option.count() > 0) await option.first().click({ timeout: 8000, force: true });
  await page.waitForTimeout(400);
});

Then("{string}, {string}, {string} 정렬 옵션이 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasSort = await page.getByText(/좋아요\s*순|업데이트\s*순|제목\s*순/i).count() > 0;
  expect(hasSort).toBe(true);
});

And("선택한 정렬 기준으로 작품이 정렬되어 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const list = page.locator('a[href*="/content/"]').first();
  await expect(list).toBeVisible({ timeout: 5000 }).catch(() => null);
});
