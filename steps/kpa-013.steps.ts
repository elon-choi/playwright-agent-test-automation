// Feature: KPA-013 시나리오 검증
// Scenario: 비로그인 상태에서 기다무 작품 선물 받기 클릭 시 로그인 페이지로 이동
import { Given, When, Then, expect } from "./fixtures.js";

let loginDetected = false;
const waitForLoginRedirect = async (page: { waitForEvent: any; waitForURL: any; url: () => string }) => {
  const loginPattern = /accounts\.kakao\.com\/login/i;
  await Promise.all([
    page
      .waitForEvent("popup", { timeout: 5000 })
      .then(async (popup: { waitForURL: any; close: () => Promise<void> }) => {
        await popup.waitForURL(loginPattern, { timeout: 5000 });
        loginDetected = true;
        await popup.close();
      })
      .catch(() => {}),
    page
      .waitForURL(loginPattern, { timeout: 5000 })
      .then(() => {
        loginDetected = true;
      })
      .catch(() => {})
  ]);
  if (!loginDetected) {
    throw new Error(`로그인 페이지로 이동하지 않았습니다. 현재 URL: ${page.url()}`);
  }
};

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  loginDetected = false;
  await loginPage.goto(url);
  await expect(page).toHaveURL(url);
});

Given("사용자가 비로그인 상태이다", async ({ loginPage }) => {
  await loginPage.ensureLoggedOut();
});

When('사용자가 GNB 메뉴의 "웹툰" 탭을 클릭한다', async ({ page }) => {
  const webtoonTab = page.getByRole("link", { name: /웹툰\s*탭/i });
  await webtoonTab.first().click();
});

When('사용자가 "지금, 신작!" 섹션의 첫번째 작품 카드를 클릭한다', async ({ page }) => {
  const sectionTitle = page.getByText("지금, 신작!").first();
  await sectionTitle.scrollIntoViewIfNeeded();

  let firstCard = sectionTitle.locator(
    'xpath=following-sibling::*[1]//a[contains(@href,"/content/")]'
  );
  if (!(await firstCard.count())) {
    firstCard = sectionTitle.locator('xpath=following::a[contains(@href,"/content/")][1]');
  }
  if (!(await firstCard.count())) {
    throw new Error("지금, 신작! 섹션에서 작품 카드를 찾지 못했습니다.");
  }
  await firstCard.first().click();
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
});

When("사용자가 작품홈 이미지 하단의 선물 받기 버튼을 클릭한다", async ({ page }) => {
  loginDetected = false;
  const giftText = page.getByText(/선물\s*대여권\s*1장/i).first();
  await giftText.waitFor({ state: "visible", timeout: 15000 });

  const giftSection = giftText.locator('xpath=ancestor::*[self::div or self::section][1]');
  const giftSpan = giftSection.locator("span.font-small2-bold.text-el-10.text-center.break-keep.w-max");
  if (await giftSpan.count()) {
    const span = giftSpan.first();
    const clickableAncestor = span.locator(
      "xpath=ancestor::*[self::button or @role='button' or @tabindex][1]"
    );
    if (await clickableAncestor.count()) {
      await clickableAncestor.first().click();
      await waitForLoginRedirect(page);
      return;
    }
    await span.click();
    await waitForLoginRedirect(page);
    return;
  }

  const giftByText = giftSection.getByText("받기").first();
  await giftByText.click();
  await waitForLoginRedirect(page);
});

Then("사용자는 카카오 로그인 페이지로 이동한다", async ({ page }) => {
  if (loginDetected) {
    return;
  }
  await expect(page).toHaveURL(/accounts\.kakao\.com\/login/i);
});
