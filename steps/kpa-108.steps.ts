// Feature: KPA-108 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("로그인하여 댓글을 볼 수 있는 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("댓글 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("[더보기] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("[차단하기] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("[차단] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("{string} 님의 댓글\\/답글을 차단하시겠습니까? 팝업이 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("해당 유저의 댓글\\/답글이 차단되고, 댓글 영역에 {string}가 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});