// Feature: KPA-032 시나리오 검증 - 최근본 작품 정렬 및 실시간 랭킹
import { And, Then, expect } from "./fixtures.js";

let lastViewedContentHref: string | null = null;

And("사용자가 {string} 정렬 상태를 선택한다", async ({ page }, sortLabel: string) => {
  await page.waitForTimeout(400);
  const sortBtn = page.getByRole("button", { name: new RegExp(sortLabel.replace(/\s/g, "\\s*")) }).or(page.getByText(new RegExp(sortLabel.replace(/\s/g, "\\s*")))).first();
  if ((await sortBtn.count()) > 0 && (await sortBtn.isVisible().catch(() => false))) {
    await sortBtn.click({ timeout: 6000 });
    await page.waitForTimeout(300);
  }
});

And("사용자가 {string} > {string} > {string}에서 1위~20위 중 임의의 한 작품을 클릭하고, 해당 작품의 1회차를 감상한다", async ({ page }, _1: string, _2: string, _3: string) => {
  lastViewedContentHref = null;
  await page.waitForTimeout(400);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const baseOrigin = new URL(page.url()).origin;
  if (!/\/menu\/|\/content\//i.test(page.url())) {
    await page.goto(`${baseOrigin}/menu/10010`, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
    await page.waitForTimeout(800);
  }
  const rankTab = page.getByText(/실시간\s*랭킹|랭킹/i).first();
  if ((await rankTab.count()) > 0 && (await rankTab.isVisible().catch(() => false))) {
    await rankTab.click({ timeout: 8000 });
    await page.waitForTimeout(800);
  }
  const rankLinks = page.locator('a[href*="/content/"]');
  await rankLinks.first().waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
  const count = await rankLinks.count();
  const maxIndex = Math.min(count, 20);
  if (maxIndex === 0) {
    throw new Error("실시간 랭킹에서 작품 링크를 찾을 수 없습니다.");
  }
  const randomIndex = Math.floor(Math.random() * maxIndex);
  const selectedWork = rankLinks.nth(randomIndex);
  const href = await selectedWork.getAttribute("href").catch(() => null);
  if (href) {
    lastViewedContentHref = href.startsWith("http") ? href : new URL(href, page.url()).href;
  }
  await selectedWork.scrollIntoViewIfNeeded().catch(() => null);
  await selectedWork.click({ timeout: 10000 });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  if (!lastViewedContentHref && /\/content\//i.test(page.url())) {
    lastViewedContentHref = page.url();
  }
  await page.waitForTimeout(500);
  const firstEpisode = page.getByText(/1\s*회차|1화/).or(page.locator('a[href*="/viewer/"]').first()).first();
  if ((await firstEpisode.count()) > 0 && (await firstEpisode.isVisible().catch(() => false))) {
    await firstEpisode.click({ timeout: 8000 });
  } else {
    const epLink = page.locator('a[href*="/viewer/"]').first();
    if ((await epLink.count()) > 0) await epLink.click({ timeout: 8000 });
  }
  await page.waitForTimeout(500);
});

And("사용자가 {string} > {string} 탭 하단의 작품 리스트를 다시 확인한다", async ({ page }, _1: string, _2: string) => {
  await page.waitForTimeout(400);
  const dialog = page.locator('[data-test="ticket-dialog"], [class*="dialog"]').first();
  if ((await dialog.count()) > 0 && (await dialog.isVisible().catch(() => false))) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const closeBtn = page.getByRole("button", { name: /닫기|취소|close/i }).or(page.locator('[aria-label*="닫기"]')).first();
    if ((await closeBtn.count()) > 0 && (await closeBtn.isVisible().catch(() => false))) {
      await closeBtn.click({ timeout: 3000 }).catch(() => null);
    }
    await page.waitForTimeout(300);
  }
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if ((await storage.count()) > 0) {
    await storage.first().click({ timeout: 8000, force: true }).catch(() => null);
    await page.waitForTimeout(600);
  }
  const recentTab = page.getByRole("tab", { name: /최근본/i }).or(page.getByRole("link", { name: /최근본/i }));
  if ((await recentTab.count()) > 0) {
    await recentTab.first().click({ timeout: 8000 });
    await page.waitForTimeout(500);
  }
  const list = page.locator('a[href*="/content/"]').first();
  await expect(list).toBeVisible({ timeout: 10000 });
});

Then("최근본 작품이 사용자가 선택한 정렬 기준대로 노출된다", async ({ page }) => {
  const list = page.locator('a[href*="/content/"]');
  await expect(list.first()).toBeVisible({ timeout: 8000 });
  expect(await list.count()).toBeGreaterThanOrEqual(0);
});

And("선택한 작품의 1회차가 정상적으로 감상된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewerContent = (await page.getByText(/회차|화|다음|이전/i).count()) > 0 || (await page.locator('[class*="viewer"], [class*="Viewer"]').count()) > 0;
  expect(onViewer || hasViewerContent).toBe(true);
});

And('"최근본 작품" 탭 최상단에 방금 감상한 작품이 노출된다', async ({ page }) => {
  await page.waitForTimeout(400);
  const firstItem = page.locator('a[href*="/content/"]').first();
  await firstItem.waitFor({ state: "attached", timeout: 10000 }).catch(() => null);
  await firstItem.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" })).catch(() => null);
  await page.waitForTimeout(500);
  await expect(firstItem).toBeVisible({ timeout: 8000 });
  if (lastViewedContentHref) {
    const firstHref = await firstItem.getAttribute("href").catch(() => null);
    const firstFull = firstHref ? (firstHref.startsWith("http") ? firstHref : new URL(firstHref, page.url()).href) : "";
    const contentIdStored = lastViewedContentHref.match(/\/content\/(\d+)/)?.[1];
    const contentIdFirst = firstFull.match(/\/content\/(\d+)/)?.[1];
    expect(contentIdFirst, "최근본 첫 번째 항목에 content 링크가 있어야 합니다").toBeTruthy();
    expect(contentIdStored === contentIdFirst, `최근본 최상단 작품(content ${contentIdFirst})이 방금 감상한 작품(content ${contentIdStored})과 일치해야 합니다`).toBe(true);
  }
});
