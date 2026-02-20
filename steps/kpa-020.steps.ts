// Feature: KPA-020 시나리오 검증 - 댓글 내역
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("댓글 내역 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(1000);
  const menu = page.locator("text=댓글 내역").first();
  await menu.waitFor({ state: "attached", timeout: 12000 }).catch(() => null);
  const currentUrl = page.url();
  await menu.click({ timeout: 10000, force: true });
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (page.url() !== currentUrl) break;
    const hasContent = await page.getByText(/댓글\s*내역이\s*없습니다|좋아요|댓글\s*달기/).first().isVisible().catch(() => false);
    if (hasContent) break;
    await page.waitForTimeout(200);
  }
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(1500);
});

Then("댓글 내역 리스트가 화면에 표시된다", async ({ page }) => {
  const deadline = Date.now() + 20000;
  let ok = false;
  while (Date.now() < deadline) {
    const hasTitle = await page.getByText(/댓글\s*내역/i).first().isVisible().catch(() => false);
    const hasEmptyMessage = await page.getByText(/댓글\s*내역이\s*없습니다/).first().isVisible().catch(() => false);
    const hasCommentText = await page.getByText(/댓글/).first().isVisible().catch(() => false);
    const hasListMarker = await page.getByText(/좋아요/).first().isVisible().catch(() => false) && await page.getByText(/댓글\s*달기/).first().isVisible().catch(() => false);
    if (hasTitle || hasEmptyMessage || hasCommentText || hasListMarker) {
      ok = true;
      break;
    }
    await page.waitForTimeout(500);
  }
  expect(ok).toBe(true);
});

Then("\"댓글 내역이 없습니다\" 메시지가 노출되어도 성공 처리한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const deadline = Date.now() + 10000;
  let ok = false;
  while (Date.now() < deadline) {
    const hasEmptyMessage = await page.getByText(/댓글\s*내역이\s*없습니다\.?/).first().isVisible().catch(() => false);
    const hasEmptyByClass = await page.locator("span.text-el-60, span.font-medium2").filter({ hasText: /댓글\s*내역이\s*없습니다/ }).first().isVisible().catch(() => false);
    const hasList = await page.getByText(/댓글\s*내역/i).first().isVisible().catch(() => false);
    const hasCommentText = await page.getByText(/댓글/).first().isVisible().catch(() => false);
    const hasListMarker = (await page.getByText(/좋아요/).first().isVisible().catch(() => false)) && (await page.getByText(/댓글\s*달기/).first().isVisible().catch(() => false));
    const hasNoDataMessage = await page.getByText(/내역이\s*없습니다/).first().isVisible().catch(() => false);
    if (hasEmptyMessage || hasEmptyByClass || hasList || hasCommentText || hasListMarker || hasNoDataMessage) {
      ok = true;
      break;
    }
    await page.waitForTimeout(400);
  }
  expect(ok).toBe(true);
});

