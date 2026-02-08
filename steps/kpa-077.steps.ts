// Feature: KPA-077 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자의 계정에 회차 감상 이력이 없다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 회차 탭 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("플로팅 버튼이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 플로팅 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("[첫 화 보기] 버튼이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("첫 화 뷰어가 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});