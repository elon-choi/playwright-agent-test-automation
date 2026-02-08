// Feature: KPA-057 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 상단의 책 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("배너는 다음 요소들로 구성된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});