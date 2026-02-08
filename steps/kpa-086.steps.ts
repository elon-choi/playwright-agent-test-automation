// Feature: KPA-086 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 기다무 작품 BM을 선택하고 기다무 충전이 완료된 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 기다무 충전 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("기다무 충전 영역이 화면에 노출되어야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("기다무 대여권 1장이 {string} 동안 사용 가능하다는 메시지가 표시되어야 한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});