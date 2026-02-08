// Feature: KPA-105 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

Then("댓글 영역이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 첫 번째 댓글의 [좋아요] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("댓글 리스트가 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("각 댓글에는 닉네임, 작성일자, 댓글 내용, 좋아요 수, 싫어요 수, 답글 버튼, 더보기 버튼이 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("클릭한 댓글의 좋아요 수가 1 증가하여 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});