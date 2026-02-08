// Feature: KPA-117 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 좋아요 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("좋아요 버튼이 활성화된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("좋아요 버튼 우측에 작품 알림 버튼이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});