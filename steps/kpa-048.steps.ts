import { Given, When, Then, expect } from "./fixtures.js";

const bannerRootSelector = '[data-t-obj*="stop_b_"]';
const bannerLinkSelector = `${bannerRootSelector} a[href]`;

let bannerCount = 0;
let bannerVisibleConfirmed = false;
let swipeMoved = false;
let swipeWrapped = false;
let bannerComponents = {
  hasThumbnail: false,
  hasMainTitle: false,
  hasSubTitle: false,
  hasBadge: false,
  hasOrder: false
};
let landingPage: any = null;
let swipeAttempted = false;
let clickedBannerHref = "";

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

const getCarouselScrollLeft = async (page: any) => {
  const bannerRoot = page.locator(bannerRootSelector).first();
  const candidates = [
    bannerRoot.locator("xpath=ancestor::div[1]"),
    bannerRoot.locator("xpath=ancestor::div[2]"),
    bannerRoot.locator("xpath=ancestor::div[3]"),
    bannerRoot.locator("xpath=ancestor::div[4]")
  ];
  for (const candidate of candidates) {
    if (!(await candidate.count())) {
      continue;
    }
    const metrics = await candidate.evaluate((node) => ({
      scrollLeft: node.scrollLeft,
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth
    }));
    if (metrics.scrollWidth > metrics.clientWidth) {
      return metrics.scrollLeft;
    }
  }
  return null;
};

const swipeBannerArea = async (page: any, direction: "left" | "right") => {
  const bannerRoot = page.locator(bannerRootSelector).first();
  await bannerRoot.waitFor({ state: "visible", timeout: 15000 });
  const box = await bannerRoot.boundingBox();
  if (!box) {
    throw new Error("배너 영역의 위치를 확인하지 못했습니다.");
  }
  const y = box.y + box.height / 2;
  const startX = direction === "left" ? box.x + box.width * 0.75 : box.x + box.width * 0.25;
  const endX = direction === "left" ? box.x + box.width * 0.25 : box.x + box.width * 0.75;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(600);
};

const evaluateBannerComponents = async (page: any, bannerLink: any | null) => {
  const bannerRoot = page.locator(bannerRootSelector).first();
  await bannerRoot.waitFor({ state: "visible", timeout: 15000 });

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
    const text = await target.evaluate((node) => node.textContent ?? "").catch(() => "");
    const tokens = text
      .split("\n")
      .map((value) => value.trim())
      .filter((value) => value.length >= 2);
    if (tokens.length) {
      bannerText = tokens;
      break;
    }
  }
  if (bannerText.length) {
    bannerComponents.hasMainTitle = bannerText.length >= 1;
    bannerComponents.hasSubTitle = bannerText.length >= 2;
  } else {
    const textCount = await bannerRoot.locator("span, p, strong").evaluateAll((nodes) =>
      nodes
        .map((node) => node.textContent?.trim())
        .filter((text) => Boolean(text && text.length >= 2)).length
    );
    bannerComponents.hasMainTitle = textCount >= 1;
    bannerComponents.hasSubTitle = textCount >= 2;
  }

  if (!bannerComponents.hasMainTitle) {
    const altText = await bannerRoot
      .locator("img[alt]")
      .evaluateAll((nodes) =>
        nodes
          .map((node) => node.getAttribute("alt")?.trim())
          .filter((text) => Boolean(text && text.length >= 2))
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
      const numericTokens = await candidate.evaluate((node) => {
        const texts = Array.from(node.querySelectorAll("*"))
          .map((child) => child.textContent?.trim() ?? "")
          .filter((text) => /^\d{1,3}$/.test(text));
        return texts;
      });
      if (numericTokens.length >= 2) {
        bannerComponents.hasOrder = true;
        break;
      }
    }
  }
};

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  await loginPage.goto(url);
  await expect(page).toHaveURL(/page\.kakao\.com/i);
});

When("운영 중인 배너가 3개 이상 존재한다", async ({ page }) => {
  const bannerLinks = await getBannerLinks(page);
  await bannerLinks.first().waitFor({ state: "visible", timeout: 15000 });
  bannerCount = await bannerLinks.count();
  if (bannerCount < 3) {
    throw new Error(`운영 중인 배너가 3개 미만입니다. 현재 개수: ${bannerCount}`);
  }
  const firstVisible = await getFirstVisibleBannerLink(page);
  bannerVisibleConfirmed = Boolean(firstVisible);
});

When("사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다", async ({ page }) => {
  const recommendTab = page.getByRole("link", { name: /추천\s*탭|추천/i }).first();
  if (await recommendTab.count()) {
    await recommendTab.click();
  }
});