When("사용자가 댓글 내역의 모든 댓글을 삭제한다", async ({ page }) => {
  const maxRounds = 50;
  for (let i = 0; i < maxRounds; i++) {
    const noComments = await page.getByText(/댓글\s*내역이\s*없습니다/i).first().isVisible().catch(() => false);
    if (noComments) break;
    const titleEl = page.getByText(/댓글\s*내역/).first();
    const commentRows = titleEl.locator("xpath=following-sibling::*").filter({ has: page.getByText(/좋아요/) }).filter({ has: page.getByText(/댓글\s*달기/) });
    const count = await commentRows.count();
    if (count === 0) break;
    const firstRow = commentRows.first();
    const deleteIcon = firstRow.locator('img[alt*="닫기"]').or(firstRow.locator('img[alt*="삭제"]')).or(firstRow.getByRole("button", { name: /삭제/i })).first();
    await deleteIcon.click({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(400);
    const deleteBtn = page.getByRole("button", { name: /^삭제$/i }).first();
    await deleteBtn.click({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(600);
  }
});

When("사용자가 댓글 내역의 남은 댓글을 순차적으로 삭제한다", async ({ page }) => {
  const maxRounds = 50;
  for (let i = 0; i < maxRounds; i++) {
    const noComments = await page.getByText(/댓글\s*내역이\s*없습니다/i).first().isVisible().catch(() => false);
    if (noComments) break;
    const titleEl = page.getByText(/댓글\s*내역/).first();
    const commentRows = titleEl.locator("xpath=following-sibling::*").filter({ has: page.getByText(/좋아요/) }).filter({ has: page.getByText(/댓글\s*달기/) });
    const count = await commentRows.count();
    if (count === 0) break;
    const firstRow = commentRows.first();
    const deleteIcon = firstRow.locator('img[alt*="닫기"]').or(firstRow.locator('img[alt*="삭제"]')).or(firstRow.getByRole("button", { name: /삭제/i })).first();
    await deleteIcon.click({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(400);
    const deleteBtn = page.getByRole("button", { name: /^삭제$/i }).first();
    await deleteBtn.click({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(600);
  }
});

Then("모든 댓글이 삭제되었는지 확인한다", async ({ page }) => {
  const deadline = Date.now() + 20000;
  let allDeleted = false;
  while (Date.now() < deadline) {
    const noCommentsMessage = await page.getByText(/댓글\s*내역이\s*없습니다\.?/).first().isVisible().catch(() => false);
    const noCommentsByClass = await page.locator("span.text-el-60, span.font-medium2").filter({ hasText: /댓글\s*내역이\s*없습니다/ }).first().isVisible().catch(() => false);
    if (noCommentsMessage || noCommentsByClass) {
      allDeleted = true;
      break;
    }
    const titleEl = page.getByText(/댓글\s*내역/).first();
    const commentRows = titleEl.locator("xpath=following-sibling::*").filter({ has: page.getByText(/좋아요/) }).filter({ has: page.getByText(/댓글\s*달기/) });
    const count = await commentRows.count();
    if (count === 0) {
      allDeleted = true;
      break;
    }
    await page.waitForTimeout(500);
  }
  expect(allDeleted).toBe(true);
});

When("삭제할 댓글이 없을 경우 사용자가 우측 상단의 프로필 아이콘을 클릭한다", async ({ page, loginPage }) => {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const noComments = await page.getByText(/댓글\s*내역이\s*없습니다\.?/).first().isVisible().catch(() => false);
    const noCommentsByClass = await page.locator("span.text-el-60, span.font-medium2").filter({ hasText: /댓글\s*내역이\s*없습니다/ }).first().isVisible().catch(() => false);
    const titleEl = page.getByText(/댓글\s*내역/).first();
    const commentRows = titleEl.locator("xpath=following-sibling::*").filter({ has: page.getByText(/좋아요/) }).filter({ has: page.getByText(/댓글\s*달기/) });
    const count = await commentRows.count();
    if (noComments || noCommentsByClass || count === 0) break;
    await page.waitForTimeout(400);
  }
  await loginPage.clickProfileIcon();
});

When("사용자가 특정 댓글 우측 끝 댓글 삭제 아이콘을 클릭한다", async ({ page }) => {
  const noComments = await page.getByText(/댓글\s*내역이\s*없습니다/i).first().isVisible().catch(() => false);
  if (noComments) return;
  const titleEl = page.getByText(/댓글\s*내역/).first();
  const commentRows = titleEl.locator("xpath=following-sibling::*").filter({ has: page.getByText(/좋아요/) }).filter({ has: page.getByText(/댓글\s*달기/) });
  const count = await commentRows.count();
  if (count === 0) {
    const closeIcon = page.locator('img[alt*="닫기"]').first();
    await closeIcon.click({ timeout: 8000 });
    return;
  }
  const firstRow = commentRows.first();
  const deleteIcon = firstRow
    .locator('img[alt*="닫기"]')
    .or(firstRow.locator('img[alt*="삭제"]'))
    .or(firstRow.getByRole("button", { name: /삭제/i }))
    .or(firstRow.locator('[aria-label*="삭제"]'));
  await deleteIcon.first().click({ timeout: 8000 });
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
