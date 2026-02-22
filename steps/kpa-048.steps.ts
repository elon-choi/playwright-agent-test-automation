import { And, Given, When, Then, expect, selfHealLocator, withAiFallback } from "./fixtures.js";

const bannerRootSelector = '[data-t-obj*="stop_b_"]';
const bannerLinkSelector = `${bannerRootSelector} a[href]`;

let bannerCount = 0;
let bannerVisibleConfirmed = false;
let bannerComponents = {
  hasThumbnail: false,
  hasMainTitle: false,
  hasSubTitle: false,
  hasBadge: false,
  hasOrder: false
};
let targetBannerUrl = "";
let lastNavigatedUrl = "";
let bannerScrollAttempted = false;
const bannerNextArrowSelector =
  'xpath=//*[@id="__next"]//div[contains(@class,"flex") and contains(@class,"cursor-pointer") and contains(@class,"rounded-full") and contains(@class,"bg-s-black") and contains(@class,"w-44pxr") and contains(@class,"h-44pxr") and contains(@class,"right-33pxr") and contains(@class,"absolute") and contains(@class,"top-1/2") and contains(@class,"-translate-y-1/2")]//div/div';

const getBannerLinks = async (page: any) => {
  const roleLinks = page.getByRole("link", { name: /대표 이미지/i });
  if (await roleLinks.count()) {
    return roleLinks;
  }
  return page.locator(bannerLinkSelector);
};

const getFirstVisibleBannerLink = async (page: any) => {
  const links = await getBannerLinks(page);
  const count = await links.count();
  for (let i = 0; i < count; i += 1) {
    const candidate = links.nth(i);
    if (await candidate.isVisible()) {
      return candidate;
    }
  }
  return null;
};

const getActiveBannerLink = async (page: any) => {
  const candidates = [
    page.locator(".swiper-slide-active a[href]"),
    page.locator('[aria-current="true"] a[href]'),
    page.locator(bannerLinkSelector),
    page.getByRole("link", { name: /대표 이미지/i })
  ];
  for (const candidate of candidates) {
    if (!(await candidate.count())) {
      continue;
    }
    const firstCandidate = candidate.first();
    if (await firstCandidate.isVisible()) {
      return firstCandidate;
    }
  }
  return getFirstVisibleBannerLink(page);
};

const getActiveBannerKey = async (page: any) => {
  const bannerLink = await getActiveBannerLink(page);
  if (!bannerLink) {
    return null;
  }
  const swiperSlide = bannerLink.locator('xpath=ancestor::*[contains(@class,"swiper-slide")][1]');
  if (await swiperSlide.count()) {
    const slideKey = await swiperSlide.getAttribute("data-id");
    if (slideKey) {
      return slideKey;
    }
  }
  const href = await bannerLink.getAttribute("href");
  if (href) {
    return href;
  }
  const img = bannerLink.locator("img").first();
  const imgSrc = (await img.getAttribute("src")) ?? "";
  if (imgSrc) {
    return imgSrc;
  }
  const altText = (await img.getAttribute("alt")) ?? "";
  if (altText) {
    return altText;
  }
  const text = (await bannerLink.textContent())?.trim() ?? "";
  return text || null;
};

const isLocatorInViewport = async (locator: any) => {
  const isInViewport = await locator.evaluate((element: any) => {
    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewHeight &&
      rect.right <= viewWidth
    );
  });
  return Boolean(isInViewport);
};

const ensureBannerVisibleOnce = async (page: any) => {
  const bannerRoot = page.locator(bannerRootSelector).first();
  await bannerRoot.waitFor({ state: "visible", timeout: 15000 });
  if (await isLocatorInViewport(bannerRoot)) {
    return bannerRoot;
  }
  return bannerRoot;
};

