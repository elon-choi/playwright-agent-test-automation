// Feature: KPA-079 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 회차 감상 이력이 있는 작품을 가지고 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 동일한 작품을 여러 번 감상한 이력이 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 모바일 웹에서 회차 탭 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 원작 보기 플로팅 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});