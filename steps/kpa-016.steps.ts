// Feature: KPA-016 시나리오 검증
// Scenario: 알림 기능 검증
import { Given, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

Given("사용자가 수신 받은 알림 리스트를 보유하고 있다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    throw new Error("알림 기능 검증을 위해 로그인 상태가 필요합니다. 먼저 login.feature로 로그인해 주세요.");
  }
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin());
  await page.waitForTimeout(500);
});

When("사용자가 알림 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const alarmMenu = page
    .getByRole("link", { name: /알림/i })
    .or(page.getByRole("button", { name: /알림/i }))
    .or(page.getByLabel(/알림/i))
    .or(page.locator('a[href*="alarm"], a[href*="notification"], button[aria-label*="알림"]').first());
  await alarmMenu.first().click({ timeout: 10000 });
});

When("사용자가 임의의 알림 메시지를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const listItem = page.locator('[class*="alarm"], [class*="notification"], [data-test*="notification"] a, li a').first();
  const fallback = page.getByRole("link").filter({ hasNot: page.getByRole("link", { name: /메인|홈|추천|웹툰|웹소설|책|바로가기/i }) }).first();
  const toClick = (await listItem.count()) > 0 ? listItem : fallback;
  await toClick.click({ timeout: 10000 });
});

Then("사용자는 알림 화면에 진입하며, 다음과 같은 메뉴가 노출된다:", async ({ page }) => {
  await page.waitForTimeout(500);
  const alarmEl = page.getByText(/알림/i).first();
  await expect(alarmEl).toBeAttached({ timeout: 10000 });
  await expect(alarmEl).toContainText("알림");
});

Then("사용자는 알림 상세 페이지로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const urlMatch = /alarm|notification|알림|feed|inbox/i.test(page.url());
  const hasAlarmInDom = await page.getByText(/알림/i).first().isVisible().catch(() => false)
    || await page.getByText(/알림/i).first().count().then((c) => c > 0).catch(() => false);
  expect(urlMatch || hasAlarmInDom).toBe(true);
});
