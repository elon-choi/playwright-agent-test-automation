// Feature: KPA-065 시나리오 검증
// Scenario: 작품 카드 클릭 후 이미지 확대 및 닫기 기능 검증 (메인에서 작품 카드 클릭, 실시간 랭킹 미경유)
import { Given, When, Then, And, expect, getRandomTestWorkUrl } from "./fixtures.js";

const CONTENT_LINK_SELECTOR = 'a[href*="/content/"]:not([href*="/list/"]), a[href*="/landing/series/"]:not([href*="/list/"])';
const PREFERRED_TITLE = "닥터 최태수";

When("사용자가 카카오페이지 웹에 접속한다", async ({ page }) => {
  await expect(page).toHaveURL(/page\.kakao\.com/);
});

And("사용자가 메인에서 임의의 작품 카드를 클릭한다", async ({ page }) => {
  if (/\/content\/|\/landing\/series\//i.test(page.url())) return;

  const fixedWorkUrl = getRandomTestWorkUrl();
  if (fixedWorkUrl) {
    await page.goto(fixedWorkUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
    await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
    return;
  }

  // TEST_WORK_URL / TEST_WORK_URLS 미설정 시 메인 첫 번째 작품 링크를 클릭함.
  // 뷰어 시나리오(109, 112, 113 등)에서는 테스트 풀 제어를 위해 .env에 TEST_WORK_URLS를 설정할 것.
  const webtoonTab = page.getByRole("link", { name: /웹툰\s*탭|웹툰/i }).or(page.locator('a[href*="/menu/10010"]'));
  if ((await webtoonTab.count()) > 0) {
    await webtoonTab.first().click({ timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(800);
  }
  await page.locator(CONTENT_LINK_SELECTOR).first().waitFor({ state: "visible", timeout: 15000 }).catch(() => null);

  const links = await page.locator(CONTENT_LINK_SELECTOR).all();
  let targetLink: any = null;
  for (const link of links) {
    const text = await link.textContent().catch(() => "") ?? "";
    const inParent = await link.evaluate((el: Element) => {
      let p: Element | null = el.parentElement;
      for (let d = 0; p && d < 4; d++) {
        if ((p.textContent || "").includes(PREFERRED_TITLE)) return true;
        p = p.parentElement;
      }
      return false;
    }).catch(() => false);
    if (text.includes(PREFERRED_TITLE) || inParent) {
      targetLink = link;
      break;
    }
  }
  if (!targetLink && links.length > 0) targetLink = links[0];

  if (targetLink) {
    await targetLink.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300);
    const href = await targetLink.getAttribute("href").catch(() => null);
    await targetLink.click({ force: true, timeout: 10000 });
    await page.waitForURL(/\/content\/|\/landing\/series\//i, { timeout: 12000 }).catch(() => null);
    if (!/\/content\/|\/landing\/series\//i.test(page.url()) && href && /\/content\/|\/landing\/series\//i.test(href)) {
      const base = new URL(page.url()).origin;
      const targetUrl = href.startsWith("http") ? href : new URL(href, base).href;
      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
    }
    await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
    return;
  }
  throw new Error("메인에서 작품 카드 링크를 찾지 못했습니다.");
});

When("사용자가 임의의 작품 카드를 클릭한다", async ({ page }) => {
  const candidates = [
    page.getByRole("link", { name: /^작품,/ }),
    page.locator('a[href*="/content/"]')
  ];
  for (const locator of candidates) {
    const count = await locator.count();
    if (count > 0) {
      const maxIndex = Math.min(count - 1, 20);
      const index = Math.floor(Math.random() * (maxIndex + 1));
      await locator.nth(index).click();
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      return;
    }
  }
  throw new Error("작품 카드 링크를 찾지 못했습니다.");
});

const getMainImageLocator = (page: any) =>
  page.locator('img[alt*="대표"], img[alt*="작품"], img[alt*="썸네일"]').or(
    page.locator("main img, [class*='thumbnail'] img, [class*='cover'] img, [class*='poster'] img").first()
  );

Then("메인 대표 이미지 영역이 화면에 표시된다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
  const mainImage = getMainImageLocator(page);
  await expect(mainImage.first()).toBeVisible({ timeout: 10000 });
});

When("사용자가 대표 이미지를 클릭한다", async ({ page }) => {
  const zoomCandidates = [
    page.getByRole("button", { name: /이미지 크게보기/i }),
    page.getByText(/이미지 크게보기/i),
    page.locator('img[alt*="이미지 크게보기"]')
  ];
  for (const locator of zoomCandidates) {
    if (await locator.count()) {
      await locator.first().click({ force: true });
      return;
    }
  }
  const mainImage = getMainImageLocator(page);
  await mainImage.first().click({ force: true });
});

Then("대표 이미지가 화면 전체 사이즈로 확대된다", async ({ page }) => {
  const overlay = page.locator('[role="dialog"], [aria-modal="true"], .modal, .viewer');
  const closeButton = page.getByRole("button", { name: /닫기|close/i });
  const closeIcon = page.locator('img[alt*="닫기"]');
  if (await overlay.count()) {
    await expect(overlay.first()).toBeVisible();
    return;
  }
  if ((await closeButton.count()) || (await closeIcon.count())) {
    return;
  }
  throw new Error("이미지 확대 레이어를 확인하지 못했습니다.");
});

When("사용자가 확대된 이미지를 닫기 버튼을 클릭한다", async ({ page }) => {
  const closeCandidates = [
    page.getByRole("button", { name: /닫기|close/i }),
    page.locator('[aria-label*="닫기"], [aria-label*="close"]'),
    page.locator('img[alt*="닫기"]')
  ];
  for (const locator of closeCandidates) {
    if (await locator.count()) {
      await locator.first().click();
      return;
    }
  }
  await page.keyboard.press("Escape");
});

Then("이전 화면으로 돌아가고, 대표 섬네일 이미지가 노출된다", async ({ page }) => {
  const mainImage = getMainImageLocator(page);
  await expect(mainImage.first()).toBeVisible({ timeout: 10000 });
});
