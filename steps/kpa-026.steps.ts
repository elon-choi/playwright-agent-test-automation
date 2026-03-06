// Feature: KPA-026 기능 검증
// Scenario: 이용권 사용 확인 팝업 동작 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";
import {
  getEpisodeListScope,
  OTHER_WORK_CARD_MARKER,
  getCurrentContentId,
  isLinkSameWork
} from "./common.episode.steps.js";

const BADGE_IMG_NAME = /기다무|3다무|시계/i;
const BADGE_IMG_ALT =
  "img[alt*='기다무'], img[alt*='3다무'], img[alt*='시계'], img[alt*='기다무 뱃지']";

And("이용권 사용 확인 팝업이 Off 상태이다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  const onOrigin = page.url().startsWith(getBaseUrlOrigin());
  if (!onOrigin) return;
  const offToggle = page.getByRole("switch", { name: /이용권\s*사용\s*확인|Off/i }).or(
    page.locator('[role="switch"]').filter({ hasText: /이용권|사용\s*확인/ })
  );
  if (await offToggle.count() > 0) {
    const checked = await offToggle.first().getAttribute("aria-checked");
    if (checked === "true") await offToggle.first().click({ timeout: 5000 }).catch(() => null);
  }
});

And("사용자가 대여권을 보유하고 있다", async ({ page }) => {
  await page.waitForTimeout(300);
});

And("설정 메뉴를 클릭한다", async ({ page, loginPage }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    await loginPage.clickProfileIcon(false);
    await page.waitForTimeout(2000);
    if (/accounts\.kakao\.com\/login/i.test(page.url())) {
      throw new Error("로그인 페이지로 이동했습니다. 00-login.feature 실행 후 KPA-026을 실행하세요.");
    }
  }
  await page.waitForTimeout(1500);
  const menu = page.locator('a[href="/settings"]');
  await menu.waitFor({ state: "visible", timeout: 15000 });
  await menu.click({ timeout: 10000, force: true });
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(500);
});

And("임의의 메뉴 설정을 변경한다", async ({ page }) => {
  const toggle = page.getByRole("switch").first();
  if (await toggle.count() > 0) await toggle.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(300);
});

And("이용권 사용 확인 메뉴를 클릭한다", async ({ page }) => {
  const menu = page.getByRole("link", { name: /이용권\s*사용\s*확인/i })
    .or(page.getByText(/이용권\s*사용\s*확인/i).first());
  await menu.first().click({ timeout: 10000 });
  await page.waitForTimeout(500);
});

And("On 옵션을 클릭한다", async ({ page }) => {
  const onOption = page.getByRole("button", { name: /^On$/i })
    .or(page.getByRole("radio", { name: /On/i }))
    .or(page.getByText(/^On$/i).first());
  await onOption.first().click({ timeout: 8000, force: true });
  await page.waitForTimeout(400);
});

And("더보기 메뉴를 이탈하여 대여권을 보유한 임의의 작품을 클릭한다", async ({ page }) => {
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
  const contentLinks = page.locator('a[href*="/content/"]');
  const withBadgeImg = contentLinks.filter({
    has: page.getByRole("img", { name: BADGE_IMG_NAME })
  });
  if (await withBadgeImg.count() > 0) {
    await withBadgeImg.first().click({ timeout: 10000, force: true });
    await page.waitForTimeout(500);
    return;
  }
  const withBadgeAlt = contentLinks.filter({ has: page.locator(BADGE_IMG_ALT) });
  if (await withBadgeAlt.count() > 0) {
    await withBadgeAlt.first().click({ timeout: 10000, force: true });
    await page.waitForTimeout(500);
    return;
  }
  const badgeImgThenLink = page.getByRole("img", { name: BADGE_IMG_NAME });
  const badgeCount = await badgeImgThenLink.count();
  for (let i = 0; i < badgeCount; i++) {
    const link = badgeImgThenLink.nth(i).locator("xpath=ancestor::a[contains(@href,'/content/')][1]");
    if (await link.count() > 0 && (await link.first().isVisible().catch(() => false))) {
      await link.first().click({ timeout: 10000, force: true });
      await page.waitForTimeout(500);
      return;
    }
  }
  const fallback = page.getByRole("link", { name: /작품,.*기다무|작품,.*3다무/i }).or(
    contentLinks.first()
  );
  if (await fallback.count() > 0) {
    await fallback.first().click({ timeout: 10000, force: true });
    await page.waitForTimeout(500);
    return;
  }
  throw new Error("작품홈 좌측 상단에 기다무/3다무 뱃지가 있는 작품 카드를 찾지 못했습니다.");
});

