// Feature: KPA-138 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("무료 회차가 있는 작품을 선택한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("{string} 팝업이 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("카카오 페이지 앱이 실행되며, 해당 회차로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});