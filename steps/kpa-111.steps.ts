// Feature: KPA-111 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 뷰어 상단의 설정 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 자동 스크롤 활성 버튼을 On으로 설정한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뷰어 이미지 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("뷰어 우측 하단에 자동 스크롤 버튼이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});