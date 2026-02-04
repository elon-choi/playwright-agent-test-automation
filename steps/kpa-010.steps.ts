// Feature: KPA-010 시나리오 검증
// Scenario: 비로그인 상태에서 선물받기 버튼 클릭 시 로그인 페이지로 이동
import { Given, When, Then, expect } from "./fixtures.js";

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  await loginPage.goto(url);
  await expect(page).toHaveURL(url);
});

Given("사용자는 현재 비로그인 상태이다", async ({ loginPage }) => {
  await loginPage.ensureLoggedOut();
});

When("사용자가 우측 상단의 선물함 아이콘을 클릭한다", async ({ page }) => {
  const giftIcon = page.getByRole("link", { name: /선물함/i });
  await giftIcon.first().click();
});

When("사용자가 임의의 작품의 선물받기 버튼을 클릭한다", async ({ page }) => {
  const giftButton = page.getByRole("button", { name: /선물받기|선물 받기/i });
  await giftButton.first().click();
});

Then("사용자는 카카오 로그인 페이지로 리다이렉트된다", async ({ page }) => {
  await expect(page).toHaveURL(/accounts\.kakao\.com\/login/i);
});