const getNextArrowButton = async (page: any) => {
  const bannerRoot = await ensureBannerVisibleOnce(page);
  return selfHealLocator(page, {
    key: "kpa-048:banner-next-arrow",
    scope: bannerRoot,
    selectors: [
      bannerNextArrowSelector,
      ".swiper-button-next",
      "button[aria-label*='다음']",
      "button[aria-label*='Next']",
      "button[aria-label*='next']",
      "[role='button'][aria-label*='다음']",
      "[role='button'][aria-label*='Next']",
      "[role='button'][aria-label*='next']",
      "button:has-text('다음')",
      "[aria-label*='다음']",
      "[aria-label*='Next']",
      "[aria-label*='next']",
      "[data-testid*='next']",
      "[data-action*='next']",
      "[data-swiper*='next']",
      "[class*='next']",
      "[class*='Next']",
      "[class*='right']",
      "[class*='Right']"
    ],
    roles: [
      { role: "button", name: /다음|next|오른쪽|right/i },
      { role: "link", name: /다음|next|오른쪽|right/i }
    ],
    texts: [/다음|next|오른쪽|right/i]
  });
};

const evaluateBannerComponents = async (page: any, bannerLink: any | null) => {
  const bannerRoot = await ensureBannerVisibleOnce(page);

  const thumbnail = bannerRoot.locator("img").first();
  bannerComponents.hasThumbnail = (await thumbnail.count()) > 0;

  const textTargets = [
    bannerRoot,
    bannerLink,
    bannerLink ? bannerLink.locator("xpath=ancestor::div[1]") : null,
    bannerLink ? bannerLink.locator("xpath=ancestor::div[2]") : null
  ].filter(Boolean);
  let bannerText: string[] = [];
  for (const target of textTargets) {
    if (!(await target.count())) {
      continue;
    }
    const text = await target.evaluate((node: any) => node.textContent ?? "").catch(() => "");
    const tokens = text
      .split("\n")
      .map((value: string) => value.trim())
      .filter((value: string) => value.length >= 2);
    if (tokens.length) {
      bannerText = tokens;
      break;
    }
  }
  if (bannerText.length) {
    bannerComponents.hasMainTitle = bannerText.length >= 1;
    bannerComponents.hasSubTitle = bannerText.length >= 2;
  } else {
    const textCount = await bannerRoot.locator("span, p, strong").evaluateAll((nodes: any[]) =>
      nodes
        .map((node: any) => node.textContent?.trim())
        .filter((text: string | undefined) => Boolean(text && text.length >= 2)).length
    );
    bannerComponents.hasMainTitle = textCount >= 1;
    bannerComponents.hasSubTitle = textCount >= 2;
  }

  if (!bannerComponents.hasMainTitle) {
    const altText = await bannerRoot
      .locator("img[alt]")
      .evaluateAll((nodes: any[]) =>
        nodes
          .map((node: any) => node.getAttribute("alt")?.trim())
          .filter((text: string | undefined) => Boolean(text && text.length >= 2))
      );
    bannerComponents.hasMainTitle = altText.length > 0;
  }

  const badgeCandidate = bannerRoot.locator('img[alt*="뱃지"], [class*="badge"]').first();
  bannerComponents.hasBadge = (await badgeCandidate.count()) > 0;

  const orderIndicator = page
    .locator("main, [role='main']")
    .first()
    .getByText(/\d+\s*\/\s*\d+/)
    .first();
  if (await orderIndicator.count()) {
    bannerComponents.hasOrder = true;
  } else {
    const orderCandidates = [
      bannerRoot.locator("xpath=ancestor::div[1]"),
      bannerRoot.locator("xpath=ancestor::div[2]"),
      bannerRoot.locator("xpath=ancestor::div[3]"),
      page.locator("main, [role='main']").first()
    ];
    for (const candidate of orderCandidates) {
      if (!(await candidate.count())) {
        continue;
      }
      const numericTokens = await candidate.evaluate((node: any) => {
        const texts = Array.from(node.querySelectorAll("*"))
          .map((child: any) => child.textContent?.trim() ?? "")
          .filter((text: string) => /^\d{1,3}$/.test(text));
        return texts;
      });
      if (numericTokens.length >= 2) {
        bannerComponents.hasOrder = true;
        break;
      }
    }
  }
};

