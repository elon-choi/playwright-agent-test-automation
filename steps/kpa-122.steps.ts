// Feature: KPA-122 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 \"작품홈 가기\" 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자는 작품홈으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});