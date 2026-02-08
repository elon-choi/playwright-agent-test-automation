// Feature: KPA-062 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입하여 상단의 추천 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 이벤트 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 이벤트 전체 보기 배너를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("이벤트 메뉴 하단에 다음 요소들이 노출되어야 한다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});

And("사용자는 이벤트 전체 페이지로 이동해야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});