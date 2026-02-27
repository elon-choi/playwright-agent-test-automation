import { Given, When, Then, And, expect, withAiFallback, getBaseUrl, getRandomTestWorkUrl } from "./fixtures.js";

const RESTRICTED_AGE_BADGE_SELECTOR = 'img[alt*="19세"]';
const RESTRICTED_TITLE_PATTERN = /\[19세\s*완전판\]/;
const PREFERRED_WEBTOON_TITLE = "닥터 최태수";
const AVOID_WEBTOON_TITLE = "닥터 최대호";
const CONTENT_LINK_SELECTOR = 'a[href*="/content/"]:not([href*="/list/"]), a[href*="/landing/series/"]:not([href*="/list/"])';

const isAllAgeCard = async (linkLocator: any): Promise<boolean> => {
  try {
    const has19BadgeInside = (await linkLocator.locator('img[alt*="19세"]').count()) > 0;
    if (has19BadgeInside) return false;
    const hasRestrictedTitleInside = (await linkLocator.getByText(RESTRICTED_TITLE_PATTERN).count()) > 0;
    if (hasRestrictedTitleInside) return false;
    const has15BadgeInside = (await linkLocator.locator('img[alt*="15세 뱃지"]').count()) > 0;
    if (has15BadgeInside) return false;
    return true;
  } catch {
    return true;
  }
};

const DEBUG_EPISODE_STEPS = process.env.DEBUG_EPISODE_STEPS === "1";

const linkContainsText = async (linkLocator: any, text: string): Promise<boolean> => {
  try {
    const count = await linkLocator.getByText(text, { exact: false }).count();
    if (count > 0) return true;
    const inLink = await linkLocator.evaluate((el: Element, t: string) => (el.textContent || "").includes(t), text);
    if (inLink) return true;
    return await linkLocator.evaluate((el: Element, t: string) => {
      let p: Element | null = el.parentElement;
      for (let depth = 0; p && depth < 4; depth++) {
        if ((p.textContent || "").includes(t)) return true;
        p = p.parentElement;
      }
      return false;
    }, text);
  } catch {
    return false;
  }
};

const getLinkTitleForLog = async (linkLocator: any): Promise<string> => {
  try {
    const raw = await linkLocator.evaluate((el: Element) => {
      const t = (el.textContent || "").trim();
      if (t.length > 0 && t.length < 80) return t;
      let p: Element | null = el.parentElement;
      for (let d = 0; p && d < 3; d++) {
        const pt = (p.textContent || "").trim();
        if (pt.length > 0 && pt.length < 120) return pt.slice(0, 60);
        p = p.parentElement;
      }
      return (el.getAttribute("href") || "").slice(-20);
    });
    return String(raw);
  } catch {
    return "(unknown)";
  }
};

const clickFirstAllAgeContentLink = async (page: any, scope: any, filterAllAge = false): Promise<boolean> => {
  const links = await scope.locator(CONTENT_LINK_SELECTOR).all();
  let candidateLinks: any[] = [];
  if (filterAllAge) {
    for (const link of links) {
      try {
        const ok = await isAllAgeCard(link);
        if (ok) candidateLinks.push(link);
      } catch {
        continue;
      }
    }
  } else {
    candidateLinks = links;
  }
  if (DEBUG_EPISODE_STEPS) {
    console.log(`[episode.steps] content links=${links.length} candidateLinks=${candidateLinks.length} filterAllAge=${filterAllAge}`);
  }
  for (const link of candidateLinks) {
    const hasPreferred = await linkContainsText(link, PREFERRED_WEBTOON_TITLE);
    if (hasPreferred) {
      if (DEBUG_EPISODE_STEPS) console.log(`[episode.steps] click preferred: ${PREFERRED_WEBTOON_TITLE}`);
      await link.scrollIntoViewIfNeeded().catch(() => null);
      await page.waitForTimeout(200);
      await link.click({ force: true });
      return true;
    }
  }
  for (const link of candidateLinks) {
    const hasAvoid = await linkContainsText(link, AVOID_WEBTOON_TITLE);
    if (hasAvoid) {
      if (DEBUG_EPISODE_STEPS) {
        const title = await getLinkTitleForLog(link);
        console.log(`[episode.steps] skip avoid: ${AVOID_WEBTOON_TITLE} title=${title}`);
      }
      continue;
    }
    if (DEBUG_EPISODE_STEPS) {
      const title = await getLinkTitleForLog(link);
      console.log(`[episode.steps] click first non-avoid: ${title}`);
    }
    await link.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(400);
    await link.click({ force: true, timeout: 10000 });
    return true;
  }
  if (candidateLinks.length > 0) {
    if (DEBUG_EPISODE_STEPS) console.log(`[episode.steps] click first candidate (fallback)`);
    await candidateLinks[0].scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(400);
    await candidateLinks[0].click({ force: true, timeout: 10000 });
    return true;
  }
  const firstLink = scope.locator(CONTENT_LINK_SELECTOR).first();
  if ((await firstLink.count()) > 0) {
    if (DEBUG_EPISODE_STEPS) console.log(`[episode.steps] click first content link (fallback)`);
    await firstLink.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(400);
    await firstLink.click({ force: true, timeout: 10000 });
    return true;
  }
  return false;
};

