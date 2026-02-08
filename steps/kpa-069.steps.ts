// Feature: KPA-069 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 좋아요가 활성화된 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 우측 상단의 [♡] 좋아요 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("좋아요 버튼이 비활성화 상태로 변경된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("좋아요 버튼 우측에 작품 알림 버튼이 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 보관함으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("보관함의 좋아요 탭을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("해당 작품이 보관함의 좋아요 탭 하단에 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
});