// Feature: KPA-109 시나리오 검증
// 전체 연령/무료 회차/뒤로 가기/작품홈 회차 리스트 스텝은 common.episode.steps.ts에 구현됨
import { Then, And, expect } from "./fixtures.js";

Then("뷰어 탭 하단에 다음 UI 요소들이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/viewer\//i, { timeout: 5000 });

  const requiredUi = [
    { name: "회차명", locator: page.getByText(/회차|\d+화/i).first() },
    { name: "정주행 아이콘", locator: page.locator('img[alt*="정주행"]').first() },
    { name: "댓글 아이콘", locator: page.locator('img[alt="댓글"]').first() },
    { name: "이전화", locator: page.locator('img[alt="왼쪽 화살표"]').first() },
    { name: "다음화", locator: page.locator('[data-test="viewer-navbar-next-button"]').first() },
    { name: "설정 메뉴", locator: page.locator('img[alt="설정"]').first() }
  ];

  for (const { name, locator } of requiredUi) {
    await locator.waitFor({ state: "visible", timeout: 10000 });
    expect(await locator.count(), `${name} 노출되어야 함`).toBeGreaterThan(0);
  }
});