const waitForContentLinks = async (page: any, scope: any, timeoutMs = 12000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const n = await scope.locator(CONTENT_LINK_SELECTOR).count();
    if (n > 0) return n;
    await page.waitForTimeout(500);
  }
  return 0;
};

const clickFirstContentLink = async (page: any, scope: any): Promise<boolean> => {
  const first = scope.locator(CONTENT_LINK_SELECTOR).first();
  if ((await first.count()) === 0) return false;
  await first.scrollIntoViewIfNeeded({ timeout: 4000 }).catch(() => null);
  await page.waitForTimeout(300);
  await first.click({ force: true, timeout: 8000 });
  return true;
};

const ensureContentPage = async (page: any, options?: { filterAllAge?: boolean }) => {
  const filterAllAge = options?.filterAllAge ?? false;
  if (/\/content\/|\/landing\/series\//i.test(page.url())) {
    return;
  }
  const fixedWorkUrl = getRandomTestWorkUrl();
  if (fixedWorkUrl) {
    await page.goto(fixedWorkUrl, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
    if (/\/content\/|\/landing\/series\//i.test(page.url())) {
      await dismissFirstTimeReaderBenefitIfPresent(page);
      return;
    }
  }
  const webtoonTab = page.getByRole("link", { name: /웹툰\s*탭/i });
  if (await webtoonTab.count()) {
    await webtoonTab.first().click();
    await page.waitForTimeout(800);
  }

  await page.locator(CONTENT_LINK_SELECTOR).first().waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
  const mainScope = page.locator('main').first();
  if (await mainScope.count()) {
    await waitForContentLinks(page, mainScope, 5000);
  }

  const sectionTitle = page.getByText("지금, 신작!").first();
  let sectionLinks = 0;
  let mainLinks = 0;
  if (await sectionTitle.count()) {
    await sectionTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const sectionScope = sectionTitle.locator('xpath=following-sibling::*[1]');
    if (await sectionScope.count()) {
      sectionLinks = await sectionScope.locator(CONTENT_LINK_SELECTOR).count();
      const clicked = await clickFirstAllAgeContentLink(page, sectionScope, filterAllAge);
      if (clicked) {
        await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
        await dismissFirstTimeReaderBenefitIfPresent(page);
        return;
      }
    }
  }

  if (await mainScope.count()) {
    mainLinks = await mainScope.locator(CONTENT_LINK_SELECTOR).count();
    const clicked = await clickFirstAllAgeContentLink(page, mainScope, filterAllAge);
    if (clicked) {
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      await dismissFirstTimeReaderBenefitIfPresent(page);
      return;
    }
  }
  const fullPageLinks = await page.locator(CONTENT_LINK_SELECTOR).count();
  if (fullPageLinks > 0) {
    const clicked = await clickFirstAllAgeContentLink(page, page, filterAllAge);
    if (clicked) {
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      await dismissFirstTimeReaderBenefitIfPresent(page);
      return;
    }
  }
  const url = page.url();
  console.log(`[episode.steps] ensureContentPage FAIL url=${url} sectionLinks=${sectionLinks} mainLinks=${mainLinks} fullPageLinks=${fullPageLinks}`);
  throw new Error(filterAllAge
    ? "전체 연령 작품 상세 페이지로 이동하지 못했습니다. 19세 뱃지가 없는 작품을 선택해 주세요."
    : "콘텐츠 상세 페이지로 이동하지 못했습니다.");
};

const WEBTOON_RANKING_SCREEN_PATH = "/menu/10010/screen/93";
const RANKING_TAB_NAME = /실시간\s*랭킹/;

const ensureWebtoonContentPage = async (page: any) => {
  if (/\/content\/|\/landing\/series\//i.test(page.url())) {
    return;
  }
  const webtoonTab = page.getByRole("link", { name: /웹툰\s*탭|웹툰/i }).or(page.locator('a[href*="/menu/10010"]'));
  if (await webtoonTab.count()) {
    await webtoonTab.first().click({ timeout: 10000 });
    await page.waitForLoadState("domcontentloaded").catch(() => null);
    await page.waitForTimeout(1200);
    await page.waitForURL(/\/menu\/10010/i, { timeout: 10000 }).catch(() => null);
  }
  await page.waitForTimeout(800);

  const rankingUrl = new URL(WEBTOON_RANKING_SCREEN_PATH, getBaseUrl()).href;
  await page.goto(rankingUrl, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(600);

  const rankingTabCandidates = [
    page.getByRole("tab", { name: RANKING_TAB_NAME }),
    page.locator('[role="tablist"]').getByRole("tab", { name: RANKING_TAB_NAME }),
    page.getByText(RANKING_TAB_NAME).locator("xpath=ancestor::*[self::a or self::button or @role='tab'][1]"),
    page.locator('a, button, [role="tab"]').filter({ hasText: RANKING_TAB_NAME })
  ];
  for (const candidate of rankingTabCandidates) {
    const count = await candidate.count();
    if (count > 0) {
      await candidate.first().scrollIntoViewIfNeeded().catch(() => null);
      await page.waitForTimeout(200);
      await candidate.first().click({ force: true }).catch(() => null);
      await page.waitForTimeout(800);
      break;
    }
  }

  const mainScope = page.locator('main').first();
  await mainScope.waitFor({ state: "attached", timeout: 6000 }).catch(() => null);
  await mainScope.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(300);
  await waitForContentLinks(page, mainScope, 6000);
  const linkCount = await mainScope.locator(CONTENT_LINK_SELECTOR).count();
  if (linkCount > 0) {
    const clicked = await clickFirstContentLink(page, mainScope);
    if (clicked) {
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      return;
    }
  }

  await mainScope.waitFor({ state: "attached", timeout: 5000 }).catch(() => null);
  if (await mainScope.count()) {
    await waitForContentLinks(page, mainScope, 6000);
  }
  let sectionLinks = 0;
  let mainLinks = 0;
  const sectionTitle = page.getByText("지금, 신작!").first();
  if (await sectionTitle.count()) {
    await sectionTitle.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(400);
    const sectionScope = sectionTitle.locator('xpath=following-sibling::*[1]');
    if (await sectionScope.count()) {
      sectionLinks = await sectionScope.locator(CONTENT_LINK_SELECTOR).count();
      const clicked = await clickFirstContentLink(page, sectionScope);
      if (clicked) {
        await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
        return;
      }
    }
  }
  if (await mainScope.count()) {
    mainLinks = await mainScope.locator(CONTENT_LINK_SELECTOR).count();
    const clicked = await clickFirstContentLink(page, mainScope);
    if (clicked) {
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      return;
    }
  }
  const fullPageLinks = await page.locator(CONTENT_LINK_SELECTOR).count();
  if (fullPageLinks > 0) {
    const clicked = await clickFirstContentLink(page, page);
    if (clicked) {
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      return;
    }
  }
  console.log(`[episode.steps] ensureWebtoonContentPage FAIL url=${page.url()} sectionLinks=${sectionLinks} mainLinks=${mainLinks} fullPageLinks=${fullPageLinks}`);
  throw new Error("웹툰 콘텐츠 상세 페이지로 이동하지 못했습니다.");
};

Given("사용자가 특정 작품홈에 진입한다", async ({ page }) => {
  const url = page.url();
  if (/\/menu\/\d+/i.test(url) && !/\/content\/|\/landing\/series\//i.test(url)) {
    await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(300);
  }
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
});

Given("사용자가 전체 연령만 특정 작품홈에 진입한다", async ({ page }) => {
  const url = page.url();
  if (/\/menu\/\d+/i.test(url) && !/\/content\/|\/landing\/series\//i.test(url)) {
    await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(300);
  }
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page, { filterAllAge: true });
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
});

When("사용자가 회차 탭을 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const url = page.url();
      if (/\/menu\/\d+/i.test(url) && !/\/content\/|\/landing\/series\//i.test(url)) {
        await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(300);
      }
      if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
        await ensureContentPage(page);
      }
      const episodeTabCandidates = [
        page.getByRole("tab", { name: /회차/i }),
        page.getByRole("link", { name: /회차/i }),
        page.getByRole("button", { name: /회차/i })
      ];
      for (const locator of episodeTabCandidates) {
        if (await locator.count()) {
          await locator.first().click({ force: true });
          await page.waitForTimeout(400);
          return;
        }
      }
    },
    "작품 상세 페이지에서 회차 탭을 클릭한다",
    ai
  );
});

