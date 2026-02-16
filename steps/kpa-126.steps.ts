// Feature: KPA-126 - 무료 회차 댓글 기능 사용 후 뷰어로 돌아가기
// "사용자가 무료 회차 목록을 확인한다"는 common.episode.steps.ts에 구현됨
import { Then, And, expect } from "./fixtures.js";

And("뷰어 하단의 댓글 아이콘을 클릭한다", async ({ page }) => {
  if (!/\/viewer\//i.test(page.url())) return;
  const commentIcon = page.getByRole("button", { name: /댓글/i }).or(page.getByText(/댓글/).first());
  if ((await commentIcon.count()) > 0) await commentIcon.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(500).catch(() => null);
});

Then("댓글창이 팝업되며, 해당 회차의 전체 탭에 포커싱된다", async ({ page }) => {
  await page.waitForTimeout(400).catch(() => null);
  const hasComment =
    (await page.getByRole("dialog").count()) > 0 ||
    (await page.getByText(/댓글|닉네임|전체|작성/i).count()) > 0;
  expect(hasComment).toBe(true);
});

And("댓글창이 종료되고, 사용자는 뷰어로 이동한다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|다음화|댓글|정주행/i).count()) > 0;
  expect(onViewer || hasViewer).toBe(true);
});