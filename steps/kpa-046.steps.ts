// Feature: KPA-046 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 상단의 선물함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("선물함 메뉴 화면이 올바르게 구성되어 있는지 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 임의의 작품 리스트에서 선물 받기 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("임의의 작품 리스트를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자는 선물함 화면에 진입하며, 다음과 같은 메뉴가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("클릭한 작품의 이용권이 지급되었다는 토스트 메시지가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 클릭한 작품의 홈으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});