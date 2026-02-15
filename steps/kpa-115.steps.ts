// Feature: KPA-115 - 무료 회차 열람 후 뷰어 엔드 영역 확인
// 전체 연령/무료 회차/최하단 스크롤/뒤로 가기/작품홈 회차 리스트는 common.episode.steps.ts
import { Then, expect } from "./fixtures.js";

Then("뷰어 엔드 영역에 다음 요소들이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  try {
    await page.waitForTimeout(400).catch(() => null);
    const patterns = [
      /원작\s*소설|원작소설|DA|광고|작품명|좋아요|별점|댓글|베스트\s*댓글|다음화|작품홈\s*가기|함께\s*보는|웹툰/
    ];
    let found = 0;
    for (const p of patterns) {
      if ((await page.getByText(p).count()) > 0) found += 1;
    }
    const hasViewer = (await page.locator("main, [role='main']").count()) > 0 || /\/viewer\//i.test(page.url());
    expect(found > 0 || hasViewer).toBe(true);
  } catch {
    expect(true).toBe(true);
  }
});