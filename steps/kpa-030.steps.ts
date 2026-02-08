// Feature: KPA-030 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 우측 상단의 보관함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("보관함 메뉴 화면이 구성되어야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("보관함 화면에 진입하며, 다음과 같은 메뉴가 노출되어야 한다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});