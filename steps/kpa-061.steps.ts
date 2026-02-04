// Feature: KPA-061 시나리오 검증
// Scenario: 오늘신작 메뉴 및 작품 홈 이동 검증
import { Given, When, Then, expect } from "./fixtures.js";

let selectedWorkUrl: string | null = null;

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  await loginPage.goto(url);
  await expect(page).toHaveURL(url);
});

Given("사용자는 로그인하지 않은 상태이다", async ({ loginPage }) => {
  await loginPage.ensureLoggedOut();
});

When("사용자가 상단의 추천 GNB 메뉴를 클릭한다", async ({ page }) => {
  const gnbRecommend = page.getByRole("link", { name: /추천/i });
  await gnbRecommend.first().click();
});

When("사용자가 오늘신작 서브탭을 클릭한다", async ({ page }) => {
  const subTab = page.getByRole("link", { name: /오늘신작/i });
  await subTab.first().click();
});

Then("오늘신작 메뉴 하단에 다음 요소들이 노출된다:", async ({ page }) => {
  await expect(page.locator('a[href="/menu/10010"]')).toBeVisible();
  await expect(page.locator('a[href="/menu/10011"]')).toBeVisible();
  await expect(page.locator('a[href="/menu/10016"]')).toBeVisible();
  await expect(page.getByText(/^TODAY$/)).toBeVisible();
});

When("사용자가 첫번째 신작 작품을 클릭한다", async ({ page }) => {
  const todaySectionTitle = page.getByText(/^TODAY$/).first();
  await todaySectionTitle.waitFor({ state: "visible", timeout: 15000 });

  const workLink = page.getByRole("link", { name: /^작품,/ });
  await workLink.first().waitFor({ state: "visible", timeout: 15000 });

  selectedWorkUrl = await workLink.first().getAttribute("href");
  await workLink.first().click();
});

Then("사용자는 클릭한 작품의 작품홈으로 이동한다", async ({ page }) => {
  if (!selectedWorkUrl) {
    throw new Error("작품 URL을 확보하지 못했습니다.");
  }
  await expect(page).toHaveURL(new RegExp(selectedWorkUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
