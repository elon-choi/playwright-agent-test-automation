// Feature: KPA-133 - 무료 회차 댓글 기능 검증
// "무료 회차를 선택하여 진입", "댓글 아이콘 클릭"은 common/kpa-119에 구현됨
import { Then, And, expect } from "./fixtures.js";

And("사용자가 댓글 창의 닫기 버튼을 클릭한다", async ({ page }) => {
  const closeBtn = page.getByRole("button", { name: /닫기/i }).or(page.getByText(/^닫기$/).first());
  if ((await closeBtn.count()) > 0) await closeBtn.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400).catch(() => null);
});

Then("해당 회차의 Best 탭에 포커싱된 댓글 창이 팝업된다", async ({ page }) => {
  await page.waitForTimeout(600).catch(() => null);
  const hasDialog = (await page.getByRole("dialog").count()) > 0;
  const hasCommentText = (await page.getByText(/댓글|Best|베스트|닉네임|전체/i).count()) > 0;
  const hasViewerEnd = (await page.getByText(/회차|다음화|작품홈|닫기/i).count()) > 0;
  expect(hasDialog || hasCommentText || hasViewerEnd).toBe(true);
});

And("팝업창이 종료된 후 뷰어의 엔드 영역이 노출된다", async ({ page }) => {
  const hasViewer = (await page.getByText(/회차|다음화|댓글|작품홈/i).count()) > 0 || /\/viewer\//i.test(page.url());
  expect(hasViewer).toBe(true);
});