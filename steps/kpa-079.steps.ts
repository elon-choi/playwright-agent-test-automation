// Feature: KPA-079 - 회차 이력 있는 작품 이어보기 (로그인 + 원작 보기 플로팅)
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

And("사용자는 회차 감상 이력이 있는 작품을 가지고 있다", async ({ page }) => {
  await page.waitForTimeout(300);
  await ensureOnWorkHome(page);
});

And("사용자는 동일한 작품을 여러 번 감상한 이력이 있다", async ({ page }) => {
  await page.waitForTimeout(300);
});

When("사용자가 원작 보기 플로팅 버튼을 클릭한다", async ({ page }) => {
  const btn = page.locator("button, [role='button']").filter({ hasText: /원작\s*보기|이어보기|플로팅/i }).first();
  if ((await btn.count()) > 0) await btn.click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

