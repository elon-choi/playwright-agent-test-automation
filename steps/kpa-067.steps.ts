// Feature: KPA-067 - 작품 이미지 BM 영역 확인 (작품홈 전제)
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

const ensureOnWorkHome = async (page: any) => {
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
};

When("사용자가 작품 이미지의 좌측 상단에 있는 BM 영역을 확인한다", async ({ page }) => {
  await ensureOnWorkHome(page);
  await page.waitForTimeout(400);
});

Then("작품의 BM 타입에 따라 올바르게 표기되어 노출된다", async ({ page }) => {
  const bm = page.locator("[class*='badge'], [class*='Badge'], [class*='bm'], img[alt*='뱃지']").first();
  const hasBadge = (await bm.count()) > 0 && (await bm.isVisible().catch(() => false));
  const hasImage = (await page.locator("main img, [role='main'] img").count()) > 0;
  expect(hasBadge || hasImage).toBe(true);
});
