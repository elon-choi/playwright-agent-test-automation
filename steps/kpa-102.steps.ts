// Feature: KPA-102 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 이 작품과 함께보는 웹툰 작품을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 추천 작품의 썸네일을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("추천 작품이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("작품 이미지, BM, 작품명이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});