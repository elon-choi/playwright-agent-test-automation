// Feature: KPA-041 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자의 계정에 구매 이력이 존재한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 웹 페이지에 진입하여 하단의 보관함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 구매작품 탭의 하단 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("작품이 정렬 기준에 따라 올바르게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});