import { Given, When, Then, dismissPermissionPopup, getBaseUrl } from "./fixtures.js";

Given("사용자가 카카오페이지 로그인 화면을 연다", async ({ page, loginPage }) => {
  await loginPage.goto(getBaseUrl());
  await loginPage.openLogin();
  await dismissPermissionPopup(page);
});

When("사용자가 성인 인증 계정으로 로그인한다", async ({ loginPage }) => {
  await loginPage.fillCredentialsFromEnv("adult");
  await loginPage.submitLogin();
});

When("사용자가 미인증 계정으로 로그인한다", async ({ loginPage }) => {
  await loginPage.fillCredentialsFromEnv("nonAdult");
  await loginPage.submitLogin();
});

Then("추천 홈으로 이동한다", async ({ loginPage }) => {
  await loginPage.verifyRecommendationHome();
});
