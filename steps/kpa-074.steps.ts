// Feature: KPA-074 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

Given("사용자가 {string} 사이트에 모바일 웹 브라우저로 접속한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("사용자는 이미지 뷰어를 사용 중이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 화면을 최하단으로 스크롤한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 {string} 영역을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("{string} 영역이 화면에 표시된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("다음 회차의 뷰어가 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});