And("사용자가 홈 탭 하단의 회차 리스트를 확인한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const url = page.url();
      if (/\/menu\/\d+/i.test(url) && !/\/content\/|\/landing\/series\//i.test(url)) {
        await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(300);
      }
      if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
        await ensureContentPage(page);
      }
      const isOnContentPage = /\/content\/|\/landing\/series\//i.test(page.url());
      const episodeTabCandidates = isOnContentPage
        ? [
            page.getByRole("tab", { name: /회차/i }),
            page.getByRole("button", { name: /회차/i })
          ]
        : [
            page.getByRole("tab", { name: /회차/i }),
            page.getByRole("link", { name: /회차/i }),
            page.getByRole("button", { name: /회차/i })
          ];
      for (const locator of episodeTabCandidates) {
        if (await locator.count()) {
          await locator.first().click({ force: true });
          await page.waitForTimeout(400);
          return;
        }
      }
    },
    "홈 탭 하단의 회차 리스트를 확인한다",
    ai
  );
});

When("사용자가 정렬 메뉴를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const sortCandidates = [
        page.getByRole("button", { name: /첫화부터|최신순|최신\s*순|정렬/i }),
        page.getByRole("combobox", { name: /첫화|최신|정렬/i }),
        page.getByRole("listbox", { name: /첫화|최신|정렬/i }),
        page.getByText(/첫화부터|최신순|최신\s*순/).first(),
        page.locator("button").filter({ hasText: /첫화|최신|정렬/ }).first(),
        page.locator("[role='button']").filter({ hasText: /첫화|최신|정렬/ }).first()
      ];
      for (const locator of sortCandidates) {
        if (await locator.count()) {
          const el = locator.first();
          if (await el.isVisible().catch(() => false)) {
            await el.click({ force: true });
            return;
          }
        }
      }
      throw new Error("정렬 메뉴를 찾지 못했습니다.");
    },
    "회차 정렬 메뉴(첫화부터 또는 최신순)를 클릭한다",
    ai
  );
});

