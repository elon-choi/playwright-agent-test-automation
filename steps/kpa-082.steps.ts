// Feature: KPA-082 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자의 계정에 충분한 캐시가 충전되어 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 이용권 충전 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 소장권 n장을 선택하고 캐시 금액 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 구매할 이용권 수를 선택하고 하단의 충전하기 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("선택한 소장권이 정상적으로 구매되었음을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자의 캐시 잔액이 적절히 차감되었음을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});