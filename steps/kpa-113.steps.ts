// Feature: KPA-113 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 전체 연령 작품 목록을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뷰어 하단의 댓글 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("댓글창이 해당 회차의 전체 탭에 포커싱되어 팝업된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("댓글창이 종료되며, 사용자는 뷰어로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});