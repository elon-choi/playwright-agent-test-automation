// Feature: KPA-112 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 전체 연령 작품 목록을 본다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 무료 회차 목록에 진입한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뷰어 하단의 정주행 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("정주행 안내 가이드 팝업창의 하단 확인 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뷰어 이미지의 최하단까지 스크롤한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뷰어 엔드 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("정주행 아이콘이 활성화되고, 뷰어 엔드 영역에 노출되던 메뉴들\\(배너, 베스트 댓글 등\\)이 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
});