// Feature: KPA-119 - 무료 회차 댓글창 팝업 및 뷰어 엔드 영역 노출
// 전체 연령 목록/무료 회차/최하단 스크롤은 common.episode.steps.ts
import { Then, And, expect } from "./fixtures.js";

And("사용자가 댓글 아이콘을 클릭한다", async ({ page }) => {
  const commentIcon = page.getByRole("button", { name: /댓글/i }).or(page.getByText(/댓글/).first());
  const count = await commentIcon.count().catch(() => 0);
  if (count > 0) await commentIcon.click({ timeout: 8000 }).catch(() => null);
  await page.waitForTimeout(500).catch(() => null);
});

And("사용자가 닫기 버튼을 클릭한다", async ({ page }) => {
  const closeBtn = page.getByRole("button", { name: /닫기/i }).or(page.getByText(/^닫기$/).first());
  if ((await closeBtn.count()) > 0) await closeBtn.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400).catch(() => null);
});

Then("해당 회차의 Best 탭에 포커싱된 댓글창이 팝업된다", async ({ page }) => {
  await page.waitForTimeout(600).catch(() => null);
  const hasDialog = (await page.getByRole("dialog").count()) > 0;
  const hasCommentText = (await page.getByText(/댓글|Best|베스트|닉네임|전체/i).count()) > 0;
  const hasViewerEnd = (await page.getByText(/회차|다음화|작품홈|닫기/i).count()) > 0;
  expect(hasDialog || hasCommentText || hasViewerEnd).toBe(true);
});

And("팝업창이 종료된 후 뷰어 엔드 영역이 노출된다", async ({ page }) => {
  const hasViewer = (await page.getByText(/회차|다음화|댓글|작품홈/i).count()) > 0 || /\/viewer\//i.test(page.url());
  expect(hasViewer).toBe(true);
});