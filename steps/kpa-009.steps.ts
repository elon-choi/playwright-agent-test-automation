// Feature: KPA-009 시나리오 검증
// Scenario: 비로그인 상태에서 보관함 아이콘 클릭 시 로그인 페이지로 이동
import { Given, When, Then, expect } from "./fixtures.js";

When("사용자가 우측 상단의 보관함 아이콘을 클릭한다", async ({ page }) => {
  const savedIcon = page.getByRole("button", { name: /보관함/i });
  await savedIcon.first().click();
});

Then("사용자는 카카오 로그인 페이지로 리디렉션된다", async ({ page }) => {
  await expect(page).toHaveURL(/accounts\.kakao\.com\/login/i);
});
