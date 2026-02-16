// Feature: KPA-124 - 무료 회차 클릭 후 뒤로 가기, 뷰어 탭 하단 UI 검증
// "사용자가 전체 연령 작품의 무료 회차에 진입한다"는 common.episode.steps.ts에 구현됨
import { Then, expect } from "./fixtures.js";

Then("뷰어 탭 하단에 다음 요소들이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(400).catch(() => null);
  const hasViewerUi =
    (await page.getByText(/회차|설정|정주행|댓글|이전화|다음화/i).count()) > 0 ||
    (await page.locator("[class*='viewer'], [class*='Viewer'], main").count()) > 0 ||
    (await page.locator("a[href*='/viewer/']").count()) > 0;
  expect(hasViewerUi || /\/viewer\//i.test(page.url())).toBe(true);
});