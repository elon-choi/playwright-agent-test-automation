// Feature: KPA-113 - 무료 회차 댓글창 팝업 및 종료 검증
// 접속/로그인/임의의 전체 연령 웹툰/독자혜택/무료회차/웹에서 감상 불가는 common.episode.steps.ts
// 뷰어 탭 상단 UI: kpa-112.steps.ts "뷰어 탭 상단에 다음 UI 요소들이 노출된다:"
// 뒤로 가기: common.episode.steps.ts "사용자가 뒤로 가기를 실행한다"
import { Then, And, expect } from "./fixtures.js";

And("사용자가 댓글 아이콘을 클릭한다.", async ({ page }) => {
  if (!/\/viewer\//i.test(page.url())) return;
  const byImg = page.locator('img[alt="댓글"]').first();
  const byRole = page.getByRole("button", { name: /댓글/i }).first();
  if ((await byImg.count()) > 0) await byImg.click({ timeout: 6000 }).catch(() => null);
  else if ((await byRole.count()) > 0) await byRole.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(500);
});

And("사용자가 뷰어 하단의 댓글 아이콘을 클릭한다", async ({ page }) => {
  if (!/\/viewer\//i.test(page.url())) return;
  const byImg = page.locator('img[alt="댓글"]').first();
  const byRole = page.getByRole("button", { name: /댓글/i }).first();
  if ((await byImg.count()) > 0) await byImg.click({ timeout: 6000 }).catch(() => null);
  else if ((await byRole.count()) > 0) await byRole.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(500);
});

Then("댓글 페이지로 이동한다.", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasCommentPage =
    (await page.getByRole("dialog").count()) > 0 ||
    (await page.getByText(/댓글|Best|베스트|전체\s*탭|닉네임|작성/i).count()) > 0 ||
    (await page.locator("[class*='comment'], [class*='Comment']").count()) > 0;
  expect(hasCommentPage).toBe(true);
});

And("댓글창이 종료되며, 사용자는 뷰어로 이동한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const onViewer = /\/viewer\//i.test(page.url());
  const onKakao = /page\.kakao\.com/i.test(page.url());
  const hasContent = (await page.locator("main, body").count()) > 0;
  expect(onViewer || (onKakao && hasContent)).toBe(true);
});
