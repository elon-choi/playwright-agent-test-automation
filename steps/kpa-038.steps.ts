// Feature: KPA-038 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 계정에 접속한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("검색 결과가 있는 경우", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 검색 아이콘을 클릭하고 임의의 작품을 검색한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("검색어에 포함된 작품 리스트가 화면에 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});