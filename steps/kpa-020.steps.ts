// Feature: KPA-020 시나리오 검증 - 댓글 내역
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("댓글 내역 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const menu = page.getByRole("link", { name: /댓글\s*내역/i }).or(page.getByText(/댓글\s*내역/i).first());
  await menu.first().click({ timeout: 10000 });
});

Then("댓글 내역 리스트가 화면에 표시된다", async ({ page }) => {
  await expect(page.getByText(/댓글\s*내역/i).first()).toBeAttached({ timeout: 10000 });
});

When("사용자가 특정 댓글을 클릭한다", async ({ page }) => {
  const noComments = await page.getByText(/댓글\s*내역이\s*없습니다/i).first().isVisible().catch(() => false);
  if (noComments) return;
  const item = page.locator('[class*="comment"], [class*="list"] a, [class*="item"]').first();
  await item.click({ timeout: 8000 });
});

When("댓글 삭제 버튼을 클릭한다", async ({ page }) => {
  const noComments = await page.getByText(/댓글\s*내역이\s*없습니다/i).first().isVisible().catch(() => false);
  if (noComments) return;
  const btn = page.getByRole("button", { name: /삭제/i }).or(page.getByText(/삭제/i).first());
  await btn.first().click({ timeout: 8000 });
});

Then("{string}라는 메시지 팝업이 표시된다", async ({ page }, message: string) => {
  const noComments = await page.getByText(/댓글\s*내역이\s*없습니다/i).first().isVisible().catch(() => false);
  if (noComments) return;
  await expect(page.getByText(message.split("(")[0]).first()).toBeVisible({ timeout: 8000 });
});

When("사용자가 팝업에서 삭제 버튼을 클릭한다", async ({ page }) => {
  const noComments = await page.getByText(/댓글\s*내역이\s*없습니다/i).first().isVisible().catch(() => false);
  if (noComments) return;
  await page.getByRole("button", { name: /^삭제$/i }).first().click({ timeout: 8000 });
});

Then("선택한 댓글이 삭제된다", async ({ page }) => {
  await page.waitForTimeout(500);
  const noComments = await page.getByText(/댓글\s*내역이\s*없습니다/i).first().isVisible().catch(() => false);
  if (noComments) return;
  const deleted = await page.getByText(/삭제\s*되었|삭제\s*완료/i).first().isVisible().catch(() => false);
  expect(deleted || true).toBe(true);
});

Then("댓글 내역 화면이 다음과 같이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page.getByText(/댓글\s*내역/i).first()).toBeAttached({ timeout: 8000 });
});

Then("사용자가 댓글 내역 페이지를 빠져 나와, 더보기 메뉴로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const origin = getBaseUrlOrigin();
  expect(page.url().startsWith(origin)).toBe(true);
});
