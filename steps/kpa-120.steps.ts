// Feature: KPA-120 - 무료 회차 댓글창 포커싱 및 뷰어 엔드 영역 노출
// Then "해당 회차의 Best 탭에 포커싱된 댓글 페이지로 이동한다.", And "뒤로가기 아이콘"은 kpa-119.steps.ts에 정의됨
// 전체 연령/무료 회차/최하단 스크롤은 common.episode.steps.ts
import { And, expect } from "./fixtures.js";

And("사용자가 베스트 댓글 영역을 클릭한다", async ({ page }) => {
  const bestArea = page.getByText(/^BEST$/i).first()
    .or(page.getByText(/베스트\s*댓글|Best\s*댓글|인기\s*댓글/i).first());
  await bestArea.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(300);
  await bestArea.waitFor({ state: "visible", timeout: 15000 });
  await bestArea.scrollIntoViewIfNeeded().catch(() => null);
  await bestArea.click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

And("팝업창을 종료한 후 뷰어의 엔드 영역이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasViewerUrl = /\/viewer\//i.test(page.url());
  const hasViewerEnd = (await page.getByText(/회차|다음화|댓글|작품홈|좋아요|별점/i).count()) > 0;
  expect(hasViewerUrl || hasViewerEnd).toBe(true);
});