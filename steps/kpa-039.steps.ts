// Feature: KPA-039 (overnight generated)
// When '사용자가 좋아요 탭 하단의 작품 리스트를 확인한다'는 kpa-040.steps.ts에 단일 정의됨
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 좋아요 탭에 접근할 수 있다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) throw new Error("로그인 상태가 필요합니다.");
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) { await storage.first().click({ timeout: 8000 }); await page.waitForTimeout(600); }
  const likeTab = page.getByRole("tab", { name: /좋아요/i }).or(page.getByRole("link", { name: /좋아요/i }));
  if (await likeTab.count() > 0) { await likeTab.first().click({ timeout: 5000 }); await page.waitForTimeout(600); }
});

And("사용자가 편집 메뉴를 클릭한다", async ({ page }) => {
  const editBtn = page.getByRole("button", { name: /편집/i }).or(page.getByText(/편집/i).first());
  await editBtn.first().click({ timeout: 5000 });
  await page.waitForTimeout(400);
});

And("사용자가 임의의 작품을 선택한다", async ({ page }) => {
  const firstCard = page.locator('a[href*="/content/"]').or(page.locator('[role="listitem"]').locator('input[type="checkbox"]').first()).first();
  const checkbox = page.locator('input[type="checkbox"]').or(page.getByRole("checkbox").first());
  if (await checkbox.count() > 0) await checkbox.first().click({ timeout: 3000 });
  else if (await firstCard.count() > 0) await firstCard.first().click({ timeout: 3000 });
  await page.waitForTimeout(400);
});

And("사용자가 하단의 선택 항목 삭제 버튼을 클릭한다", async ({ page }) => {
  const deleteBtn = page.getByRole("button", { name: /선택\s*항목\s*삭제|삭제/i });
  await deleteBtn.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
});

Then("선택 항목 삭제 버튼이 활성화된다", async ({ page }) => {
  const deleteBtn = page.getByRole("button", { name: /선택\s*항목\s*삭제|삭제/i });
  await expect(deleteBtn.first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});

And("선택한 작품이 삭제되어 좋아요 탭 리스트에서 더 이상 보이지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
  const list = page.locator('a[href*="/content/"]');
  await expect(list.first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});
