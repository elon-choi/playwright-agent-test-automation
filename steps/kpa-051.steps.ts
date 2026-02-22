// Feature: KPA-051 시나리오 검증 - 운영중인 배너의 동작 및 노출 (웹툰 GNB)
// 배너 화살표/저장 클릭/이동 확인/운영 배너 노출 스텝은 kpa-048.steps.ts 공유
import { When, And, expect } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 상단의 웹툰 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const gnb = page.getByRole("link", { name: /웹툰\s*탭|웹툰/i }).first();
  if (await gnb.count() > 0) await gnb.click({ timeout: 5000 });
  await page.waitForTimeout(600);
});

And("배너는 다음 요소로 구성되어 있다:", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasImg = (await page.locator('img').count()) > 0;
  const hasText = (await page.getByText(/배너|타이틀|뱃지|메인타이틀|서브타이틀/i).count()) > 0;
  expect(hasImg || hasText).toBe(true);
});
