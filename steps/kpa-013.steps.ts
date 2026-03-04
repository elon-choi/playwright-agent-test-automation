// Feature: KPA-013 시나리오 검증
// Scenario: 비로그인 상태에서 기다무 작품 선물 받기 클릭 시 로그인 페이지로 이동
import { Given, When, Then, expect, dismissPermissionPopup, getBaseUrl } from "./fixtures.js";

// 선물받기 버튼 식별자: data-t-obj 속성에 "선물받기" 포함된 클릭 가능한 div
const GIFT_BUTTON_SELECTOR = '[data-t-obj*="선물받기"]';

let loginDetected = false;
// 비로그인 선물 받기 클릭 시 카카오 로그인 페이지로 이동 (today-gift는 오탐이므로 허용 안 함)
const AUTH_REDIRECT_PATTERN = /accounts\.kakao\.com\/login/i;
const waitForLoginRedirect = async (page: { waitForEvent: any; waitForURL: any; url: () => string }) => {
  await Promise.all([
    page
      .waitForEvent("popup", { timeout: 5000 })
      .then(async (popup: { waitForURL: any; close: () => Promise<void> }) => {
        await popup.waitForURL(AUTH_REDIRECT_PATTERN, { timeout: 5000 });
        loginDetected = true;
        await popup.close();
      })
      .catch(() => {}),
    page
      .waitForURL(AUTH_REDIRECT_PATTERN, { timeout: 5000 })
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
  try {
    const ctx = page.context();
    await ctx.grantPermissions(["local-network-access"], { origin: "https://accounts.kakao.com" });
  } catch {
    // 권한 API 미지원 시 무시 (시스템 권한 창이 뜰 수 있음)
  }

  const base = getBaseUrl().replace(/\/$/, "");

  // 메인 페이지에서 작품 링크를 수집한 뒤, 선물 대여권 버튼이 있는 작품홈을 동적으로 탐색
  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(1000);

  const workUrls: string[] = await page
    .locator('a[href*="/content/"]:not([href*="/list/"])')
    .evaluateAll((els: HTMLAnchorElement[]) => [...new Set(els.map((el) => el.href))]);

  for (const url of workUrls.slice(0, 30)) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(500);

    if (await page.locator(GIFT_BUTTON_SELECTOR).count() > 0) {
      // 선물 대여권 버튼이 있는 작품홈 진입 성공
      return;
    }
  }

  throw new Error("선물 대여권이 활성화된 작품을 찾지 못했습니다. 운영 설정을 확인하세요.");
});

When("사용자가 작품홈 이미지 하단의 선물 받기 버튼을 클릭한다", async ({ page }) => {
  loginDetected = false;
  const giftBtn = page.locator(GIFT_BUTTON_SELECTOR);
  await giftBtn.waitFor({ state: "visible", timeout: 10000 });
  await giftBtn.click();
  await waitForLoginRedirect(page);
  await dismissPermissionPopup(page);
});

Then("사용자는 카카오 로그인 페이지로 이동한다", async ({ page }) => {
  await page.waitForURL(AUTH_REDIRECT_PATTERN, { timeout: 10000 }).catch(() => null);
  for (let i = 0; i < 3; i++) {
    await dismissPermissionPopup(page);
    await page.waitForTimeout(400);
  }
  if (loginDetected) {
    return;
  }
  if (AUTH_REDIRECT_PATTERN.test(page.url())) {
    return;
  }
  await expect(page).toHaveURL(AUTH_REDIRECT_PATTERN);
});
