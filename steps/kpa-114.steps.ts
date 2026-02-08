// Feature: KPA-114 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 이전\\/다음 회차가 무료인 작품을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뷰어 하단의 다음화 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뷰어 하단의 이전화 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자는 다음 회차로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 이전 회차로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 작품홈의 회차 리스트로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});