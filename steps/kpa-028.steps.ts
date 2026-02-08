// Feature: KPA-028 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("최근 검색어가 존재한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 웹 페이지에 진입한 후 우 상단의 {string} 아이콘을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("검색창 하단의 임의의 최근 검색어를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("자동 완성 검색어가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("해당 검색어에 해당되는 검색 결과가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});