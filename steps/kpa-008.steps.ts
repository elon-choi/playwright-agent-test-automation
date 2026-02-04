// Feature: KPA-008 시나리오 검증
// Scenario: 비로그인 상태에서 프로필 아이콘 클릭 시 로그인 페이지로 이동
import { Given, When, Then, expect } from "./fixtures.js";

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  await loginPage.goto(url);
  await expect(page).toHaveURL(url);
});

Given("사용자가 비로그인 상태이다", async ({ loginPage }) => {
  await loginPage.ensureLoggedOut();
});

When("사용자가 우측 상단의 프로필 아이콘을 클릭한다", async ({ loginPage }) => {
  await loginPage.openLogin();
});

Then("사용자는 카카오 로그인 페이지로 리다이렉트된다", async ({ page }) => {
  await expect(page).toHaveURL(/accounts\.kakao\.com\/login/i);
});

Then(
  "로그인 페이지의 URL이 {string}인지 확인한다",
  async ({ page }, expectedUrl: string) => {
    await expect(page).toHaveURL(new RegExp(expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
);
