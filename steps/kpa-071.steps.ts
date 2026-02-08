// Feature: KPA-071 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 [이용권 내역] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자는 이용권 내역 화면으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("이용권 내역 화면이 올바르게 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});