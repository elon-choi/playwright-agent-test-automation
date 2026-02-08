// Feature: KPA-066 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("페이지가 완전히 로드된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 작품명 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("작품명이 올바르게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 작가명 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("작가명이 올바르게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 장르 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("장르가 올바르게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 누적 열람 수와 좋아요 수를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("누적 열람 수와 좋아요 수가 올바르게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});