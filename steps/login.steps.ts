import { Given, When, Then } from "./fixtures.js";

Given("사용자가 카카오페이지 로그인 화면을 연다", async ({ loginPage }) => {
  await loginPage.goto("https://page.kakao.com/");
  await loginPage.openLogin();
});

When("사용자가 유효한 계정으로 로그인한다", async ({ loginPage }) => {
  await loginPage.fillCredentialsFromEnv();
  await loginPage.submitLogin();
});

Then("추천 홈으로 이동한다", async ({ loginPage }) => {
  await loginPage.verifyRecommendationHome();
});
