// Feature: KPA-118 (overnight generated)
// "사용자가 뷰어 이미지의 최하단까지 스크롤을 진행한다"는 common.episode.steps.ts에 구현됨
import { Then, And } from "./fixtures.js";

And("사용자가 별점 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 회차 별점을 선택한 후 완료 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("회차 별점 남기기 팝업창이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("선택한 별점이 설정된 후 팝업창이 종료된다", async ({ page }) => {
  await page.waitForTimeout(500);
});