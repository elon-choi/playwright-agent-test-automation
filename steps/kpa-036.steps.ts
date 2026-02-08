// Feature: KPA-036 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 좋아요를 선택한 작품이 존재한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 웹 페이지에 진입한 후 하단의 보관함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 좋아요 탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 알림 토글을 On 또는 Off로 설정한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자가 좋아요를 선택한 작품이 정렬 기준에 맞춰 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 해당 작품의 홈으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("알림 토글 설정에 따라 알림 설정이 올바르게 동작한다", async ({ page }) => {
  await page.waitForTimeout(500);
});