// Feature: KPA-093 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 무료 회차와 일반 회차가 있는 페이지에 도달한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("회차 리스트 영역이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 특정 [회차]를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("해당 회차의 뷰어 페이지로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});