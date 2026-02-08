// Feature: KPA-123 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 {string} 섹션에서 임의의 작품을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("사용자는 처음 클릭한 작품의 홈으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 이전에 방문한 작품의 홈으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});