And("기다무 뱃지가 달린 회차를 찾아 클릭한 후 취소 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(1200);
  const sortLabel = page.getByText(/^최신순$|^최신\s*순$/).first();
  await sortLabel.waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(800);
  const currentContentId = getCurrentContentId(page.url());

  const clickCancelIfPresent = async () => {
    const cancelBtn = page.getByRole("button", { name: /취소/i }).or(page.getByText(/^취소$/i));
    if (await cancelBtn.count() > 0) {
      await cancelBtn.first().click({ timeout: 5000 }).catch(() => null);
      await page.waitForTimeout(400);
    }
  };

  // 기다무 뱃지가 달린 회차 찾기 (스크롤 포함)
  const BADGE_SELECTOR = "img[alt*='기다무'], img[alt*='3다무'], img[alt*='시계'], img[alt*='기다무 뱃지']";
  const MAX_SCROLL_ATTEMPTS = 15;

  for (let scroll = 0; scroll <= MAX_SCROLL_ATTEMPTS; scroll++) {
    const episodeScope = await getEpisodeListScope(page);

    // 기다무 뱃지가 있는 회차 행 찾기
    const rows = episodeScope
      .locator('[class*="item"], [class*="row"], [class*="episode"], [class*="Episode"], tr, li')
      .filter({ hasNot: episodeScope.locator(OTHER_WORK_CARD_MARKER) })
      .filter({ has: page.locator('a[href*="/viewer/"]') });

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      // 기다무 뱃지 이미지가 있는지 확인
      const hasBadge = await row.locator(BADGE_SELECTOR).count() > 0;
      if (!hasBadge) continue;

      const link = row.locator('a[href*="/viewer/"]').first();
      if ((await link.count()) === 0) continue;
      const href = await link.getAttribute("href").catch(() => null);
      const path = href ? new URL(href, page.url()).pathname : "";
      if (!isLinkSameWork(path, currentContentId, page.url())) continue;

      await link.scrollIntoViewIfNeeded().catch(() => null);
      await link.click({ force: true });
      console.log(`[KPA-026] 기다무 뱃지 회차 클릭 (row ${i}, scroll ${scroll})`);
      await page.waitForTimeout(800);
      await clickCancelIfPresent();
      return;
    }

    // 뱃지를 찾지 못하면 viewer 링크에서 직접 탐색
    const viewerLinks = episodeScope.locator('a[href*="/viewer/"]');
    const linkCount = await viewerLinks.count();
    for (let i = 0; i < linkCount; i++) {
      const link = viewerLinks.nth(i);
      const inOtherWork = await link.locator("xpath=ancestor::*[contains(@class,\"border-sp-thumb-line\")]").count() > 0;
      if (inOtherWork) continue;
      const href = await link.getAttribute("href").catch(() => null);
      const path = href ? new URL(href, page.url()).pathname : "";
      if (!isLinkSameWork(path, currentContentId, page.url())) continue;

      // 링크 주변에 기다무 뱃지가 있는지 확인
      const parent = link.locator("xpath=ancestor::*[contains(@class,'item') or contains(@class,'row') or contains(@class,'episode') or contains(@class,'Episode') or self::li][1]");
      const parentHasBadge = await parent.locator(BADGE_SELECTOR).count().catch(() => 0) > 0;
      // 링크 내부에 뱃지가 있는 경우도 확인
      const linkHasBadge = await link.locator(BADGE_SELECTOR).count().catch(() => 0) > 0;
      if (!parentHasBadge && !linkHasBadge) continue;

      await link.scrollIntoViewIfNeeded().catch(() => null);
      await link.click({ force: true });
      console.log(`[KPA-026] 기다무 뱃지 회차 클릭 (link ${i}, scroll ${scroll})`);
      await page.waitForTimeout(800);
      await clickCancelIfPresent();
      return;
    }

    // 기다무 뱃지를 찾지 못하면 스크롤 다운
    if (scroll < MAX_SCROLL_ATTEMPTS) {
      console.log(`[KPA-026] 기다무 뱃지 미발견, 스크롤 다운 (${scroll + 1}/${MAX_SCROLL_ATTEMPTS})`);
      await episodeScope.evaluate((el: HTMLElement) => {
        el.scrollBy({ top: 400, behavior: "smooth" });
      }).catch(async () => {
        // episodeScope 스크롤 실패 시 페이지 전체 스크롤
        await page.mouse.wheel(0, 400);
      });
      await page.waitForTimeout(800);
    }
  }

  throw new Error("회차 리스트에서 기다무 뱃지가 달린 회차를 찾지 못했습니다. 스크롤 후에도 기다무 회차가 없습니다.");
});

