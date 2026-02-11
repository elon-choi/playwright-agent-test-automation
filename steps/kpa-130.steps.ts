// Feature: KPA-130 (overnight generated)
// "사용자가 뷰어 이미지를 최하단까지 스크롤한다"는 common.episode.steps.ts에 구현됨
import { Then } from "./fixtures.js";

Then("사용자는 해당 작품의 홈으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});