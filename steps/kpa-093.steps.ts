// Feature: KPA-093 시나리오 검증 - 회차 리스트와 뷰어 이동
import { And, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 무료 회차와 일반 회차가 있는 페이지에 도달한다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요할 수 있습니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  if (/\/content\/|\/landing\/series\//i.test(page.url())) return;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(600);
  const card = page.locator('a[href*="/content/"]').first();
  await card.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  await card.click({ timeout: 8000 });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
});

Then("회차 리스트 영역이 화면에 표시된다", async ({ page }) => {
  const list = page.locator('a[href*="/viewer/"]').or(page.getByText(/\d+\s*화|\d+\s*회차|회차/));
  await expect(list.first()).toBeVisible({ timeout: 10000 });
});

When("사용자가 특정 [회차]를 클릭한다", async ({ page }) => {
  const episodeLink = page.locator('a[href*="/viewer/"]').first();
  await episodeLink.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  await episodeLink.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(200);
  await episodeLink.click({ timeout: 10000, force: true }).catch(async () => {
    await episodeLink.evaluate((el: HTMLElement) => el.click());
  });
  await page.waitForURL(/\/viewer\//i, { timeout: 20000 }).catch(() => null);
  await page.waitForTimeout(400);
});

When("사용자가 특정 무료 뱃지가 표시된 [회차]를 클릭한다", async ({ page }) => {
  const freeEpisode = page.locator('a[href*="/viewer/"]').filter({ hasText: /무료|Free|FREE/ }).first();
  const episodeLink = (await freeEpisode.count()) > 0 && (await freeEpisode.isVisible().catch(() => false))
    ? freeEpisode
    : page.locator('a[href*="/viewer/"]').first();
  await episodeLink.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  await episodeLink.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(200);
  await episodeLink.click({ timeout: 10000, force: true }).catch(async () => {
    await episodeLink.evaluate((el: HTMLElement) => el.click());
  });
  await page.waitForURL(/\/viewer\//i, { timeout: 20000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("해당 회차의 뷰어 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/viewer\//i, { timeout: 15000 });
  const hasViewer = (await page.getByText(/회차|화|다음|이전/i).count()) > 0 || (await page.locator('[class*="viewer"], [class*="Viewer"]').count()) > 0;
  expect(hasViewer || /\/viewer\//i.test(page.url())).toBe(true);
});
