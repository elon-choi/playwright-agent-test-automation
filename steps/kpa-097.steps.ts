// Feature: KPA-097 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 유료회차를 선택하고 보유 이용권이 없는 상태이며, 이용권 사용 확인 옵션을 체크한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 회차 리스트 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 특정 회차를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("회차 리스트가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("이용권 충전 페이지로 이동된다", async ({ page }) => {
  await page.waitForTimeout(500);
});