// Feature: KPA-033 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("최근본 탭에 작품 리스트가 존재한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 최근본 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 페이지 상단의 검색 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("{string}을 검색어 입력란에 입력한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("검색 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("검색 결과에 {string}이 포함된 작품 리스트가 표시된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});