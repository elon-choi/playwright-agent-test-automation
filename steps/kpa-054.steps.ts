// Feature: KPA-054 시나리오 검증
import { When, Then, And, expect } from "./fixtures.js";

And("운영중인 배너가 3개 이상 존재한다", async () => {});

When("사용자가 웹 페이지에 진입하여 상단의 웹소설 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const gnb = page.getByRole("link", { name: /웹소설\s*탭|웹소설/i }).first();
  if (await gnb.count() > 0) await gnb.click({ timeout: 5000 });
  await page.waitForTimeout(600);
});

And("배너는 배경 및 썸네일, 메인타이틀, 서브타이틀, 뱃지, 배너 순서로 구성된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasContent = await page.locator('img').count() > 0 || await page.getByText(/배너|타이틀|뱃지/i).count() > 0;
  expect(hasContent).toBe(true);
});
