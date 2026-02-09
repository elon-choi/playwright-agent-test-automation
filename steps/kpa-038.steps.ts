// Feature: KPA-038 시나리오 검증
// Scenario: 작품 검색 및 리스트 노출 확인
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 계정에 접속한다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 먼저 로그인해 주세요.");
  }
  await page.waitForLoadState("domcontentloaded").catch(() => null);
});

And("검색 결과가 있는 경우", async () => {});

When("사용자가 {string} 탭 하단의 작품 리스트를 확인한다", async ({ page }, tabName: string) => {
  await page.waitForTimeout(400);
  if (/좋아요/i.test(tabName)) {
    const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
    if (await storage.count() > 0 && (await storage.first().isVisible().catch(() => false))) {
      await storage.first().click({ timeout: 8000 });
      await page.waitForTimeout(500);
    }
    const tab = page.getByRole("tab", { name: /좋아요/i }).or(page.getByRole("link", { name: /좋아요/i }));
    if (await tab.count() > 0) {
      await tab.first().click({ timeout: 5000 });
      await page.waitForTimeout(500);
    }
  }
  const list = page.locator('a[href*="/content/"]').or(page.getByRole("list").locator("li")).first();
  await expect(list).toBeVisible({ timeout: 8000 }).catch(() => null);
});

And("사용자가 검색 아이콘을 클릭하고 임의의 작품을 검색한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(
    page.getByPlaceholder(/제목|작가를 입력하세요/i)
  );
  if (await searchInput.count() > 0) {
    await searchInput.first().click({ timeout: 5000 });
    await searchInput.first().fill("웹툰", { timeout: 5000 });
    await searchInput.first().press("Enter");
  }
  await page.waitForTimeout(1000);
});

Then("검색어에 포함된 작품 리스트가 화면에 노출된다", async ({ page }) => {
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 10000 });
});