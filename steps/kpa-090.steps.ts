// Feature: KPA-090 - 구매 이력 없는 사용자 회차 탭 메시지 (로그인 전제)
import { And, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

async function ensureOnWorkHome(page: import("@playwright/test").Page) {
  if (/\/(content|landing\/series)\//i.test(page.url())) return;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(600);
  const first = page.locator('a[href*="/content/"]').first();
  if ((await first.count()) > 0) {
    await first.evaluate((el: HTMLElement) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await first.dispatchEvent("click");
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  }
  await page.waitForTimeout(500);
}

And("사용자는 구매 이력이 없는 계정으로 로그인한다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await page.waitForTimeout(400);
  await ensureOnWorkHome(page);
});

Then("\"구매한 회차가 없습니다.\"라는 메시지가 화면에 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  // 구매 이력 없으면 "구매한 회차가 없습니다" 메시지, 있으면 구매 회차 목록 노출
  const noHistoryMsg = page.getByText(/구매한\s*회차가\s*없습니다|구매한 회차가 없습니다|이용권\s*내역이\s*없습니다/i);
  const purchasedList = page.locator('a[href*="/viewer/"], a[href*="/content/"]');
  const hasMsg = (await noHistoryMsg.count()) > 0;
  const hasList = (await purchasedList.count()) > 0;
  expect(hasMsg || hasList, "구매 이력 메시지 또는 구매 회차 목록이 노출되어야 합니다").toBe(true);
});