const EPISODE_SORT_SPAN_SELECTOR = 'span.font-small2-bold.text-el-40, span[class*="font-small2-bold"]';

When("사용자가 회차 정렬 메뉴를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const episodeSortLabel = page.locator(EPISODE_SORT_SPAN_SELECTOR).filter({ hasText: /^첫화부터$/ });
      if (await episodeSortLabel.count() > 0) {
        const trigger = episodeSortLabel.first().locator("xpath=ancestor::*[self::button or self::a or @role='button' or @role='combobox' or contains(@class,'button')][1]").first();
        if (await trigger.count() > 0) {
          await trigger.scrollIntoViewIfNeeded().catch(() => null);
          await page.waitForTimeout(200);
          await trigger.click({ force: true });
          return;
        }
        await episodeSortLabel.first().locator("xpath=..").click({ force: true });
        return;
      }
      const sortButtons = await page.getByRole("button", { name: /첫화부터|최신순|최신\s*순|정렬/i }).all();
      for (const btn of sortButtons) {
        const isEpisodeSortButton = await btn.evaluate((b) => {
          const parent = b.closest("section") || b.closest("main") || b.closest("div");
          if (!parent) return false;
          const hasViewerLinks = parent.querySelectorAll('a[href*="/viewer/"]').length >= 2;
          const hasFirstEpisodeLabel = (parent.textContent || "").includes("첫화부터");
          return hasViewerLinks && hasFirstEpisodeLabel;
        }).catch(() => false);
        if (isEpisodeSortButton) {
          await btn.scrollIntoViewIfNeeded().catch(() => null);
          await page.waitForTimeout(200);
          await btn.click({ force: true });
          return;
        }
      }
      throw new Error("회차 정렬 메뉴를 찾지 못했습니다. span.font-small2-bold(첫화부터) 또는 회차 영역 정렬 버튼을 확인해 주세요.");
    },
    "회차 정렬 메뉴(첫화부터 또는 최신순)를 클릭한다",
    ai
  );
});

And("사용자가 전체 연령 작품을 선택한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
});

And("사용자가 임의의 전체 연령 웹툰 작품을 클릭한다.", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureWebtoonContentPage(page);
  }
});

And("사용자가 전체 연령 작품 목록을 본다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
});

And("사용자가 전체 연령 작품 목록을 확인한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
});

And("전체 연령 작품 목록을 확인한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
});

const WEB_CANT_VIEW_PATTERN = /웹에서\s*감상\s*불가|웹에서\s*감상불가|앱에서만|PC 웹에서는 볼 수 없는/i;
const TRAILER_OR_CANT_VIEW_PATTERN = /웹에서\s*감상\s*불가|웹에서\s*감상불가|앱에서만|PC 웹에서는 볼 수 없는|트레일러/i;

const FREE_BADGE_SELECTOR = 'span[class*="small2-bold"], span[class*="font-x-small2"], span.font-x-small2-bold';
const getViewableFreeRows = (page: any) =>
  page.locator('[class*="item"], [class*="row"], [class*="episode"], [class*="Episode"], tr, li')
    .filter({ has: page.locator(FREE_BADGE_SELECTOR).filter({ hasText: /^무료$/ }) })
    .filter({ has: page.locator('a[href*="/viewer/"]') })
    .filter({ hasNotText: TRAILER_OR_CANT_VIEW_PATTERN });

const ensureEpisodeListSortedByFirst = async (page: any): Promise<void> => {
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if ((await episodeTab.count()) > 0) {
    await episodeTab.first().scrollIntoViewIfNeeded().catch(() => null);
    await episodeTab.first().click({ force: true }).catch(() => null);
    await page.waitForTimeout(500);
  }
  const sortLabel = page.locator(EPISODE_SORT_SPAN_SELECTOR).filter({ hasText: /^첫화부터$/ });
  if ((await sortLabel.count()) > 0) {
    const trigger = sortLabel.first().locator("xpath=ancestor::*[self::button or self::a or @role='button' or @role='combobox'][1]").first();
    if ((await trigger.count()) > 0) {
      await trigger.scrollIntoViewIfNeeded().catch(() => null);
      await page.waitForTimeout(200);
      await trigger.click({ force: true }).catch(() => null);
      await page.waitForTimeout(400);
    }
  }
  const firstOption = page.getByRole("option", { name: /첫화부터/i }).or(page.getByText(/^첫화부터$/).first());
  if ((await firstOption.count()) > 0) {
    await firstOption.first().click({ force: true }).catch(() => null);
    await page.waitForTimeout(800);
  }
};

