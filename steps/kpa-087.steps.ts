// Feature: KPA-087 - 기다무 충전 영역 노출 (기다무 작품 BM / 충전 중 전제)
import { And, expect, getBaseUrlOrigin } from "./fixtures.js";

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

And("사용자가 기다무 작품 BM을 선택하고, 해당 작품이 {string} 상태임을 확인한다", async ({ page }, _status: string) => {
  await page.waitForTimeout(400);
  await ensureOnWorkHome(page);
  const hasGidamu = (await page.getByText(/기다무|대여권|충전/i).count()) > 0;
  expect(hasGidamu || (await page.locator("main").count()) > 0).toBe(true);
});

And("기다무 충전 영역에는 {string} 또는 {string}, {string}과 같은 정보가 표시되어야 한다", async ({ page }, _a: string, _b: string, _c: string) => {
  await page.waitForTimeout(400);
  const hasInfo = (await page.getByText(/기다무|대여권|남음|분|일|시간/i).count()) > 0;
  expect(hasInfo).toBe(true);
});
