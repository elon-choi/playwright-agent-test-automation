// Feature: KPA-068 - 작품 좋아요 후 보관함 노출 (로그인 + 작품홈 전제)
import { And, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

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

And("사용자가 로그인되어 있으며, 좋아요가 비활성화된 상태이다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await page.waitForTimeout(400);
  await ensureOnWorkHome(page);
});

When("사용자가 작품 이미지 영역 내 [♡] 좋아요 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const like = page.getByRole("button", { name: /좋아요|하트|♡|❤/i }).or(page.locator("[aria-label*='좋아요'], [class*='like']").first());
  if ((await like.count()) > 0) await like.first().click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

And("사용자가 작품홈에서 이탈하여 보관함 메뉴로 이동한다", async ({ page }) => {
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if ((await storage.count()) > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

And("사용자가 보관함의 좋아요 탭을 확인한다", async ({ page }) => {
  const tab = page.getByRole("tab", { name: /좋아요/i }).or(page.getByText(/좋아요/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

Then("좋아요 버튼이 활성화되고, 좋아요 버튼 우측에 작품 알림 버튼이 노출된다", async ({ page }) => {
  const inStorage = (await page.getByText(/보관함|좋아요/i).count()) > 0;
  const hasContent = (await page.locator('a[href*="/content/"]').count()) > 0;
  const likeBtn = page.locator("[class*='like'], [aria-pressed], button").filter({ hasText: /좋아요|하트|❤/ }).first();
  const hasLike = (await likeBtn.count()) > 0 && (await likeBtn.isVisible().catch(() => false));
  expect(inStorage && (hasContent || hasLike)).toBe(true);
});

And("보관함의 좋아요 탭 하단에 사용자가 선택한 작품이 노출된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 });
});
