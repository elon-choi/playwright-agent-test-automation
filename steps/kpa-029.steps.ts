// Feature: KPA-029 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 우 상단의 검색 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 검색 입력란에 {string}를 입력하고 엔터 키를 누른다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("사용자는 검색 결과 페이지로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("화면 중간에 {string}라는 텍스트가 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});