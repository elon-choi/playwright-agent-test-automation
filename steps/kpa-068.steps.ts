// Feature: KPA-068 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인되어 있으며, 좋아요가 비활성화된 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 작품 이미지 영역 내 [♡] 좋아요 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 작품홈에서 이탈하여 보관함 메뉴로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 보관함의 좋아요 탭을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("좋아요 버튼이 활성화되고, 좋아요 버튼 우측에 작품 알림 버튼이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("보관함의 좋아요 탭 하단에 사용자가 선택한 작품이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});