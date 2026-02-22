// Feature: KPA-117 - 무료 회차에서 좋아요/작품 알림 버튼 검증
// 전체 연령 작품 목록 확인/무료 회차 진입/최하단 스크롤은 common.episode.steps.ts
import { And, Then, expect } from "./fixtures.js";

And("사용자가 좋아요 아이콘을 클릭한다", async ({ page }) => {
  if (page.isClosed?.()) throw new Error("페이지가 닫혀 있습니다.");
  const likeIcon = page.getByRole("img", { name: /좋아요/ }).or(page.locator('img[alt*="좋아요"]').first());
  const n = await likeIcon.count();
  expect(n).toBeGreaterThan(0);
  await likeIcon.first().scrollIntoViewIfNeeded();
  await likeIcon.first().click({ timeout: 6000 });
  await page.waitForTimeout(300);
});

Then("좋아요 버튼이 활성화된다", async ({ page }) => {
  const hasLikeIcon = (await page.getByRole("img", { name: /좋아요/ }).count()) > 0
    || (await page.locator('img[alt*="좋아요"]').count()) > 0;
  const hasLikeActive = (await page.locator('img[alt*="좋아요"][alt*="활성화"]').count()) > 0
    || (await page.locator("[aria-pressed='true']").count()) > 0;
  expect(hasLikeIcon).toBe(true);
  expect(hasLikeActive).toBe(true);
});

And("좋아요 버튼 우측에 작품 알림 버튼이 노출된다", async ({ page }) => {
  const hasAlarm = (await page.getByText(/알림|작품\s*알림/i).count()) > 0
    || (await page.getByRole("img", { name: /작품\s*알림|알림/i }).count()) > 0
    || (await page.locator('img[alt*="알림"]').count()) > 0;
  expect(hasAlarm).toBe(true);
});
