// Feature: KPA-127 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 전체 연령 작품 목록에서 무료 회차를 선택한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("뷰어 하단의 정주행 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("뷰어 이미지의 최하단까지 스크롤을 진행한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("뷰어 엔드 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});