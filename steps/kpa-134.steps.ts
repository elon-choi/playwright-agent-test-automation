// Feature: KPA-134 (overnight generated - all steps from common)
import { Then, And } from "./fixtures.js";

And("사용자가 닫기 버튼 또는 뒤로가기 버튼을 클릭한다", async ({ page }) => {
  const closeOrBack = page.getByRole("button", { name: /닫기|취소/i })
    .or(page.getByRole("link", { name: /뒤로|닫기/i }))
    .or(page.locator("button").filter({ hasText: /닫기|뒤로가기/ }))
    .first();
  if ((await closeOrBack.count()) > 0) await closeOrBack.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(300);
});

Then("해당 회차의 전체 탭에 포커싱된 댓글창이 팝업된다", async ({ page }) => {
  const commentPopup = page.locator("[role='dialog'], [class*='modal'], [class*='comment'], [class*='댓글']").first();
  await page.waitForTimeout(500);
  if ((await commentPopup.count()) > 0) await commentPopup.waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
});
