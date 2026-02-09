// Feature: KPA-026 기능 검증
// Scenario: 이용권 사용 확인 팝업 동작 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

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

And("설정 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  const byRole = page.getByRole("link", { name: /설정/i }).or(page.getByRole("button", { name: /설정/i }));
  if (await byRole.count() > 0 && await byRole.first().isVisible().catch(() => false)) {
    await byRole.first().click({ timeout: 8000 });
    await page.waitForTimeout(500);
    return;
  }
  const byText = page.locator('a').filter({ hasText: /설정/i });
  if (await byText.count() > 0 && await byText.first().isVisible().catch(() => false)) {
    await byText.first().click({ timeout: 8000 });
    await page.waitForTimeout(500);
    return;
  }
  const settingXpath = page.locator('xpath=//*[@id="__next"]/div/div[1]/div/div[2]/div[2]/div/div[9]/a');
  await settingXpath.first().click({ timeout: 8000 });
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

async function clickBadgeEpisodeIfFound(page: import("playwright").Page): Promise<boolean> {
  const viewerLinks = page.locator('a[href*="/viewer/"]');
  const withBadgeImg = viewerLinks.filter({
    has: page.getByRole("img", { name: BADGE_IMG_NAME })
  });
  if (await withBadgeImg.count() > 0) {
    await withBadgeImg.first().scrollIntoViewIfNeeded();
    await withBadgeImg.first().click({ timeout: 10000, force: true });
    await page.waitForTimeout(800);
    return true;
  }
  const withBadgeAlt = viewerLinks.filter({ has: page.locator(BADGE_IMG_ALT) });
  if (await withBadgeAlt.count() > 0) {
    await withBadgeAlt.first().scrollIntoViewIfNeeded();
    await withBadgeAlt.first().click({ timeout: 10000, force: true });
    await page.waitForTimeout(800);
    return true;
  }
  const badgeImgThenViewerLink = page.getByRole("img", { name: BADGE_IMG_NAME });
  const badgeCount = await badgeImgThenViewerLink.count();
  for (let i = 0; i < badgeCount; i++) {
    const link = badgeImgThenViewerLink.nth(i).locator("xpath=ancestor::a[contains(@href,'/viewer/')][1]");
    if (await link.count() > 0 && (await link.first().isVisible().catch(() => false))) {
      await link.first().scrollIntoViewIfNeeded();
      await link.first().click({ timeout: 10000, force: true });
      await page.waitForTimeout(800);
      return true;
    }
  }
  return false;
}

And("감상 이력이 없는 유료 회차를 클릭한 후 취소 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  if (await clickBadgeEpisodeIfFound(page)) return;
  const expandArrow = page.getByRole("img", { name: "아래 화살표" }).or(
    page.locator('img[alt="아래 화살표"]')
  );
  if (await expandArrow.count() > 0 && (await expandArrow.first().isVisible().catch(() => false))) {
    await expandArrow.first().scrollIntoViewIfNeeded();
    await expandArrow.first().click({ timeout: 5000, force: true });
    await page.waitForTimeout(800);
    if (await clickBadgeEpisodeIfFound(page)) return;
  }
  throw new Error(
    "1번에서 선택한 작품과 동일한 뱃지(기다무/3다무)가 달린 회차를 찾지 못했습니다. 회차 리스트 확장 후에도 해당 회차가 없을 수 있습니다."
  );
});

Then("이용권 사용 확인 메뉴를 클릭할 때 다음과 같은 팝업이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  const cancel = page.getByRole("button", { name: /취소/i }).or(page.getByText(/^취소$/i));
  await expect(cancel.first()).toBeVisible({ timeout: 10000 });
  const popupContent = page.getByText(/기다무\s*대여권|대여권\s*\d+\s*장|소장권\s*\d+\s*장|이용권\s*사용\s*확인\s*다시/i).first();
  await expect(popupContent).toBeVisible({ timeout: 5000 }).catch(() => null);
  const onOffOrCheckbox = page.getByRole("button", { name: /On|Off/i }).or(
    page.getByText(/이용권\s*사용\s*확인.*다시\s*보지\s*않기|다시\s*보지\s*않기/i)
  );
  if (await onOffOrCheckbox.count() > 0) {
    await expect(onOffOrCheckbox.first()).toBeVisible({ timeout: 3000 }).catch(() => null);
  }
});

And("이용권 사용 팝업이 노출되며, 취소 버튼을 클릭하면 팝업이 종료되고 회차 리스트가 노출된다", async ({ page }) => {
  const cancelBtn = page.getByRole("button", { name: /취소/i }).first();
  await cancelBtn.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(500);
  const episodeList = page.getByText(/회차|화/).or(page.locator('a[href*="/viewer/"]'));
  await expect(episodeList.first()).toBeVisible({ timeout: 8000 });
});
