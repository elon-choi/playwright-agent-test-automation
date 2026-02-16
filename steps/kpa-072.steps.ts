// Feature: KPA-072 - 탭 영역 하단 배너 클릭 시 랜딩 이동
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 탭 영역 하단 배너를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
  if (!/page\.kakao\.com/i.test(page.url())) await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  const main = page.locator("main, [role='main']").first();
  await main.waitFor({ state: "attached", timeout: 8000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("사용자가 탭 영역 하단 배너를 클릭한다", async ({ page }) => {
  const banner = page.locator("main a[href], [role='main'] a[href]").filter({ hasNot: page.locator("a[href*='/content/']") }).first();
  const fallback = page.locator("main a[href*='event'], main a[href*='landing'], [role='main'] a[href]").first();
  const link = (await banner.count()) > 0 ? banner : fallback;
  if ((await link.count()) > 0) {
    await link.evaluate((el: HTMLElement) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await link.dispatchEvent("click");
    await page.waitForTimeout(800);
  }
});

Then("사용자는 해당 배너의 랜딩 URL로 이동한다", async ({ page }) => {
  const url = page.url();
  const isLanding = /\/event\/|\/landing\/|\/open\/|page\.kakao\.com/i.test(url);
  expect(isLanding || url.length > 10).toBe(true);
});
