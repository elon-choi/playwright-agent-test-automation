// Feature: KPA-020 시나리오 검증 - 댓글 내역 전체 삭제
import { When, Then, expect } from "./fixtures.js";

When("댓글 내역 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(1000);
  const menu = page
    .getByText(/댓글\s*내역/i)
    .or(page.locator("text=댓글 내역"))
    .first();
  await menu.waitFor({ state: "visible", timeout: 12000 });
  const currentUrl = page.url();
  await menu.click({ timeout: 10000 });
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (page.url() !== currentUrl) break;
    const hasContent = await page
      .getByText(/댓글\s*내역이\s*없습니다|내가\s*삭제한\s*댓글|좋아요|댓글\s*달기/)
      .first()
      .isVisible()
      .catch(() => false);
    if (hasContent) break;
    await page.waitForTimeout(200);
  }
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(1500);
});

Then("댓글 내역 페이지가 표시된다", async ({ page }) => {
  const heading = page.getByText("댓글 내역", { exact: true }).first();
  const emptyMsg = page.getByText(/댓글\s*내역이\s*없습니다/).first();
  const deletedMsg = page.getByText(/내가\s*삭제한\s*댓글/).first();
  await expect(heading.or(emptyMsg).or(deletedMsg)).toBeVisible({ timeout: 20000 });
});

When("삭제할 댓글이 있으면 모두 삭제한다", async ({ page }) => {
  await page.waitForTimeout(500);

  // 댓글이 없는 경우 — 바로 성공 종료
  const noComments = await page
    .getByText(/댓글\s*내역이\s*없습니다/)
    .first()
    .isVisible()
    .catch(() => false);
  if (noComments) {
    console.log("[KPA-020] 삭제할 댓글이 없습니다. 성공 처리합니다.");
    return;
  }

  // 이미 모두 삭제된 상태 ("내가 삭제한 댓글입니다." 만 남은 경우)
  const alreadyDeleted = await page
    .getByText(/내가\s*삭제한\s*댓글입니다/)
    .first()
    .isVisible()
    .catch(() => false);
  if (alreadyDeleted) {
    // 삭제 아이콘이 있는 실제 댓글이 있는지 확인
    const deleteIcons = page.locator('img[alt*="닫기"], img[alt*="삭제"], [aria-label*="삭제"]');
    const iconCount = await deleteIcons.count();
    if (iconCount === 0) {
      console.log("[KPA-020] 이미 모든 댓글이 삭제된 상태입니다. 성공 처리합니다.");
      return;
    }
  }

  // 댓글 순차 삭제
  const maxRounds = 50;
  for (let i = 0; i < maxRounds; i++) {
    // 삭제 아이콘 찾기
    const deleteIcon = page
      .locator('img[alt*="닫기"]')
      .or(page.locator('img[alt*="삭제"]'))
      .or(page.locator('[aria-label*="삭제"]'))
      .first();

    const hasIcon = await deleteIcon.isVisible({ timeout: 3000 }).catch(() => false);
    if (!hasIcon) {
      console.log(`[KPA-020] 삭제 완료 (${i}건 삭제)`);
      break;
    }

    await deleteIcon.click({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(400);

    // 삭제 확인 팝업
    const confirmBtn = page.getByRole("button", { name: /^삭제$/i }).first();
    const hasConfirm = await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasConfirm) {
      await confirmBtn.click({ timeout: 5000 });
    }
    await page.waitForTimeout(600);
  }
});

Then("댓글 삭제 결과를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);

  // 다음 중 하나라도 보이면 성공:
  // 1) "댓글 내역이 없습니다." — 처음부터 댓글 없음
  // 2) "내가 삭제한 댓글입니다." — 댓글 삭제 완료 후
  // 3) 삭제 아이콘이 없음 — 모든 삭제 가능한 댓글 처리 완료
  const deadline = Date.now() + 10000;
  let ok = false;
  while (Date.now() < deadline) {
    const hasEmpty = await page
      .getByText(/댓글\s*내역이\s*없습니다/)
      .first()
      .isVisible()
      .catch(() => false);
    const hasDeletedMsg = await page
      .getByText(/내가\s*삭제한\s*댓글입니다/)
      .first()
      .isVisible()
      .catch(() => false);
    const deleteIcons = page.locator('img[alt*="닫기"], img[alt*="삭제"], [aria-label*="삭제"]');
    const noMoreDeletable = (await deleteIcons.count()) === 0;

    if (hasEmpty || hasDeletedMsg || noMoreDeletable) {
      ok = true;
      if (hasEmpty) console.log("[KPA-020] 결과: 댓글 내역이 없습니다.");
      else if (hasDeletedMsg) console.log("[KPA-020] 결과: 내가 삭제한 댓글입니다.");
      else console.log("[KPA-020] 결과: 삭제 가능한 댓글 없음.");
      break;
    }
    await page.waitForTimeout(500);
  }
  expect(ok).toBe(true);
});
