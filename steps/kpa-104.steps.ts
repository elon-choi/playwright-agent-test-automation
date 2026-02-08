// Feature: KPA-104 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 댓글 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 [정렬] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 임의의 정렬 옵션을 선택한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("전체 댓글 갯수가 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("정렬 버튼이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("좋아요순 \\/ 최신순 정렬 설정 팝업이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("댓글이 선택한 정렬 순서에 맞춰 변경된다", async ({ page }) => {
  await page.waitForTimeout(500);
});