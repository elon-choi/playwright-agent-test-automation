// Feature: KPA-002 시나리오 검증
// Scenario: 사용자가 카카오 페이지에 로그인하여 추천홈에 진입 (일반 계정 = 미인증 계정)
import { When, Then, expect, dismissPermissionPopup } from "./fixtures.js";

When("사용자가 우측 상단 프로필 아이콘을 클릭한다", async ({ page, loginPage }) => {
  await loginPage.openLogin();
  await dismissPermissionPopup(page);
});

Then("카카오 로그인 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/accounts\.kakao\.com|login/i);
});

When("사용자가 카카오 로그인 페이지에서 아이디와 비밀번호를 입력한다", async ({ loginPage }) => {
  await loginPage.fillCredentialsFromEnv("nonAdult");
});

When("로그인 버튼을 클릭한다", async ({ loginPage }) => {
  await loginPage.submitLogin();
});

Then("사용자는 정상적으로 로그인되어 추천홈으로 진입한다", async ({ loginPage }) => {
  await loginPage.verifyRecommendationHome();
});
