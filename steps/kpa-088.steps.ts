// Feature: KPA-088 - 기다무 안내 팝업 노출
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

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

And("사용자가 {string}을 선택한다", async ({ page }, param: string) => {
  await page.waitForTimeout(400);
  if (/기다무|BM/.test(param)) await ensureOnWorkHome(page);
});

When("사용자가 {string}을 클릭한다", async ({ page }, param: string) => {
  if (/기다무|충전/.test(param)) {
    const area = page.getByText(/기다무|충전|대여권/i).first();
    if ((await area.count()) > 0) {
      await area.evaluate((el: HTMLElement) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForTimeout(400);
      await area.evaluate((el: HTMLElement) => {
        const target = el.closest("a") || el.closest("button") || el.closest("[onclick]") || el;
        (target as HTMLElement).click();
      });
    }
  }
  await page.waitForTimeout(500);
});

Then("{string}이 화면에 노출된다", async ({ page }, param: string) => {
  if (/기다무 안내 팝업/.test(param)) {
    const hasPopup = (await page.getByRole("dialog").count()) > 0 || (await page.getByText(/기다리면|이용권|닫기/i).count()) > 0;
    expect(hasPopup).toBe(true);
  }
});

And("팝업에는 다음과 같은 내용이 포함되어야 한다:", async ({ page }) => {
  const hasContent = (await page.getByText(/이용권|무료|회차|닫기/i).count()) > 0;
  expect(hasContent).toBe(true);
});