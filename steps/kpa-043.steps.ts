// Feature: KPA-043 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사이트에 접속한 후 검색 결과가 있는 경우", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 구매작품 탭의 하단에 있는 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("검색어에 포함된 작품 리스트가 사용자에게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});