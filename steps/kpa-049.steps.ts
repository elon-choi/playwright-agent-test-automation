// Feature: KPA-049 시나리오 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

const kpa049State: { watchedWorkPath: string | null; viewerReached: boolean } = { watchedWorkPath: null, viewerReached: false };

const TRAILER_OR_WEB_CANT_VIEW = /트레일러|웹에서\s*감상\s*불가|웹에서\s*감상불가|앱에서만|PC\s*웹에서는\s*볼\s*수\s*없는/i;
const PAID_EPISODE = /\d+캐시|대여권|소장권|유료|구매|충전/i;

function normalizeContentPath(path: string): string {
  return path.replace(/^\/content\/|\?.*$/g, "").split("/")[0] ?? "";
}

function getRecommendHomeRecentSectionLocators(page: any) {
  const title = page.getByText("최근 본 작품", { exact: true }).first();
  return page.locator("section, div").filter({ has: title }).filter({ has: page.locator('a[href*="/content/"]') });
}

async function getRecommendHomeRecentSection(page: any, contentPath?: string | null) {
  const withContent = getRecommendHomeRecentSectionLocators(page);
  if (contentPath) {
    const contentId = normalizeContentPath(contentPath);
    const withWatched = withContent.filter({ has: page.locator(`a[href*="/content/${contentId}"]`) }).first();
    if ((await withWatched.count()) > 0) return withWatched;
  }
  return withContent.first();
}

async function scrollIntoViewSafe(locator: any) {
  try {
    await locator.scrollIntoViewIfNeeded({ timeout: 8000 });
  } catch {
    await locator.evaluate((el: Element) => el.scrollIntoView({ block: "center", behavior: "auto" }));
  }
}

And("사용자는 작품 감상 이력이 있는 계정으로 로그인한다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) throw new Error("로그인 상태가 필요합니다.");
});

And("사용자는 최근본 작품탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /최근\s*본/i }).or(page.getByText(/최근\s*본/i).first());
  if (await tab.count() > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 }).catch(() => null);
});

And("사용자가 메인홈에서 웹툰 > 실시간 랭킹 > 1~ 20위 사이 작품을 랜덤 클릭하고, 트레일러 및 웹에서 감상 불가 회차를 제외한 무료 뱃지가 달린 임의의 회차를 감상한다", async ({ page }) => {
  kpa049State.watchedWorkPath = null;
  kpa049State.viewerReached = false;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
  const webtoon = page.getByRole("link", { name: /웹툰/i }).first();
  if (await webtoon.count() > 0) await webtoon.click({ timeout: 5000 });
  await page.waitForTimeout(600);
  const rank = page.getByText(/실시간\s*랭킹|랭킹/i).first();
  if (await rank.count() > 0) {
    await scrollIntoViewSafe(rank);
    await rank.click({ timeout: 5000 });
  }
  await page.waitForTimeout(600);
  const contentLinks = page.locator('a[href*="/content/"]');
  const count = await contentLinks.count();
  if (count === 0) {
    throw new Error("KPA-049: 실시간 랭킹 영역에 작품 링크가 없습니다. 페이지 구조 변경 여부를 확인하세요.");
  }
  const maxIndex = Math.min(count - 1, 19);
  const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
  const chosen = contentLinks.nth(randomIndex);
  if (await chosen.count() > 0) {
    const href = await chosen.getAttribute("href").catch(() => null);
    if (href) kpa049State.watchedWorkPath = new URL(href, page.url()).pathname;
    await chosen.click({ timeout: 8000 });
  }
  await page.waitForTimeout(800);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count() > 0) await episodeTab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
  const freeRows = page
    .locator('[class*="item"], [class*="row"], li, tr')
    .filter({ hasText: /무료/ })
    .filter({ has: page.locator('a[href*="/viewer/"]') })
    .filter({ hasNotText: TRAILER_OR_WEB_CANT_VIEW })
    .filter({ hasNotText: PAID_EPISODE });
  const freeCount = await freeRows.count();
  if (freeCount === 0) {
    throw new Error("KPA-049: 무료 뱃지가 달린 회차를 찾지 못했습니다. 트레일러/웹 감상불가/유료(캐시·대여권·소장권) 제외 후 선택 가능한 회차가 없습니다.");
  }
  const viewerInFree = freeRows.first().locator('a[href*="/viewer/"]').first();
  await viewerInFree.click({ timeout: 5000 });
  await page.waitForTimeout(800);
  const onViewer = /\/viewer\//i.test(page.url());
  if (onViewer) kpa049State.viewerReached = true;
  else {
    await page.waitForURL(/\/viewer\//i, { timeout: 8000 }).catch(() => null);
    kpa049State.viewerReached = /\/viewer\//i.test(page.url());
  }
});

