// Feature: KPA-051 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("운영중인 배너가 3개 이상 존재한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 웹 페이지에 진입한 후 상단의 웹툰 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("배너는 다음 요소로 구성되어 있다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});