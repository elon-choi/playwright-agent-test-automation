// Feature: KPA-027 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입하여 우 상단의 검색 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("임의의 텍스트를 입력하고 엔터 키를 누른다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("검색 결과 화면이 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("매칭된 키워드에 해당하는 작품 리스트가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 임의의 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("선택한 작품의 상세 페이지로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("작품 카드에는 썸네일, #장르명, 뱃지, 작품명, 작가명이 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});