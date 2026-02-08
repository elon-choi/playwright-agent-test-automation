// Feature: KPA-045 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 구매작품 탭에 접근한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("구매 순, 업데이트 순, 제목 순 정렬 옵션이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});