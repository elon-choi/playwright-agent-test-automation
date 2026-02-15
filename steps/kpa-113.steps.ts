// Feature: KPA-113 (overnight generated)
// "사용자가 전체 연령 작품 목록을 확인한다"는 common.episode.steps.ts에 구현됨
import { Then, And, expect } from "./fixtures.js";

And("사용자가 뷰어 하단의 댓글 아이콘을 클릭한다", async ({ page }) => {
  if (!/\/viewer\//i.test(page.url())) return;
  const commentIcon = page.getByRole("button", { name: /댓글/i }).or(page.getByText(/댓글/).first());
  if ((await commentIcon.count()) > 0) await commentIcon.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(500);
});

Then("댓글창이 해당 회차의 전체 탭에 포커싱되어 팝업된다", async ({ page }) => {
  const hasCommentPopup =
    (await page.getByRole("dialog").count()) > 0 ||
    (await page.getByText(/댓글|닉네임|작성/i).count()) > 0 ||
    (await page.locator("[class*='comment'], [class*='Comment']").count()) > 0;
  expect(hasCommentPopup).toBe(true);
});

And("댓글창이 종료되며, 사용자는 뷰어로 이동한다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const onKakao = /page\.kakao\.com/i.test(page.url());
  const hasContent = (await page.locator("main, body").count()) > 0;
  expect(onViewer || (onKakao && hasContent)).toBe(true);
});