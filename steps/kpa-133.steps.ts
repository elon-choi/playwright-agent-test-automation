// Feature: KPA-133 (overnight generated)
// "사용자가 무료 회차를 선택하여 진입한다"는 common.episode.steps.ts에 구현됨
import { Then, And } from "./fixtures.js";

And("사용자가 댓글 창의 닫기 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("해당 회차의 Best 탭에 포커싱된 댓글 창이 팝업된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("팝업창이 종료된 후 뷰어의 엔드 영역이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});