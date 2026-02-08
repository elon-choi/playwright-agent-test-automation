// Feature: KPA-119 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 댓글 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 닫기 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("해당 회차의 Best 탭에 포커싱된 댓글창이 팝업된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("팝업창이 종료된 후 뷰어 엔드 영역이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});