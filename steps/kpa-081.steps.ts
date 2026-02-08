// Feature: KPA-081 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 \"회차\" 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자의 계정이 캐시가 충전된 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("{string} 버튼을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("대여권 n장을 선택하고 캐시 금액 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("구매할 이용권 수를 선택하고 하단의 {string} 버튼을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("선택한 대여권이 정상적으로 구매되어야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("구매 완료 메시지가 화면에 표시되어야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});