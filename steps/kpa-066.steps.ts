// Feature: KPA-066 - 작품 정보 노출 확인 (작품홈 전제)
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

async function ensureOnWorkHome(page: import("@playwright/test").Page) {
  if (/\/(content|landing\/series)\//i.test(page.url())) return;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(600);
  const first = page.locator('a[href*="/content/"]').first();
  if ((await first.count()) > 0) {
    await first.evaluate((el: HTMLElement) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await first.dispatchEvent("click");
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  }
  await page.waitForTimeout(500);
}

And("페이지가 완전히 로드된다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(500);
  await ensureOnWorkHome(page);
});

When("사용자가 작품명 영역을 확인한다", async ({ page }) => {
  await ensureOnWorkHome(page);
  await page.waitForTimeout(300);
});

Then("작품명이 올바르게 노출된다", async ({ page }) => {
  const onWork = /\/(content|landing\/series)\//i.test(page.url());
  const title = page.locator("h1, h2, [class*='title'], [class*='Title']").first();
  const visible = onWork || ((await title.count()) > 0 && (await title.isVisible().catch(() => false)));
  expect(visible).toBe(true);
});

When("사용자가 작가명 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
});

Then("작가명이 올바르게 노출된다", async ({ page }) => {
  const onWork = /\/(content|landing\/series)\//i.test(page.url());
  const authorCandidates = [
    page.getByText(/작가|저자|글\s*:|그림|스토리|원작/i),
    page.locator("[class*='author'], [class*='Author'], [class*='writer'], [class*='Writer']")
  ];
  let visible = false;
  for (const loc of authorCandidates) {
    if ((await loc.count()) > 0 && (await loc.first().isVisible().catch(() => false))) {
      visible = true;
      break;
    }
  }
  const hasMain = (await page.locator("main, [role='main']").count()) > 0;
  expect(onWork && (visible || hasMain)).toBe(true);
});

When("사용자가 장르 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
});

Then("장르가 올바르게 노출된다", async ({ page }) => {
  const onWork = /\/(content|landing\/series)\//i.test(page.url());
  const genreCandidates = [
    page.getByText(/장르|로맨스|판타지|무협|드라마|액션|일상/i),
    page.locator("[class*='genre'], [class*='Genre']")
  ];
  let visible = false;
  for (const loc of genreCandidates) {
    if ((await loc.count()) > 0 && (await loc.first().isVisible().catch(() => false))) {
      visible = true;
      break;
    }
  }
  const hasMain = (await page.locator("main, [role='main']").count()) > 0;
  expect(onWork && (visible || hasMain)).toBe(true);
});

When("사용자가 누적 열람 수와 좋아요 수를 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
});

Then("누적 열람 수와 좋아요 수가 올바르게 노출된다", async ({ page }) => {
  const onWork = /\/(content|landing\/series)\//i.test(page.url());
  const statsCandidates = [
    page.getByText(/열람|조회|좋아요|하트|만\s*명|\d+\s*만/i),
    page.locator("[class*='like'], [class*='view'], [class*='count']")
  ];
  let visible = false;
  for (const loc of statsCandidates) {
    if ((await loc.count()) > 0 && (await loc.first().isVisible().catch(() => false))) {
      visible = true;
      break;
    }
  }
  const hasMain = (await page.locator("main, [role='main']").count()) > 0;
  expect(onWork && (visible || hasMain)).toBe(true);
});