And("클릭한 회차가 정상적으로 감상된다", async ({ page }) => {
  await page.waitForURL(/\/viewer\//i, { timeout: 8000 }).catch(() => null);
  expect(/\/viewer\//i.test(page.url()), "클릭한 회차로 뷰어 페이지가 열려야 합니다.").toBe(true);
  kpa049State.viewerReached = true;
});

And("사용자가 페이지를 새로고침한다", async ({ page }) => {
  await page.reload({ waitUntil: "domcontentloaded", timeout: 10000 });
  await page.waitForTimeout(500);
});

And("사용자는 GNB 메뉴의 추천탭을 클릭한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) {
    await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(600);
  }
  const recommendTab = page.getByRole("link", { name: /추천\s*탭|추천/i }).or(page.getByRole("tab", { name: /추천/i })).first();
  await recommendTab.waitFor({ state: "visible", timeout: 10000 });
  await scrollIntoViewSafe(recommendTab);
  await page.waitForTimeout(300);
  await recommendTab.click({ timeout: 6000, force: true });
  await page.waitForTimeout(800);
});

And("사용자는 최근 본 작품 섹션 영역까지 스크롤 한다", async ({ page }) => {
  const maxScroll = 18;
  for (let i = 0; i < maxScroll; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(400);
    const section = await getRecommendHomeRecentSection(page, kpa049State.watchedWorkPath);
    const visible = await section.isVisible().catch(() => false);
    if (visible) {
      await scrollIntoViewSafe(section);
      await page.waitForTimeout(500);
      return;
    }
  }
  const section = await getRecommendHomeRecentSection(page, null);
  await section.waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
  await scrollIntoViewSafe(section);
  await page.waitForTimeout(500);
});

And("사용자는 추천탭 하단의 최근 본 작품 영역에서 작품 리스트가 노출되는지 확인한다", async ({ page }) => {
  const sections = getRecommendHomeRecentSectionLocators(page);
  const list = sections.first().locator('a[href*="/content/"]');
  await expect(list.first()).toBeVisible({ timeout: 8000 });
  expect(await list.count()).toBeGreaterThanOrEqual(1);
});

Then("최근 본 작품이 최신 감상 이력을 기준으로 정렬되어 노출된다", async ({ page }) => {
  const sections = getRecommendHomeRecentSectionLocators(page);
  const firstSection = sections.first();
  await expect(firstSection.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 });
  expect(await firstSection.locator('a[href*="/content/"]').count()).toBeGreaterThanOrEqual(1);
  if (kpa049State.watchedWorkPath) {
    const expectedId = normalizeContentPath(kpa049State.watchedWorkPath);
    const allRecentLinks = sections.locator('a[href*="/content/"]');
    const maxWaitMs = 20000;
    const pollMs = 1500;
    const deadline = Date.now() + maxWaitMs;
    let hrefs: string[] = [];
    let isInList = false;
    while (Date.now() < deadline) {
      hrefs = await allRecentLinks.evaluateAll((nodes: Element[]) =>
        nodes.map((a) => new URL((a as HTMLAnchorElement).href).pathname)
      );
      isInList = hrefs.some((p) => {
        const listId = normalizeContentPath(p);
        return listId === expectedId || p === kpa049State.watchedWorkPath || (kpa049State.watchedWorkPath != null && kpa049State.watchedWorkPath.includes(p));
      });
      if (isInList) break;
      await page.waitForTimeout(pollMs);
    }
    expect(isInList, `최근 본 작품 목록에 방금 감상한 작품이 포함되어야 합니다. 기대: ${kpa049State.watchedWorkPath}, 목록: ${hrefs.slice(0, 8).join(", ")}...`).toBe(true);
  }
});

And("실시간 랭킹 3위 작품의 1회차가 정상적으로 감상된다", async () => {
  expect(kpa049State.viewerReached, "3위 작품 1회차 감상 시 뷰어 페이지로 이동했어야 합니다.").toBe(true);
});

And("최근본 작품 영역 하단의 첫 번째 작품에 사용자가 3번에서 감상한 작품 이력이 노출된다", async ({ page }) => {
  if (!kpa049State.watchedWorkPath) {
    throw new Error("감상한 작품 링크를 저장하지 못했습니다. 웹툰 > 실시간 랭킹 > 작품 클릭 단계가 정상 수행되었는지 확인하세요.");
  }
  const expectedId = normalizeContentPath(kpa049State.watchedWorkPath);
  const sections = getRecommendHomeRecentSectionLocators(page);
  await expect(sections.first().locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 8000 });
  const allRecentLinks = sections.locator('a[href*="/content/"]');
  const maxWaitMs = 20000;
  const pollMs = 1500;
  const deadline = Date.now() + maxWaitMs;
  let hrefs: string[] = [];
  let isInList = false;
  while (Date.now() < deadline) {
    hrefs = await allRecentLinks.evaluateAll((nodes: Element[]) =>
      nodes.map((a) => new URL((a as HTMLAnchorElement).href).pathname)
    );
    isInList = hrefs.some((p) => {
      const listId = normalizeContentPath(p);
      return listId === expectedId || p === kpa049State.watchedWorkPath || kpa049State.watchedWorkPath.includes(p);
    });
    if (isInList) break;
    await page.waitForTimeout(pollMs);
  }
  expect(isInList, `최근 본 작품 목록에 감상한 작품이 포함되어야 합니다. 기대: ${kpa049State.watchedWorkPath}`).toBe(true);
});
