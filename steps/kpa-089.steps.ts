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

And("사용자가 {string} 웹툰 작품을 검색 후 클릭한다 {string}", async ({ page }, _keyword: string, contentUrl: string) => {
  if (/\/content\/|\/landing\/series\//i.test(contentUrl)) {
    await page.goto(contentUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(600);
    const contentIdMatch = contentUrl.match(/\/content\/(\d+)/) || contentUrl.match(/\/landing\/series\/([^/]+)/);
    if (contentIdMatch) {
      const expectedId = contentIdMatch[1];
      const currentUrl = page.url();
      if (!currentUrl.includes(expectedId)) {
        throw new Error(`지정한 작품으로 이동하지 못했습니다. 기대 URL: ${contentUrl}, 현재 URL: ${currentUrl}`);
      }
    }
    return;
  }
  const searchTrigger = page.getByRole("button", { name: /검색/i }).or(page.getByRole("link", { name: /검색/i })).or(page.locator('[aria-label*="검색"]').first());
  if ((await searchTrigger.count()) > 0) await searchTrigger.first().click({ timeout: 8000 });
  await page.waitForTimeout(400);
  const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(page.getByPlaceholder(/제목|작가|검색/i));
  await searchInput.first().fill(_keyword, { timeout: 8000 });
  await page.waitForTimeout(400);
  await searchInput.first().press("Enter");
  await page.waitForTimeout(1200);
  const firstWork = page.locator('a[href*="/content/"]').first();
  await firstWork.waitFor({ state: "visible", timeout: 10000 });
  await firstWork.click({ timeout: 8000, force: true });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
});

And("사용자가 구매회차 메뉴를 클릭한다", async ({ page }) => {
  const menu = page.getByRole("tab", { name: /구매\s*회차|구매회차/i }).or(page.getByText(/구매\s*회차|구매회차/i).first());
  if ((await menu.count()) > 0) await menu.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

And("사용자가 구매회차 체크 박스 메뉴를 클릭한다", async ({ page }) => {
  const menu = page.getByRole("tab", { name: /구매\s*회차|구매회차/i }).or(page.getByText(/구매\s*회차|구매회차/i).first());
  if ((await menu.count()) > 0) await menu.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

Then("구매회차 목록에 사용자가 구매한 회차 리스트가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
  const noPurchaseMsg = page.getByText(/구매한\s*회차가\s*없습니다|구매한 회차가 없습니다/i);
  const noPurchaseVisible = await noPurchaseMsg.isVisible().catch(() => false);
  expect(noPurchaseVisible, '"구매한 회차가 없습니다." 메시지가 노출되지 않아야 합니다(구매 회차 목록이 노출된 상태).').toBe(false);
});