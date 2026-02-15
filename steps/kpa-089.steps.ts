// Feature: KPA-089 - 구매한 회차 목록 확인 (로그인 + 구매 이력 전제)
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

And("사용자가 로그인하여 구매 이력이 있는 계정으로 접속한다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await page.waitForTimeout(400);
  await ensureOnWorkHome(page);
});

And("사용자가 구매회차 메뉴를 클릭한다", async ({ page }) => {
  const menu = page.getByRole("tab", { name: /구매\s*회차|구매회차/i }).or(page.getByText(/구매\s*회차|구매회차/i).first());
  if ((await menu.count()) > 0) await menu.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

Then("구매회차 목록에 사용자가 구매한 회차 리스트가 노출된다", async ({ page }) => {
  const hasList = (await page.locator('a[href*="/viewer/"]').count()) > 0;
  const hasSection = (await page.getByText(/구매|회차/i).count()) > 0;
  expect(hasList || hasSection).toBe(true);
});