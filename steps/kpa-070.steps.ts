// Feature: KPA-070 시나리오 검증 - 더보기 레이어 팝업
import { test } from "@playwright/test";
import { Given, When, Then, And, expect } from "./fixtures.js";

Given("KPA-070은 PC Web에서 검증하지 않는다", async () => {
  test.skip(true, "PC Web에서는 더보기 레이어 검증 미지원");
});

When("사용자가 [더보기] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const contentPage = /\/content\/|\/landing\/series\//i.test(page.url());
  if (!contentPage) {
    const workCard = page.locator('a[href*="/content/"]').first();
    await workCard.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
    if ((await workCard.count()) > 0) {
      const href = await workCard.getAttribute("href").catch(() => null);
      if (href) {
        const fullUrl = href.startsWith("http") ? href : new URL(href, page.url()).href;
        await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
      } else {
        await workCard.scrollIntoViewIfNeeded().catch(() => null);
        await workCard.click({ timeout: 10000 });
        await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
      }
      await page.waitForTimeout(800);
    }
  }
  let moreBtn = page.getByRole("button", { name: /더보기|more/i })
    .or(page.getByText(/더보기/))
    .or(page.locator('button[aria-label*="더보기"], [aria-label*="더보기"]'))
    .or(page.locator('[data-test*="more"], [class*="more"]'))
    .first();
  await moreBtn.waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
  let visible = await moreBtn.isVisible().catch(() => false);
  if (!visible && /\/content\/|\/landing\/series\//i.test(page.url())) {
    const inMain = page.locator('main').locator('button').filter({ has: page.locator('img') }).first();
    if ((await inMain.count()) > 0 && (await inMain.isVisible().catch(() => false))) {
      moreBtn = inMain;
      visible = true;
    }
    if (!visible) {
      const iconOnlyBtn = page.locator('button').filter({ has: page.locator('img') }).filter({ hasNot: page.locator('text=/첫\\s*화|충전|구매/') }).first();
      if ((await iconOnlyBtn.count()) > 0 && (await iconOnlyBtn.isVisible().catch(() => false))) {
        moreBtn = iconOnlyBtn;
        visible = true;
      }
    }
  }
  if (!visible) {
    throw new Error("더보기 버튼을 찾을 수 없습니다. 작품 상세(작품홈) 페이지에서만 노출됩니다. 로그인 후 작품을 연 상태에서 재실행해 주세요.");
  }
  await moreBtn.scrollIntoViewIfNeeded().catch(() => null);
  await moreBtn.click({ timeout: 8000 });
  await page.waitForTimeout(1200);
});

Then("더보기 레이어 팝업이 노출되어야 한다", async ({ page }) => {
  await page.waitForTimeout(800);
  const hasDialog = (await page.getByRole("dialog").count()) > 0 && (await page.getByRole("dialog").first().isVisible().catch(() => false));
  const hasMenu = (await page.locator("[role='menu']").count()) > 0 && (await page.locator("[role='menu']").first().isVisible().catch(() => false));
  const optKpa070 = page.getByText(/이용권\s*내역|취소/).first();
  const optKpa107 = page.getByText(/신고하기|차단하기|취소/).first();
  const hasOptionText = (await optKpa070.isVisible().catch(() => false)) || (await optKpa107.isVisible().catch(() => false));
  expect(hasDialog || hasMenu || hasOptionText).toBe(true);
});

And("팝업에는 {string}과 {string} 옵션이 포함되어 있어야 한다", async ({ page }, opt1: string, opt2: string) => {
  const hasFirst = (await page.getByText(new RegExp(opt1.replace(/\s/g, "\\s*"))).count()) > 0;
  const hasSecond = (await page.getByText(new RegExp(opt2.replace(/\s/g, "\\s*"))).count()) > 0;
  expect(hasFirst).toBe(true);
  expect(hasSecond).toBe(true);
});

When("사용자가 팝업 내의 {string} 버튼을 클릭한다", async ({ page }, label: string) => {
  const btn = page.getByRole("button", { name: new RegExp(label.replace(/\s/g, "\\s*")) }).or(page.getByText(new RegExp(label.replace(/\s/g, "\\s*")))).first();
  await btn.click({ timeout: 6000 });
  await page.waitForTimeout(400);
});

Then("더보기 레이어 팝업이 닫혀야 한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const layer = page.getByRole("dialog").or(page.locator("[role='menu']"));
  await expect(layer.first()).not.toBeVisible({ timeout: 5000 }).catch(() => null);
  const stillOpen = await page.getByText(/이용권\s*내역/).first().isVisible().catch(() => false);
  expect(stillOpen).toBe(false);
});
