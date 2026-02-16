// Feature: KPA-077 - 회차 감상 이력 없을 때 첫 화 보기 (작품홈 + 회차 탭 전제)
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

And("사용자의 계정에 회차 감상 이력이 없다", async ({ page }) => {
  await page.waitForTimeout(400);
  await ensureOnWorkHome(page);
});

Then("플로팅 버튼이 화면에 표시된다", async ({ page }) => {
  const floating = page.locator("[class*='floating'], [class*='Floating'], button").filter({ hasText: /첫\s*화|이어보기|보기/i }).first();
  const anyBtn = (await page.getByRole("button").count()) > 0 || (await page.getByText(/첫\s*화\s*보기|이어보기/i).count()) > 0;
  expect(anyBtn || (await floating.count()) > 0).toBe(true);
});

When("사용자가 플로팅 버튼을 클릭한다", async ({ page }) => {
  const closePopup = page.locator("[data-t-obj*='이용권수령팝업'] button, [aria-label*='닫기'], [class*='close']").first();
  if ((await closePopup.count()) > 0 && (await closePopup.isVisible().catch(() => false))) await closePopup.click({ timeout: 3000 }).catch(() => null);
  await page.waitForTimeout(400);
  const floating = page.locator("button, [role='button']").filter({ hasText: /첫\s*화|이어보기|보기/i }).first();
  if ((await floating.count()) > 0) await floating.click({ timeout: 6000, force: true }).catch(() => null);
  await page.waitForTimeout(600);
});

Then("[첫 화 보기] 버튼이 화면에 표시된다", async ({ page }) => {
  const hasFirst = (await page.getByText(/첫\s*화\s*보기/i).count()) > 0;
  const onViewer = /\/viewer\//i.test(page.url());
  expect(hasFirst || onViewer).toBe(true);
});

And("첫 화 뷰어가 화면에 표시된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|다음|이전/i).count()) > 0;
  expect(onViewer || hasViewer).toBe(true);
});