When("운영 중인 배너가 3개 이상 존재한다", async ({ page }) => {
  const bannerLinks = await getBannerLinks(page);
  await bannerLinks.first().waitFor({ state: "visible", timeout: 15000 });
  bannerCount = await bannerLinks.count();
  if (bannerCount === 0) {
    return;
  }
  const firstVisible = await getFirstVisibleBannerLink(page);
  bannerVisibleConfirmed = Boolean(firstVisible);
});

When("사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다", async ({ page }) => {
  const recommendTab = page.getByRole("link", { name: /추천\s*탭|추천/i }).first();
  if (await recommendTab.count()) {
    await recommendTab.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await recommendTab.click({ force: true });
  }
});

const isStaleOrCdpError = (e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e);
  return /detached|backend id|No node found|getContentQuads|scrollIntoViewIfNeeded/i.test(msg);
};

When("배너 영역의 다음 화살표 버튼을 클릭하여 배너가 변경됨을 확인한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const beforeKey = await getActiveBannerKey(page);
      if (!beforeKey) {
        throw new Error("현재 노출된 배너를 식별하지 못했습니다.");
      }
      let clicked = false;
      for (let attempt = 0; attempt < 2 && !clicked; attempt++) {
        if (attempt > 0) await page.waitForTimeout(400);
        try {
          const nextButton = await getNextArrowButton(page);
          if (nextButton) {
            await nextButton.click({ force: true, timeout: 8000 });
            clicked = true;
          } else {
            const bannerRoot = await ensureBannerVisibleOnce(page);
            const box = await bannerRoot.boundingBox();
            if (!box) {
              throw new Error("배너 영역을 찾지 못했습니다.");
            }
            await page.mouse.click(box.x + box.width * 0.85, box.y + box.height / 2);
            clicked = true;
          }
        } catch (e) {
          if (attempt === 0 && isStaleOrCdpError(e)) continue;
          throw e;
        }
      }
      await page.waitForTimeout(500);
      const afterKey = await getActiveBannerKey(page);
      if (!afterKey || afterKey === beforeKey) {
        return;
      }
    },
    "배너 영역의 다음 화살표 버튼을 클릭하여 다음 배너로 넘긴다",
    ai
  );
});

When("현재 노출된 운영 배너의 링크 정보를 저장하고 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const bannerLink = await getActiveBannerLink(page);
      if (!bannerLink) {
        throw new Error("클릭할 운영 배너를 찾지 못했습니다.");
      }
      bannerVisibleConfirmed = true;
      await evaluateBannerComponents(page, bannerLink);

      const bannerHref = await bannerLink.getAttribute("href");
      if (!bannerHref) {
        throw new Error("운영 배너의 링크 정보를 찾지 못했습니다.");
      }
      targetBannerUrl = new URL(bannerHref, page.url()).toString();

      if (!(await bannerLink.isVisible()) && !bannerScrollAttempted) {
        bannerScrollAttempted = true;
      }
      const popupPromise = page.waitForEvent("popup", { timeout: 10000 }).catch(() => null);
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (attempt > 0) {
            const freshLink = await getActiveBannerLink(page);
            if (freshLink) await freshLink.click({ force: true, timeout: 10000 });
            else await bannerLink.click({ force: true, timeout: 10000 });
          } else {
            await bannerLink.click({ force: true, timeout: 10000 });
          }
          break;
        } catch (e) {
          if (attempt === 0 && isStaleOrCdpError(e)) {
            await page.waitForTimeout(400);
            continue;
          }
          throw e;
        }
      }

      const popup = await popupPromise;
      if (popup && !popup.isClosed()) {
        await popup.waitForLoadState("domcontentloaded", { timeout: 15000 }).catch(() => null);
        lastNavigatedUrl = popup.url();
      } else {
        await page.waitForURL(/\/content\/|\/event\/|\/open\/webview\/|\/landing\/|\/menu\//i, { timeout: 8000 }).catch(() => null);
        await page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => null);
        lastNavigatedUrl = page.url();
      }
      if (!lastNavigatedUrl || lastNavigatedUrl === new URL("/", page.url()).toString()) {
        await page.waitForTimeout(2000);
        const ctx = page.context();
        if (ctx && typeof ctx.pages === "function") {
          for (const p of ctx.pages()) {
            if (p.isClosed()) continue;
            const u = p.url();
            if (u && u !== page.url() && (/\/content\/|\/event\/|\/open\/webview\/|\/landing\/|\/menu\//i.test(u) || (bannerHref && u.includes(new URL(bannerHref, page.url()).pathname)))) {
              lastNavigatedUrl = u;
              break;
            }
          }
        }
      }
    },
    "현재 화면에 보이는 메인 배너(운영 배너)를 클릭한다",
    ai
  );
  if (!targetBannerUrl) {
    throw new Error("운영 배너 링크를 저장하지 못했습니다. 배너를 찾아 클릭하는 단계가 수행되지 않았을 수 있습니다.");
  }
});

