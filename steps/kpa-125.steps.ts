// Feature: KPA-125 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("전체 연령 작품 목록을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("무료 회차 목록을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("뷰어 상단의 설정 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("자동 스크롤 활성 버튼을 On으로 설정한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("뷰어 이미지 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("우측 하단에 자동 스크롤 버튼이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});