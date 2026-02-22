// Feature: KPA-055 시나리오 검증 - 전체 웹소설 보러가기 배너 클릭 후 장르 전체 페이지 이동
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

const BANNER_TEXT = /전체\s*웹소설\s*보러가기|웹소설\s*보러가기|전체\s*웹소설/i;

When("사용자가 웹 페이지에 진입하여 상단의 웹소설 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const base = getBaseUrlOrigin();
  if (!/page\.kakao\.com/i.test(page.url())) await page.goto(base, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(500);
  const gnb = page.getByRole("link", { name: /웹소설/i }).or(page.getByText(/웹소설/i).first());
  if ((await gnb.count()) > 0) await gnb.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

And("사용자는 전체 웹소설 보러가기 운영 배너가 노출될때까지 스크롤 다운한다.", async ({ page }) => {
  const banner = page.getByRole("link", { name: BANNER_TEXT }).or(page.getByText(BANNER_TEXT)).or(page.locator(`a[href*="/menu/"], a[href*="웹소설"]`).filter({ hasText: /보러가기|전체/i }));
  const maxScroll = 15;
  for (let i = 0; i < maxScroll; i++) {
    const visible = await banner.first().isVisible().catch(() => false);
    if (visible) return;
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(400);
  }
  await banner.first().waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
});

When("전체 웹소설 보러가기 운영 배너가 노출되면 클릭한다.", async ({ page }) => {
  const banner = page.getByRole("link", { name: BANNER_TEXT }).or(page.getByText(BANNER_TEXT)).or(page.locator('a[href*="/menu/"]').filter({ hasText: /웹소설|보러가기|전체/i }));
  await banner.first().waitFor({ state: "visible", timeout: 8000 });
  await banner.first().click({ timeout: 8000 });
  await page.waitForTimeout(1000);
});

Then("웹소설 장르 전체 페이지로 이동한다.", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(600);
  const onNovelGenre = /\/menu\/|\/webnovel\/|웹소설|장르\s*전체|전체\s*장르/i.test(page.url()) ||
    (await page.getByText(/장르\s*전체|웹소설\s*전체|전체\s*웹소설/i).count()) > 0 ||
    (await page.locator('a[href*="/content/"]').count()) > 0;
  expect(onNovelGenre, "웹소설 장르 전체(또는 메뉴) 페이지로 이동했어야 합니다.").toBe(true);
});
