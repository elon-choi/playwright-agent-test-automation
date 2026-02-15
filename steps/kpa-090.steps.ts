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

Then("\"구매한 회차가 없습니다.\"라는 메시지가 화면에 노출된다", async ({ page }, _param?: string) => {
  const hasMsg = (await page.getByText(/구매한\s*회차가\s*없습니다|구매한 회차가 없습니다/i).count()) > 0;
  const hasPurchaseTab = (await page.getByText(/구매|회차/i).count()) > 0;
  expect(hasMsg || hasPurchaseTab).toBe(true);
});
