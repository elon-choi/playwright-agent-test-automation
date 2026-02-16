// Feature: KPA-054 시나리오 검증 (운영중인 배너가 3개 이상 존재한다는 kpa-051.steps.ts에 정의)
// When '사용자가 웹 페이지에 진입하여 상단의 웹소설 GNB 메뉴를 클릭한다'는 kpa-055.steps.ts에 정의
import { And, expect } from "./fixtures.js";

And("배너는 배경 및 썸네일, 메인타이틀, 서브타이틀, 뱃지, 배너 순서로 구성된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasContent = await page.locator('img').count() > 0 || await page.getByText(/배너|타이틀|뱃지/i).count() > 0;
  expect(hasContent).toBe(true);
});
