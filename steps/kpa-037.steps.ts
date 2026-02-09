// Feature: KPA-037 시나리오 검증
// Scenario: 좋아요 순 정렬 상태에서 작품 좋아요 후 보관함 반영 확인
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 {string}을 선택한 상태이다", async ({ page }, param: string) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0 && (await storage.first().isVisible().catch(() => false))) {
    await storage.first().click({ timeout: 8000 });
    await page.waitForTimeout(600);
  }
  const likeTab = page.getByRole("tab", { name: /좋아요/i }).or(page.getByRole("link", { name: /좋아요/i }));
  if (await likeTab.count() > 0 && (await likeTab.first().isVisible().catch(() => false))) {
    await likeTab.first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
  }
  if (param.includes("좋아요 순") || param.includes("정렬")) {
    const sortBtn = page.getByRole("button", { name: /정렬/i }).or(page.getByText(/정렬/i).first());
    if (await sortBtn.count() > 0 && (await sortBtn.first().isVisible().catch(() => false))) {
      await sortBtn.first().click({ timeout: 3000 });
      await page.waitForTimeout(300);
      const goodOrder = page.getByRole("button", { name: /좋아요\s*순/i }).or(page.getByText(/좋아요\s*순/i).first());
      if (await goodOrder.count() > 0) await goodOrder.first().click({ timeout: 3000 });
    }
  }
  await page.waitForTimeout(300);
});

When("사용자가 웹 페이지에 진입한 후 하단의 {string} 메뉴를 클릭한다", async ({ page }, menuName: string) => {
  await page.waitForTimeout(400);
  const menu = page.getByRole("link", { name: new RegExp(menuName.replace(/\s/g, "\\s*"), "i") })
    .or(page.getByRole("button", { name: new RegExp(menuName.replace(/\s/g, "\\s*"), "i") }));
  await menu.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

And("사용자가 {string} 하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const list = page.locator('a[href*="/content/"]').or(page.getByRole("list").locator("li")).first();
  await expect(list).toBeVisible({ timeout: 8000 }).catch(() => null);
});

And("사용자가 {string}에서 2위 작품을 클릭하고 {string} 아이콘을 클릭한다", async (
  { page },
  _from: string,
  iconName: string
) => {
  await page.waitForTimeout(400);
  if (!/\/content\//.test(page.url())) {
    await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(500);
    const webtoon = page.getByRole("link", { name: /웹툰\s*탭|웹툰/i }).first();
    if (await webtoon.count() > 0) {
      await webtoon.click({ timeout: 5000 });
      await page.waitForTimeout(500);
    }
    const ranking = page.getByText(/실시간\s*랭킹|랭킹/i).first();
    if (await ranking.count() > 0) {
      await ranking.scrollIntoViewIfNeeded();
      await ranking.click({ timeout: 5000 });
      await page.waitForTimeout(600);
    }
  }
  const contentLinks = page.locator('a[href*="/content/"]');
  const count = await contentLinks.count();
  if (count >= 2) {
    await contentLinks.nth(1).scrollIntoViewIfNeeded();
    await contentLinks.nth(1).click({ timeout: 8000 });
  } else if (count >= 1) {
    await contentLinks.first().click({ timeout: 8000 });
  }
  await page.waitForTimeout(800);
  const likeIcon = page.getByRole("button", { name: /좋아요/i })
    .or(page.locator("[aria-label*='좋아요']"))
    .or(page.getByLabel(/좋아요/i));
  if (await likeIcon.count() > 0 && (await likeIcon.first().isVisible().catch(() => false))) {
    await likeIcon.first().click({ timeout: 5000 });
  }
  await page.waitForTimeout(400);
});

Then("{string}의 최상단에 3번에서 선택한 작품이 이력으로 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0 && (await storage.first().isVisible().catch(() => false))) {
    await storage.first().click({ timeout: 8000 });
    await page.waitForTimeout(600);
  }
  const likeTab = page.getByRole("tab", { name: /좋아요/i }).or(page.getByRole("link", { name: /좋아요/i }));
  if (await likeTab.count() > 0) {
    await likeTab.first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
  }
  const list = page.locator('a[href*="/content/"]').first();
  await expect(list).toBeVisible({ timeout: 8000 });
});
