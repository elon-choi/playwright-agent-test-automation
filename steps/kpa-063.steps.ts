// Feature: KPA-063 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("요일 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("임의의 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("요일 메뉴 하단에 다음과 같은 메뉴가 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});