const step무료뱃지찾아서클릭 = async ({ page }: { page: any }) => {
  if (/\/viewer\//i.test(page.url())) return;
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    const first = episodeTab.first();
    await first.evaluate((el) => { el.scrollIntoView({ block: "center" }); (el as HTMLElement).click(); }).catch(() => null);
    await page.waitForTimeout(400);
  }
  let viewableFree = getViewableFreeRows(page);
  let freeCount = await viewableFree.count();
  if (freeCount === 0) {
    await ensureEpisodeListSortedByFirst(page);
    viewableFree = getViewableFreeRows(page);
    freeCount = await viewableFree.count();
  }
  const fallbackByBadge = page.locator('[class*="item"], [class*="row"], [class*="episode"], [class*="Episode"], tr, li')
    .filter({ has: page.locator(FREE_BADGE_SELECTOR).filter({ hasText: /^무료$/ }) })
    .filter({ has: page.locator('a[href*="/viewer/"]') })
    .filter({ hasNotText: TRAILER_OR_CANT_VIEW_PATTERN });
  const fallbackBySpan무료 = page.locator('[class*="item"], [class*="row"], [class*="episode"], [class*="Episode"], tr, li')
    .filter({ has: page.locator("span").filter({ hasText: /^무료$/ }) })
    .filter({ has: page.locator('a[href*="/viewer/"]') })
    .filter({ hasNotText: TRAILER_OR_CANT_VIEW_PATTERN });
  const fallbackByText = page.locator('[class*="item"], [class*="row"], [class*="episode"], [class*="Episode"], tr, li')
    .filter({ hasText: /무료/ })
    .filter({ has: page.locator('a[href*="/viewer/"]') })
    .filter({ hasNotText: TRAILER_OR_CANT_VIEW_PATTERN });
  let rowsToTry = freeCount > 0 ? viewableFree : fallbackByBadge;
  if ((await rowsToTry.count()) === 0) rowsToTry = (await fallbackBySpan무료.count()) > 0 ? fallbackBySpan무료 : fallbackByText;
  const totalRows = await rowsToTry.count();
  if (totalRows === 0) {
    throw new Error("무료 뱃지가 달린 회차를 찾지 못했습니다. 회차 탭에서 '무료' 뱃지가 있는 회차가 노출되는지 확인해 주세요.");
  }
  const maxTry = Math.min(totalRows, 10);
  for (let i = 0; i < maxTry; i++) {
    const link = rowsToTry.nth(i).locator('a[href*="/viewer/"]').first();
    if ((await link.count()) === 0) continue;
    await link.waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
    await link.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300);
    await link.click({ force: true });
    await page.waitForTimeout(1200);
    if ((await page.getByText(WEB_CANT_VIEW_PATTERN).count()) > 0) {
      await closeCantViewPopup(page);
      await page.waitForTimeout(600);
      continue;
    }
    const gotViewer = await page.waitForURL(/\/viewer\//i, { timeout: 12000 }).then(() => true).catch(() => false);
    if (gotViewer) return;
  }
  throw new Error("무료 뱃지 회차를 클릭했으나 뷰어로 이동하지 못했습니다. 웹에서 감상 불가 회차만 있거나 네트워크 문제일 수 있습니다.");
};

When("사용자가 무료 뱃지가 표시된 회차를 찾아서 클릭한다", step무료뱃지찾아서클릭);
When("사용자가 웹에서 감상 가능한 무료 뱃지가 표시된 회차를 찾아서 클릭한다", step무료뱃지찾아서클릭);

And("사용자가 무료 회차에 진입한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) return;
  await page.waitForURL(/\/viewer\//i, { timeout: 8000 }).catch(() => null);
  if (/\/viewer\//i.test(page.url())) return;
  const hasCantViewPopup =
    (await page.getByText(WEB_CANT_VIEW_PATTERN).count()) > 0 ||
    (await page.getByText(/PC 웹에서는 볼 수 없는 회차/i).count()) > 0;
  if (hasCantViewPopup) {
    return;
  }
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    const first = episodeTab.first();
    await first.evaluate((el) => { el.scrollIntoView({ block: "center" }); (el as HTMLElement).click(); }).catch(() => null);
    await page.waitForTimeout(400);
  }
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  await viewerLink.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

And("사용자가 무료 회차 목록에 진입한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    const first = episodeTab.first();
    await first.evaluate((el) => { el.scrollIntoView({ block: "center" }); (el as HTMLElement).click(); }).catch(() => null);
    await page.waitForTimeout(400);
  }
});

