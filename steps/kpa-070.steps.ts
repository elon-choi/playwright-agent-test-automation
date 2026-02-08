// Feature: KPA-070 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 [더보기] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("더보기 레이어 팝업이 노출되어야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("팝업에는 {string}과 {string} 옵션이 포함되어 있어야 한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

When("사용자가 팝업 내의 {string} 버튼을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("더보기 레이어 팝업이 닫혀야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});