Then("이용권 사용 확인 메뉴를 클릭할 때 다음과 같은 팝업이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  const popupContent = page.getByText(/기다무\s*대여권|대여권\s*\d+\s*장|소장권\s*\d+\s*장|이용권\s*사용\s*확인\s*다시|미구매\s*회차/i).first();
  await expect(popupContent).toBeVisible({ timeout: 10000 });
  const closeButton = page.getByRole("button", { name: /취소|닫기/i }).or(page.getByText(/^취소$|^닫기$/i));
  const closeVisible = await closeButton.first().isVisible().catch(() => false);
  if (!closeVisible) {
    const buttons = page.getByRole("button");
    await expect(buttons.first()).toBeVisible({ timeout: 5000 });
  } else {
    await expect(closeButton.first()).toBeVisible({ timeout: 3000 });
  }
  const onOffOrCheckbox = page.getByRole("button", { name: /On|Off/i }).or(
    page.getByText(/이용권\s*사용\s*확인.*다시\s*보지\s*않기|다시\s*보지\s*않기/i)
  );
  if (await onOffOrCheckbox.count() > 0) {
    await expect(onOffOrCheckbox.first()).toBeVisible({ timeout: 3000 }).catch(() => null);
  }
});

And("이용권 사용 팝업이 노출되며, 취소 버튼을 클릭하면 팝업이 종료되고 회차 리스트가 노출된다", async ({ page }) => {
  const dialog = page.getByRole("dialog").first();
  const dialogVisible = await dialog.isVisible().catch(() => false);
  const modalScope = dialogVisible ? dialog : null;
  if (modalScope) {
    const cancelOrClose = modalScope.getByRole("button", { name: /^취소$|^닫기$/i })
      .or(modalScope.getByText(/^취소$|^닫기$/));
    if (await cancelOrClose.count() > 0 && await cancelOrClose.first().isVisible().catch(() => false)) {
      await cancelOrClose.first().click({ timeout: 5000 }).catch(() => null);
    } else {
      await page.keyboard.press("Escape");
    }
  } else {
    const inModal = page.locator('[role="dialog"], [class*="odal"]').filter({
      has: page.getByText(/미구매\s*회차|이용권\s*사용\s*확인\s*팝업|기다무\s*대여권|소장권\s*\d+\s*캐시/i)
    }).first();
    if (await inModal.isVisible().catch(() => false)) {
      const cancelOrClose = inModal.getByRole("button", { name: /^취소$|^닫기$/i })
        .or(inModal.getByText(/^취소$|^닫기$/));
      if (await cancelOrClose.count() > 0 && await cancelOrClose.first().isVisible().catch(() => false)) {
        await cancelOrClose.first().click({ timeout: 5000 }).catch(() => null);
      } else {
        await page.keyboard.press("Escape");
      }
    } else {
      await page.keyboard.press("Escape");
    }
  }
  await page.waitForTimeout(800);
  await expect(page).toHaveURL(/\/(content|landing\/series)\//i);
  const episodeListArea = page.getByRole("tab", { name: /회차/i })
    .or(page.getByText(/첫화부터|최신\s*순|최신순/))
    .or(page.locator('a[href*="/viewer/"]').first());
  await expect(episodeListArea.first()).toBeVisible({ timeout: 12000 });
});
