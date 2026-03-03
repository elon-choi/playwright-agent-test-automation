// Feature: KPA-116 - 무료 회차에서 원작소설로 이동
// 시나리오: 무료 회차 클릭 후 뷰어 진입 → 뷰어 엔드 영역까지 스크롤 → 해당 영역의 "이 작품을 원작소설로 보기" 배너 클릭
// 전체 연령 작품 목록 확인/무료 회차 진입/최하단 스크롤은 common.episode.steps.ts
import { And, Then, expect } from "./fixtures.js";

const scrollViewerToEnd = async (page: import("@playwright/test").Page) => {
  await page.evaluate(() => {
    const scrollToBottom = (el: Element | null) => {
      if (!el || !(el instanceof HTMLElement)) return;
      if (el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
    };
    const maxH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    window.scrollTo(0, maxH);
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    document.body.scrollTop = document.body.scrollHeight;
    [document.querySelector("main"), document.querySelector("[class*='viewer'], [class*='Viewer']"), document.querySelector("[class*='scroll'], [class*='Scroll']"), document.querySelector("[class*='content'], [class*='Content']")].forEach(scrollToBottom);
  }).catch(() => null);
  const viewerArea = page.locator("[class*='viewer'], [class*='Viewer'], main").first();
  if ((await viewerArea.count()) > 0) {
    await viewerArea.evaluate((el) => {
      (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight;
      const inner = (el as HTMLElement).querySelector("[class*='scroll'], [class*='content'], [class*='body']");
      if (inner && (inner as HTMLElement).scrollHeight > (inner as HTMLElement).clientHeight)
        (inner as HTMLElement).scrollTop = (inner as HTMLElement).scrollHeight;
    }).catch(() => null);
  }
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => {
      const step = 400;
      window.scrollBy(0, step);
      document.body.scrollTop = Math.min(document.body.scrollHeight, (document.body.scrollTop || 0) + step);
      const el = document.querySelector("main, [class*='viewer'], [class*='Viewer'], [class*='scroll']");
      if (el && el instanceof HTMLElement && el.scrollHeight > el.clientHeight)
        el.scrollTop = Math.min(el.scrollHeight, el.scrollTop + step);
    }).catch(() => null);
    await page.waitForTimeout(200).catch(() => null);
  }
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    document.body.scrollTop = document.body.scrollHeight;
  }).catch(() => null);
  await page.waitForTimeout(500).catch(() => null);
};

const re원작소설 = /원작\s*소설|이\s*작품을\s*[''']?원작\s*소설[''']?\s*로\s*보기|동일작\s*보기/i;
const re웹툰 = /웹툰\s*으로\s*보기|이\s*작품을\s*.*?웹툰.*?으로\s*보기/i;
const re웹툰넓음 = /웹툰/;

And("사용자가 {string} 배너를 클릭한다", async ({ page }, param: string) => {
  if (page.isClosed?.()) return;
  await page.waitForTimeout(500);

  await scrollViewerToEnd(page);
  await page.waitForSelector('img[alt="동일작 보기"]', { state: "attached", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(300);

  const is웹툰 = /웹툰/.test(param);
  const re = is웹툰 ? re웹툰 : re원작소설;
  const byImg = page.locator('img[alt="동일작 보기"]').first();
  const containerSelector = "[class*='cursor-pointer']";
  const byContainer = page.locator(`div${containerSelector}`).filter({ has: page.locator('img[alt="동일작 보기"]') }).first();
  const byContainer웹툰 = is웹툰
    ? page.locator(`div${containerSelector}`).filter({ has: page.locator('img[alt="동일작 보기"]') }).filter({ hasText: re웹툰넓음 }).first()
    : null;
  const byText = page.getByText(re).first();
  const byText웹툰 = is웹툰 ? page.getByText(re웹툰넓음).first() : null;

  let bannerVisible =
    (await byImg.isVisible().catch(() => false)) ||
    (await byContainer.isVisible().catch(() => false)) ||
    (await byText.isVisible().catch(() => false)) ||
    (byContainer웹툰 && (await byContainer웹툰.isVisible().catch(() => false))) ||
    (byText웹툰 && (await byText웹툰.isVisible().catch(() => false)));

  if (!bannerVisible) {
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => {
        const step = 400;
        window.scrollBy(0, step);
        document.body.scrollTop = Math.min(document.body.scrollHeight, (document.body.scrollTop || 0) + step);
        const el = document.querySelector("main, [class*='viewer'], [class*='Viewer'], [class*='scroll']");
        if (el && el instanceof HTMLElement && el.scrollHeight > el.clientHeight)
          el.scrollTop = Math.min(el.scrollHeight, el.scrollTop + step);
      }).catch(() => null);
      await page.waitForTimeout(400).catch(() => null);
      bannerVisible =
        (await byImg.isVisible().catch(() => false)) ||
        (await byContainer.isVisible().catch(() => false)) ||
        (await byText.isVisible().catch(() => false)) ||
        (byContainer웹툰 && (await byContainer웹툰.isVisible().catch(() => false))) ||
        (byText웹툰 && (await byText웹툰.isVisible().catch(() => false)));
      if (bannerVisible) break;
    }
  }

  const bannerLabel = is웹툰 ? "웹툰으로 보기" : "원작소설로 보기";
  if (!bannerVisible) throw new Error(`${bannerLabel} 배너를 찾지 못했습니다. 뷰어 엔드 영역까지 스크롤 후에도 노출되지 않습니다.`);

  const containerToClick = is웹툰
    ? page.locator(`div${containerSelector}`).filter({ has: page.locator('img[alt="동일작 보기"]') }).filter({ hasText: re웹툰넓음 }).first()
    : page.locator(`div${containerSelector}`).filter({ has: page.locator('img[alt="동일작 보기"]') }).filter({ hasText: re원작소설 }).first();
  const fallback = page.locator(containerSelector).filter({ hasText: is웹툰 ? re웹툰넓음 : re원작소설 }).first();
  const img = page.locator('img[alt="동일작 보기"]').first();

  if (await containerToClick.isVisible().catch(() => false)) {
    await containerToClick.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await containerToClick.click({ timeout: 8000 });
  } else if (await fallback.isVisible().catch(() => false)) {
    await fallback.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await fallback.click({ timeout: 8000 });
  } else {
    await img.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await img.click({ timeout: 8000 });
  }
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 });
  await page.waitForTimeout(300);
});

Then("사용자는 해당 작품의 홈 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(content|landing\/series)\//i, { timeout: 8000 });
});