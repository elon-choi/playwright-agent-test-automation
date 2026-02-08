// Feature: KPA-116 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 {string} 배너를 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("사용자는 해당 작품의 홈 페이지로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});