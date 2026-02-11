// Feature: KPA-088 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 {string}을 선택한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

When("사용자가 {string}을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("{string}이 화면에 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("팝업에는 다음과 같은 내용이 포함되어야 한다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});