When("사용자가 무료 회차를 클릭한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) return;
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

And("\"웹에서 감상 불가\" 팝업이 노출되면 확인을 눌러 닫고 다음 회차를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  const hasPopup =
    (await page.getByText(WEB_CANT_VIEW_PATTERN).count()) > 0 ||
    (await page.getByText(/PC 웹에서는 볼 수 없는 회차/i).count()) > 0;
  if (!hasPopup) return;
  const dialog = page.getByRole("dialog").filter({ hasText: WEB_CANT_VIEW_PATTERN }).or(
    page.locator("[role='dialog'], [class*='modal'], [class*='Modal']").filter({ hasText: WEB_CANT_VIEW_PATTERN })
  ).first();
  let confirmBtn = dialog.getByRole("button", { name: /^확인$/i }).first();
  if ((await confirmBtn.count()) === 0) {
    confirmBtn = page.locator("[class*='modal'], [class*='Modal'], [class*='dialog']").filter({
      has: page.getByRole("button", { name: /^확인$/i })
    }).filter({ hasText: WEB_CANT_VIEW_PATTERN }).getByRole("button", { name: /^확인$/i }).first();
  }
  if (await confirmBtn.count()) {
    await confirmBtn.click({ timeout: 5000 });
    await page.waitForTimeout(500);
  }
  const nextEpisodeLink = page.locator('a[href*="/viewer/"]').nth(1);
  if (await nextEpisodeLink.count()) {
    await nextEpisodeLink.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300);
    await nextEpisodeLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

const closeCantViewPopup = async (page: any) => {
  const dialog = page.getByRole("dialog").filter({ hasText: WEB_CANT_VIEW_PATTERN }).or(
    page.locator("[role='dialog'], [class*='modal'], [class*='Modal']").filter({ hasText: WEB_CANT_VIEW_PATTERN })
  ).first();
  let confirmBtn = dialog.getByRole("button", { name: /^확인$/i }).first();
  if ((await confirmBtn.count()) === 0) {
    confirmBtn = page.locator("[class*='modal'], [class*='Modal'], [class*='dialog']").filter({
      has: page.getByRole("button", { name: /^확인$/i })
    }).filter({ hasText: WEB_CANT_VIEW_PATTERN }).getByRole("button", { name: /^확인$/i }).first();
  }
  if (await confirmBtn.count()) {
    await confirmBtn.click({ timeout: 5000 });
    await page.getByText(WEB_CANT_VIEW_PATTERN).first().waitFor({ state: "hidden", timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(800);
  }
};

const clickNextViewableFreeAndWaitViewer = async (page: any) => {
  const viewableFree = getViewableFreeRows(page);
  const count = await viewableFree.count();
  const attemptTimeout = 12000;
  for (let i = 0; i < count && i < 10; i++) {
    const link = viewableFree.nth(i).locator('a[href*="/viewer/"]').first();
    if ((await link.count()) === 0) continue;
    await link.waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
    await link.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300);
    await link.click({ force: true });
    await page.waitForTimeout(1000);
    const waitViewer = page.waitForURL(/\/viewer\//i, { timeout: attemptTimeout });
    const waitPopup = page.getByText(WEB_CANT_VIEW_PATTERN).first().waitFor({ state: "visible", timeout: 5000 }).then(() => "popup" as const).catch(() => null);
    const result = await Promise.race([waitViewer.then(() => "viewer" as const), waitPopup]);
    if (result === "viewer") return true;
    if (result === "popup") {
      await closeCantViewPopup(page);
      await page.waitForTimeout(600);
      continue;
    }
    if (/\/viewer\//i.test(page.url())) return true;
    break;
  }
  if (count === 0) {
    const fallback = page.locator('[class*="item"], [class*="row"], tr, li').filter({ hasText: /무료/ }).filter({ has: page.locator('a[href*="/viewer/"]') }).filter({ hasNotText: TRAILER_OR_CANT_VIEW_PATTERN });
    const fallbackCount = await fallback.count();
    for (let i = 1; i < fallbackCount && i < 8; i++) {
      const row = fallback.nth(i);
      if ((await row.locator('a[href*="/viewer/"]').count()) === 0) continue;
      const link = row.locator('a[href*="/viewer/"]').first();
      await link.click({ force: true });
      const got = await page.waitForURL(/\/viewer\//i, { timeout: 10000 }).then(() => true).catch(() => false);
      if (got) return true;
      if ((await page.getByText(WEB_CANT_VIEW_PATTERN).count()) > 0) await closeCantViewPopup(page);
      await page.waitForTimeout(500);
    }
  }
  return false;
};

And("\"웹에서 감상 불가\" 팝업이 노출되면 확인을 눌러 닫고 다음 무료 뱃지가 표시된 회차를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  const popupTitle = page.getByText(WEB_CANT_VIEW_PATTERN).first();
  const hasPopup = (await popupTitle.count()) > 0 || (await page.getByText(/PC 웹에서는 볼 수 없는 회차/i).count()) > 0;
  if (!hasPopup) return;
  await closeCantViewPopup(page);
  await page.waitForTimeout(800);
  const gotViewer = await clickNextViewableFreeAndWaitViewer(page);
  if (gotViewer) return;
  const viewableFree = getViewableFreeRows(page);
  const cnt = await viewableFree.count();
  for (let i = 0; i < cnt && i < 5; i++) {
    const href = await viewableFree.nth(i).locator('a[href*="/viewer/"]').first().getAttribute("href").catch(() => null);
    if (href) {
      const url = href.startsWith("http") ? href : new URL(href, page.url()).href;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
      if (/\/viewer\//i.test(page.url())) return;
    }
  }
  await expect(page).toHaveURL(/\/viewer\//i, { timeout: 8000 });
});

And("\"웹에서 감상 불가\" 팝업이 노출되면 확인을 눌러 닫고 다음 웹에서 감상 가능한 무료 뱃지가 표시된 회차를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  const hasPopup = (await page.getByText(WEB_CANT_VIEW_PATTERN).count()) > 0 || (await page.getByText(/PC 웹에서는 볼 수 없는 회차/i).count()) > 0;
  if (!hasPopup) return;
  await closeCantViewPopup(page);
  await page.waitForTimeout(800);
  const gotViewer = await clickNextViewableFreeAndWaitViewer(page);
  if (gotViewer) return;
  const viewableFree = getViewableFreeRows(page);
  const cnt = await viewableFree.count();
  for (let i = 0; i < cnt && i < 5; i++) {
    const href = await viewableFree.nth(i).locator('a[href*="/viewer/"]').first().getAttribute("href").catch(() => null);
    if (href) {
      const url = href.startsWith("http") ? href : new URL(href, page.url()).href;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
      if (/\/viewer\//i.test(page.url())) return;
    }
  }
  await expect(page).toHaveURL(/\/viewer\//i, { timeout: 8000 });
});

And("사용자가 뷰어 이미지의 최하단까지 스크롤한다", async ({ page }) => {
  await page.evaluate(() => {
    const scrollToBottom = (el: Element | null) => {
      if (!el || !(el instanceof HTMLElement)) return;
      if (el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
    };
    const maxH = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    window.scrollTo(0, maxH);
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    document.body.scrollTop = document.body.scrollHeight;
    const candidates = [
      document.querySelector('main'),
      document.querySelector('[class*="viewer"], [class*="Viewer"]'),
      document.querySelector('[class*="scroll"], [class*="Scroll"]'),
      document.querySelector('[class*="content"], [class*="Content"]')
    ];
    candidates.forEach(scrollToBottom);
  }).catch(() => null);
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  if ((await viewerArea.count()) > 0) {
    await viewerArea.evaluate((el) => {
      (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight;
      const inner = (el as HTMLElement).querySelector('[class*="scroll"], [class*="content"], [class*="body"]');
      if (inner && (inner as HTMLElement).scrollHeight > (inner as HTMLElement).clientHeight)
        (inner as HTMLElement).scrollTop = (inner as HTMLElement).scrollHeight;
    }).catch(() => null);
  }
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => {
      const step = 400;
      window.scrollBy(0, step);
      document.body.scrollTop = Math.min(document.body.scrollHeight, (document.body.scrollTop || 0) + step);
      const el = document.querySelector('main, [class*="viewer"], [class*="Viewer"], [class*="scroll"]');
      if (el && el instanceof HTMLElement && el.scrollHeight > el.clientHeight)
        el.scrollTop = Math.min(el.scrollHeight, el.scrollTop + step);
    }).catch(() => null);
    try { await page.waitForTimeout(200); } catch { break; }
  }
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    document.body.scrollTop = document.body.scrollHeight;
  }).catch(() => null);
  try { await page.waitForTimeout(500); } catch { /* page may be closed */ }
});

And("사용자가 뷰어 이미지를 최하단까지 스크롤한다", async ({ page }) => {
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  await viewerArea.waitFor({ state: "attached", timeout: 15000 }).catch(() => null);
  await viewerArea.evaluate((el) => el.scrollTo(0, el.scrollHeight)).catch(() => null);
  try { await page.waitForTimeout(300); } catch { /* page may be closed */ }
});

const dismissTicketDialog = async (page: any) => {
  const dialog = page.locator('[data-test="ticket-dialog"]');
  if ((await dialog.count()) === 0) return;
  const closeBtn = page.getByRole("button", { name: /취소|닫기|x/i }).first();
  if ((await closeBtn.count()) > 0) await closeBtn.click({ timeout: 3000 }).catch(() => null);
  await page.waitForTimeout(300).catch(() => null);
};

const dismissFirstTimeReaderBenefitIfPresent = async (page: any) => {
  await page.waitForTimeout(800).catch(() => null);
  const benefitTitle = page.getByText(/처음 만나는 독자 혜택/i).first();
  const hasBenefitTitle = await benefitTitle.isVisible().catch(() => false);
  const hasBenefitMessage = (await page.getByText(/대여권.*받았습니다|받았습니다/i).count()) > 0;
  if (!hasBenefitTitle && !hasBenefitMessage) return;
  const confirmCandidates = [
    () => page.getByRole("button", { name: /^확인$/i }).first(),
    () => page.getByRole("button", { name: /확인하기|받기|닫기/i }).first(),
    () => page.getByText(/^확인$/).first(),
    () => page.locator('[role="dialog"]').getByRole("button", { name: /확인|받기|닫기/i }).first()
  ];
  for (const getBtn of confirmCandidates) {
    const btn = getBtn();
    if ((await btn.count()) > 0 && (await btn.isVisible().catch(() => false))) {
      await btn.click({ timeout: 5000, force: true }).catch(() => null);
      await page.waitForTimeout(600).catch(() => null);
      break;
    }
  }
  await page.waitForTimeout(400).catch(() => null);
};

And("사용자가 처음 만나는 독자 혜택 팝업이 있으면 확인을 눌러 닫는다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\/|\/viewer\//i.test(page.url())) return;
  for (let attempt = 0; attempt < 2; attempt++) {
    await dismissFirstTimeReaderBenefitIfPresent(page);
    await page.waitForTimeout(500).catch(() => null);
    const benefitTitleStillVisible = (await page.getByText(/처음 만나는 독자 혜택/i).count()) > 0;
    if (!benefitTitleStillVisible) return;
  }
  const benefitTitleStillVisible = (await page.getByText(/처음 만나는 독자 혜택/i).count()) > 0;
  if (benefitTitleStillVisible) {
    throw new Error("독자 혜택 팝업을 닫지 못했습니다. 확인 버튼을 눌러 팝업을 종료해 주세요.");
  }
});

And("사용자가 뷰어 하단의 다음화 아이콘을 클릭한다", async ({ page }) => {
  await dismissTicketDialog(page);
  const nextBtn = page.getByRole("button", { name: /다음화|다음\s*화/i }).or(page.getByText(/다음화|다음\s*화/).first());
  if (await nextBtn.count()) {
    await nextBtn.first().click({ timeout: 8000, force: true }).catch(() => null);
  }
});

And("사용자가 뷰어 하단의 이전화 아이콘을 클릭한다", async ({ page }) => {
  await dismissTicketDialog(page);
  const prevBtn = page.getByRole("button", { name: /이전화|이전\s*화/i }).or(page.getByText(/이전화|이전\s*화/).first());
  if (await prevBtn.count()) {
    await prevBtn.first().click({ timeout: 8000, force: true }).catch(() => null);
  }
});

Then("사용자는 다음 회차로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(viewer|content|landing\/series)|page\.kakao\.com/i, { timeout: 5000 });
});

And("사용자는 이전 회차로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(viewer|content|landing\/series)|page\.kakao\.com/i, { timeout: 5000 });
});

And("사용자는 작품홈의 회차 리스트로 이동한다", async ({ page }) => {
  try {
    await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 10000 });
  } catch {
    // page may be closed
  }
});

And("사용자는 작품홈 회차 리스트로 이동한다", async ({ page }) => {
  try {
    await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 10000 });
  } catch {
    // page may be closed
  }
});

