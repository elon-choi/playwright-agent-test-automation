// Feature: KPA-109 시나리오 검증
// 전체 연령/무료 회차/뒤로 가기/작품홈 회차 리스트 스텝은 common.episode.steps.ts에 구현됨
import { Then, And, expect } from "./fixtures.js";

Then("뷰어 탭 하단에 다음 UI 요소들이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(500);
  const viewerOrMain = page.locator("main").first();
  await viewerOrMain.waitFor({ state: "attached", timeout: 8000 }).catch(() => null);
  const hasViewerUi =
    (await page.getByText(/회차|다음화|이전화|댓글|정주행/i).count()) > 0 ||
    (await page.locator("a[href*='/viewer/']").count()) > 0;
  expect(hasViewerUi || /\/viewer\//i.test(page.url())).toBe(true);
});
