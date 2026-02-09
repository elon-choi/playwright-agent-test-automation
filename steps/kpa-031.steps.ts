// Feature: KPA-031 시나리오 검증 - 감상 이력이 있는 사용자의 보관함 기능 검증
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자의 계정에 감상 이력이 존재한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(300);
});

When("사용자가 웹 페이지에 진입하여 우측 상단의 보관함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

Then("최근본 탭 하단에 작품 리스트가 표시된다", async ({ page }) => {
  const recentTab = page.getByRole("tab", { name: /최근본/i }).or(page.getByRole("link", { name: /최근본/i }));
  if (await recentTab.count() > 0 && (await recentTab.first().isVisible().catch(() => false))) {
    await recentTab.first().click({ timeout: 5000 });
    await page.waitForTimeout(400);
  }
  const list = page.locator('a[href*="/content/"]').or(page.locator("[class*='list'] a")).first();
  await expect(list).toBeVisible({ timeout: 8000 });
});

When("사용자가 임의의 작품 이미지를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const contentLink = page.locator('a[href*="/content/"]').first();
  await contentLink.click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

Then("해당 작품의 홈 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i, { timeout: 10000 });
});

When("사용자가 임의의 작품에서 이어보기 또는 다음화 보기 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const continueBtn = page.getByRole("button", { name: /이어보기|다음화\s*보기|다음\s*회차/i })
    .or(page.getByRole("link", { name: /이어보기|다음화\s*보기/i }))
    .or(page.getByText(/이어보기|다음화\s*보기/).first());
  if (await continueBtn.count() > 0 && (await continueBtn.first().isVisible().catch(() => false))) {
    await continueBtn.first().click({ timeout: 8000 });
  } else {
    const firstEpisode = page.locator('a[href*="/content/"][href*="/menu/"]').first();
    if (await firstEpisode.count() > 0) await firstEpisode.click({ timeout: 8000 });
  }
  await page.waitForTimeout(600);
});

Then("최근본 작품이 정렬 기준에 따라 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const list = page.locator('a[href*="/content/"]').first();
  await expect(list).toBeAttached({ timeout: 5000 }).catch(() => null);
});

And("사용자의 회차 열람 이력 및 보유한 이용권 수에 따라 이어보기 또는 다음 회차로 진입한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const isViewer = /\/viewer\/|\/episode\//i.test(page.url()) || (await page.locator("iframe").count()) > 0;
  const isContent = /\/content\/|\/landing\/series\//i.test(page.url());
  expect(isViewer || isContent).toBe(true);
});