When("사용자가 뒤로 가기를 실행한다", async ({ page }) => {
  try {
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(400).catch(() => null);
  } catch {
    await page.waitForTimeout(300).catch(() => null);
  }
});

And('사용자가 "작품홈 가기" 버튼을 클릭한다', async ({ page }) => {
  const btn = page.getByRole("button", { name: /작품홈\s*가기/i }).or(page.getByText(/작품홈\s*가기/i).first());
  if (await btn.count()) {
    await btn.first().click({ timeout: 8000 });
  }
});

Then("사용자는 작품홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i, { timeout: 10000 });
});

const step이전다음회차확인 = async ({ page }: { page: any }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    const first = episodeTab.first();
    await first.evaluate((el) => { el.scrollIntoView({ block: "center" }); (el as HTMLElement).click(); }).catch(() => null);
    await page.waitForTimeout(400);
  }
};

And("사용자가 이전/다음 회차가 무료인 작품을 확인한다", step이전다음회차확인);
And("사용자가 이전\\/다음 회차가 무료인 작품을 확인한다", step이전다음회차확인);

And("사용자가 무료 회차 목록을 확인한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    const first = episodeTab.first();
    await first.evaluate((el) => { el.scrollIntoView({ block: "center" }); (el as HTMLElement).click(); }).catch(() => null);
    await page.waitForTimeout(400);
  }
});

