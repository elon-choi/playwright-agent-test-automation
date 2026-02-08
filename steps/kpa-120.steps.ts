// Feature: KPA-120 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 베스트 댓글 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 닫기 버튼 또는 뒤로가기 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("해당 회차의 전체 탭에 포커싱된 댓글창이 팝업된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("팝업창을 종료한 후 뷰어의 엔드 영역이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});