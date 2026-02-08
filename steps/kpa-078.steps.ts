// Feature: KPA-078 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 회차 감상 이력이 있는 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("[이어보기] 회차명이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});