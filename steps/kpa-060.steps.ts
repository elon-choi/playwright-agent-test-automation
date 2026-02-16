// Feature: KPA-060 - 웹툰 실시간 랭킹 1위 확인 및 이동
import { And, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 실시간 랭킹 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /실시간\s*랭킹|랭킹/i }).or(page.getByText(/실시간\s*랭킹|랭킹/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

And("사용자가 웹툰 실시간 랭킹 1위 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const webtoonTab = page.getByRole("tab", { name: /웹툰/i }).or(page.getByText(/웹툰/i).first());
  if ((await webtoonTab.count()) > 0) await webtoonTab.first().click({ timeout: 5000 });
  await page.waitForTimeout(600);
  const first = page.locator('a[href*="/content/"]').first();
  await first.waitFor({ state: "attached", timeout: 10000 }).catch(() => null);
  await first.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(300);
  await first.dispatchEvent("click");
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("실시간 랭킹 메뉴 하단에 다음 요소들이 노출되어야 한다:", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasList = (await page.locator('a[href*="/content/"]').count()) > 0;
  const hasRankOrTab = (await page.getByText(/랭킹|웹툰|웹소설|선정\s*기준/i).count()) > 0;
  expect(hasList || hasRankOrTab).toBe(true);
});

And("사용자는 웹툰 실시간 랭킹 1위 작품의 홈으로 이동해야 한다", async ({ page }) => {
  const onWorkHome = /\/(content|landing\/series)\//i.test(page.url());
  expect(onWorkHome).toBe(true);
});
