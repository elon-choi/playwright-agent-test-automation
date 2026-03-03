// Feature: KPA-013 시나리오 검증
// Scenario: 비로그인 상태에서 기다무 작품 선물 받기 클릭 시 로그인 페이지로 이동
import { Given, When, Then, expect, withAiFallback } from "./fixtures.js";

const KPA013_TEST_WORK_URL = "https://page.kakao.com/content/68532138";

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

When("사용자가 테스트 대상 작품의 작품홈으로 이동한다", async ({ page }) => {
  await page.goto(KPA013_TEST_WORK_URL, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/content\/68532138|\/landing\/series\//i);
});

When("사용자가 작품홈 이미지 하단의 선물 받기 버튼을 클릭한다", async ({ page, ai }) => {
  loginDetected = false;
  await withAiFallback(
    async () => {
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
    },
    "선물 받기 버튼을 클릭한다",
    ai
  );
});

Then("사용자는 카카오 로그인 페이지로 이동한다", async ({ page }) => {
  if (loginDetected) {
    return;
  }
  const onLoginPage = /accounts\.kakao\.com\/login/i.test(page.url());
  if (onLoginPage) {
    return;
  }
  await expect(page).toHaveURL(/accounts\.kakao\.com\/login/i);
});
