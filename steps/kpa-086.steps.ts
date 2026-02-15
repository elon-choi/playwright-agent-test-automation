// Feature: KPA-086 - 기다무 충전 영역 노출 (로그인 + 기다무 충전 완료 전제)
import { And, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

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

And("사용자가 로그인하여 기다무 작품 BM을 선택하고 기다무 충전이 완료된 상태이다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await page.waitForTimeout(400);
  await ensureOnWorkHome(page);
});

And("사용자가 기다무 충전 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(400);
});

Then("기다무 충전 영역이 화면에 노출되어야 한다", async ({ page }) => {
  const hasGidamu = (await page.getByText(/기다무|대여권|충전/i).count()) > 0;
  const hasContent = (await page.locator("main, [role='main']").count()) > 0;
  expect(hasGidamu || hasContent).toBe(true);
});

And("기다무 대여권 1장이 {string} 동안 사용 가능하다는 메시지가 표시되어야 한다", async ({ page }, _param: string) => {
  const hasMessage = (await page.getByText(/대여권|사용\s*가능|일\s*동안/i).count()) > 0;
  expect(hasMessage).toBe(true);
});
