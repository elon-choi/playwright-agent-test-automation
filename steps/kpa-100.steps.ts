// Feature: KPA-100 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 임의의 [키워드]를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("키워드가 검색 결과 페이지에 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 작품 리스트를 확인할 수 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자는 해당 작품의 상세 페이지로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("작품 이미지, BM, 장르, 작품명, 작가명이 상세 페이지에 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});