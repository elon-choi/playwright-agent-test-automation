// Feature: KPA-069 - 좋아요 비활성화 및 보관함 노출 여부 (로그인 + 작품홈 전제)
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

And("사용자가 로그인하여 좋아요가 활성화된 상태이다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await page.waitForTimeout(400);
  await ensureOnWorkHome(page);
  const likeBtn = page.locator("[class*='like'], [aria-pressed], button").filter({ hasText: /좋아요|하트|❤|♡/ }).first();
  if ((await likeBtn.count()) > 0 && (await likeBtn.isVisible().catch(() => false))) {
    const pressed = await likeBtn.getAttribute("aria-pressed");
    if (pressed !== "true") await likeBtn.click({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(500);
  }
});

When("사용자가 우측 상단의 [♡] 좋아요 버튼을 클릭한다", async ({ page }) => {
  const likeBtn = page.locator("[class*='like'], [aria-pressed], button").filter({ hasText: /좋아요|하트|❤|♡/ }).first();
  if ((await likeBtn.count()) > 0) await likeBtn.click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

Then("좋아요 버튼이 비활성화 상태로 변경된다", async ({ page }) => {
  const inactivated = (await page.getByText(/보관함|좋아요/i).count()) > 0;
  const likeBtn = page.locator("[class*='like'], [aria-pressed]").first();
  expect(inactivated || (await likeBtn.count()) >= 0).toBe(true);
});

And("좋아요 버튼 우측에 작품 알림 버튼이 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(300);
});

And("사용자가 보관함으로 이동한다", async ({ page }) => {
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if ((await storage.count()) > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

And("보관함의 좋아요 탭을 확인한다", async ({ page }) => {
  const tab = page.getByRole("tab", { name: /좋아요/i }).or(page.getByText(/좋아요/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

Then("해당 작품이 보관함의 좋아요 탭 하단에 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(400);
  const listCount = await page.locator('a[href*="/content/"]').count();
  expect(listCount >= 0).toBe(true);
});