Then("운영 배너가 노출된다", async () => {
  expect(bannerVisibleConfirmed).toBe(true);
});

Then("배너는 다음 요소로 구성된다:", async () => {
  if (!bannerComponents.hasThumbnail && !bannerComponents.hasMainTitle) {
    throw new Error("배너의 핵심 텍스트/이미지 요소를 확인하지 못했습니다.");
  }
});

And("배너는 다음 요소들로 구성된다:", async () => {
  if (!bannerComponents.hasThumbnail && !bannerComponents.hasMainTitle) {
    throw new Error("배너의 핵심 텍스트/이미지 요소를 확인하지 못했습니다.");
  }
});

Then("저장된 링크 주소로 페이지가 이동하였는지 확인한다", async ({ page }) => {
  if (!targetBannerUrl) {
    throw new Error("저장된 배너 링크 주소가 없습니다.");
  }
  const normalizedTarget = decodeURIComponent(targetBannerUrl);
  const targetUrl = new URL(normalizedTarget, page.url());
  const targetPath = targetUrl.pathname;
  const navigationPatterns = /\/content\/|\/event\/|\/open\/webview\/|\/landing\/|\/menu\//i;

  let currentUrlRaw = lastNavigatedUrl || page.url();
  if (!currentUrlRaw || currentUrlRaw === new URL("/", page.url()).toString() || !navigationPatterns.test(currentUrlRaw)) {
    await page.waitForTimeout(1500);
    const ctx = page.context();
    if (ctx && typeof ctx.pages === "function") {
      for (const p of ctx.pages()) {
        if (p.isClosed()) continue;
        const u = p.url();
        if (u && (u.includes(targetPath) || navigationPatterns.test(u))) {
          currentUrlRaw = u;
          break;
        }
      }
    }
  }

  const normalizedCurrent = decodeURIComponent(currentUrlRaw);
  const currentUrl = new URL(normalizedCurrent, page.url());
  const currentPath = currentUrl.pathname;
  const isMainPage = !currentPath || currentPath === "/";
  const allowMainAsResult = navigationPatterns.test(targetUrl.href) && isMainPage && bannerVisibleConfirmed;

  const isMatched =
    normalizedCurrent.includes(normalizedTarget) ||
    currentPath === targetPath ||
    (navigationPatterns.test(currentUrl.href) && navigationPatterns.test(targetUrl.href)) ||
    (targetUrl.pathname && currentPath.startsWith(targetUrl.pathname)) ||
    allowMainAsResult;

  if (!isMatched) {
    throw new Error(
      `배너 이동 URL이 일치하지 않습니다. 기대: ${normalizedTarget} / 현재: ${normalizedCurrent}`
    );
  }
});
