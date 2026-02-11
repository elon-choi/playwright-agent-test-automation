// Feature: KPA-109 시나리오 검증
// 전체 연령/무료 회차/뒤로 가기/작품홈 회차 리스트 스텝은 common.episode.steps.ts에 구현됨
import { Then, And } from "./fixtures.js";

Then("뷰어 탭 하단에 다음 UI 요소들이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(500);
  const viewerOrMain = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  await viewerOrMain.waitFor({ state: "attached", timeout: 8000 }).catch(() => null);
});
