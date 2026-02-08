// Feature: KPA-130 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 뷰어 이미지를 최하단까지 스크롤한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자는 해당 작품의 홈으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});