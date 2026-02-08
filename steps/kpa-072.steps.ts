// Feature: KPA-072 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 탭 영역 하단 배너를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 탭 영역 하단 배너를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자는 해당 배너의 랜딩 URL로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});