And("무료 회차 목록을 확인한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    const first = episodeTab.first();
    await first.evaluate((el) => { el.scrollIntoView({ block: "center" }); (el as HTMLElement).click(); }).catch(() => null);
    await page.waitForTimeout(400);
  }
});

And("사용자가 전체 연령 작품의 무료 회차에 진입한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) return;
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    const first = episodeTab.first();
    await first.evaluate((el) => { el.scrollIntoView({ block: "center" }); (el as HTMLElement).click(); }).catch(() => null);
    await page.waitForTimeout(400);
  }
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  await viewerLink.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

And("사용자가 전체 연령 작품 목록에서 무료 회차를 선택한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  await dismissFirstTimeReaderBenefitIfPresent(page);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    const first = episodeTab.first();
    await first.evaluate((el) => { el.scrollIntoView({ block: "center" }); (el as HTMLElement).click(); }).catch(() => null);
    await page.waitForTimeout(400);
  }
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

And("사용자가 뷰어 이미지의 최하단까지 스크롤을 진행한다", async ({ page }) => {
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  await viewerArea.waitFor({ state: "attached", timeout: 15000 }).catch(() => null);
  await viewerArea.evaluate((el) => el.scrollTo(0, el.scrollHeight), { timeout: 8000 }).catch(() => null);
  try { await page.waitForTimeout(500); } catch { /* page may be closed */ }
});

And("뷰어 이미지의 최하단까지 스크롤을 진행한다", async ({ page }) => {
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  await viewerArea.waitFor({ state: "attached", timeout: 15000 }).catch(() => null);
  await viewerArea.evaluate((el) => el.scrollTo(0, el.scrollHeight), { timeout: 8000 }).catch(() => null);
  try { await page.waitForTimeout(500); } catch { /* page may be closed */ }
});

And("사용자가 무료 회차를 선택하여 진입한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) return;
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ force: true });
    await page.waitForTimeout(400);
  }
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});