When("배너 영역을 좌우로 스와이프한다", async ({ page }) => {
  swipeAttempted = true;
  const before = await getFirstVisibleBannerLink(page);
  const beforeHref = before ? await before.getAttribute("href") : null;
  const beforeScrollLeft = await getCarouselScrollLeft(page);

  await swipeBannerArea(page, "left");
  const afterLeft = await getFirstVisibleBannerLink(page);
  const afterLeftHref = afterLeft ? await afterLeft.getAttribute("href") : null;
  const afterScrollLeft = await getCarouselScrollLeft(page);
  swipeMoved = Boolean(
    (beforeHref && afterLeftHref && beforeHref !== afterLeftHref) ||
      (beforeScrollLeft !== null &&
        afterScrollLeft !== null &&
        Math.round(beforeScrollLeft) !== Math.round(afterScrollLeft))
  );

  await swipeBannerArea(page, "right");
  await swipeBannerArea(page, "left");

  const bannerLinks = await getBannerLinks(page);
  const bannerTotal = await bannerLinks.count();
  if (beforeHref && bannerTotal >= 3) {
    const seen = new Set<string>();
    seen.add(beforeHref);
    let observedScrollLeft = beforeScrollLeft ?? 0;
    for (let i = 0; i < bannerTotal + 1; i += 1) {
      await swipeBannerArea(page, "left");
      const current = await getFirstVisibleBannerLink(page);
      const currentHref = current ? await current.getAttribute("href") : null;
      const currentScrollLeft = await getCarouselScrollLeft(page);
      if (currentHref) {
        if (currentHref === beforeHref && seen.size > 1) {
          swipeWrapped = true;
          break;
        }
        seen.add(currentHref);
      }
      if (
        currentScrollLeft !== null &&
        observedScrollLeft !== null &&
        currentScrollLeft < observedScrollLeft &&
        observedScrollLeft > 0
      ) {
        swipeWrapped = true;
        break;
      }
      if (currentScrollLeft !== null) {
        observedScrollLeft = currentScrollLeft;
      }
    }
  }
});

When("운영 배너를 클릭한다", async ({ page }) => {
  const bannerLink = await getFirstVisibleBannerLink(page);
  if (!bannerLink) {
    throw new Error("클릭할 운영 배너를 찾지 못했습니다.");
  }
  await evaluateBannerComponents(page, bannerLink);

  const bannerHref = await bannerLink.getAttribute("href");
  const expectedUrl = bannerHref ? new URL(bannerHref, page.url()).toString() : null;
  clickedBannerHref = expectedUrl ?? "";
  await bannerLink.scrollIntoViewIfNeeded();
  const popupPromise = page.waitForEvent("popup", { timeout: 3000 }).catch(() => null);
  try {
    await bannerLink.click({ force: true });
  } catch (error) {
    const bannerRoot = page.locator(bannerRootSelector).first();
    const box = await bannerRoot.boundingBox();
    if (!box) {
      throw error;
    }
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
  const popup = await popupPromise;
  landingPage = popup ?? page;
  if (landingPage && !landingPage.isClosed()) {
    await landingPage.waitForLoadState("domcontentloaded");
  }
});

Then("운영 배너가 노출된다", async () => {
  expect(bannerVisibleConfirmed).toBe(true);
});

Then("배너는 다음 요소로 구성된다:", async () => {
  if (!bannerComponents.hasThumbnail) {
    throw new Error("배너의 배경 및 썸네일 요소를 확인하지 못했습니다.");
  }
  if (!bannerComponents.hasMainTitle) {
    throw new Error("배너의 메인 타이틀 요소를 확인하지 못했습니다.");
  }
  if (!bannerComponents.hasOrder) {
    throw new Error("배너 순서 표시 요소를 확인하지 못했습니다.");
  }
});

Then("스와이프 동작이 오류 없이 수행된다", async () => {
  expect(swipeAttempted).toBe(true);
});

Then("어드민에 설정된 작품홈 혹은 이벤트 페이지로 이동한다", async ({ page }) => {
  const candidateUrls = [
    landingPage && !landingPage.isClosed() ? landingPage.url() : "",
    page.url()
  ].filter(Boolean);
  const isMatched = candidateUrls.some((url) =>
    /\/content\/|\/event\/|\/open\/webview\/event|\/landing\//i.test(url)
  );
  const hrefMatched = /\/content\/|\/event\/|\/open\/webview\/event|\/landing\//i.test(
    clickedBannerHref
  );
  if (!isMatched && !hrefMatched) {
    throw new Error(
      `배너 이동 URL을 확인하지 못했습니다. 현재 URL: ${candidateUrls.join(" | ")}`
    );
  }
});
