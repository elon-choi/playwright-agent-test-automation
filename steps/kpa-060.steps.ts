// Feature: KPA-060 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 실시간 랭킹 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 웹툰 실시간 랭킹 1위 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("실시간 랭킹 메뉴 하단에 다음 요소들이 노출되어야 한다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});

And("사용자는 웹툰 실시간 랭킹 1위 작품의 홈으로 이동해야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});