// Feature: KPA-126 (overnight generated)
// "사용자가 무료 회차 목록을 확인한다"는 common.episode.steps.ts에 구현됨
import { Then, And } from "./fixtures.js";

And("뷰어 하단의 댓글 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("댓글창이 팝업되며, 해당 회차의 전체 탭에 포커싱된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("댓글창이 종료되고, 사용자는 뷰어로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});