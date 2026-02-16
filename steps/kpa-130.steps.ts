// Feature: KPA-130 - 무료 회차에서 원작소설로 이동하기
// "뷰어 이미지 최하단 스크롤", "이 작품을 원작소설로 보기 배너 클릭"은 common/kpa-116에 구현됨
import { Then, expect } from "./fixtures.js";

Then("사용자는 해당 작품의 홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 8000 });
});