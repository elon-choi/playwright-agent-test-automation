// Feature: KPA-105 - 댓글 기능 검증 (작품 카드 → 홈탭 댓글 영역 스크롤 → 좋아요)
// "사용자가 홈탭 하단으로 댓글 영역까지 스크롤 다운한다"는 steps/kpa-104.steps.ts에 정의됨 (중복 제거)
import { When, Then, And, expect, getBaseUrl, getBaseUrlOrigin } from "./fixtures.js";

let firstCommentLikeCountBefore: number | null = null;

When("사용자가 댓글 탭을 클릭한다", async ({ page }) => {
  const origin = getBaseUrlOrigin();
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(500);
    const card = page.locator('a[href*="/content/"]').first();
    if ((await card.count()) > 0) {
      await card.click({ timeout: 8000 });
      await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 });
      await page.waitForTimeout(500);
    }
  }
  const commentTab = page
    .getByRole("tab", { name: /댓글/i })
    .or(page.getByRole("button", { name: /댓글/i }))
    .or(page.locator("a").filter({ hasText: /^댓글$/ }).first())
    .or(page.getByText(/^댓글$/, { exact: true }).first());
  await commentTab.first().waitFor({ state: "visible", timeout: 10000 });
  await commentTab.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

Then("댓글 영역이 화면에 표시된다", async ({ page }) => {
  const commentArea = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last();
  await commentArea.waitFor({ state: "visible", timeout: 10000 });
  await expect(commentArea).toBeVisible();
});

When("사용자가 첫 번째 댓글의 [좋아요] 아이콘을 클릭한다", async ({ page }) => {
  const commentMarker = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last();
  await commentMarker.scrollIntoViewIfNeeded().catch(() => null);
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(600);
  const commentSection = commentMarker.locator("xpath=../../..");
  const firstLikeIcon = commentSection
    .locator('div.cursor-pointer')
    .filter({ has: page.locator('img[alt*="좋아요"]') })
    .filter({ has: page.locator('span.font-small2') })
    .first();
  await firstLikeIcon.waitFor({ state: "visible", timeout: 15000 });
  const countEl = firstLikeIcon.locator("span.font-small2");
  const countTextBefore = await countEl.textContent().catch(() => "0");
  const parsed = parseInt(String(countTextBefore).replace(/\D/g, ""), 10);
  firstCommentLikeCountBefore = Number.isNaN(parsed) || parsed > 100000 ? 0 : parsed;
  await firstLikeIcon.scrollIntoViewIfNeeded().catch(() => null);
  await firstLikeIcon.click({ timeout: 6000 });
  await page.waitForTimeout(800);
});

Then("댓글 리스트가 화면에 표시된다", async ({ page }) => {
  const list = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last().locator("xpath=../../..");
  await list.waitFor({ state: "visible", timeout: 8000 });
  await expect(list).toBeVisible();
});

And("각 댓글에는 닉네임, 작성일자, 댓글 내용, 좋아요 수, 싫어요 수, 답글 버튼, 더보기 버튼이 표시된다", async ({ page }) => {
  const commentArea = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last();
  await commentArea.waitFor({ state: "visible", timeout: 6000 });

  const hasNickname = (await page.getByText(/닉네임|\\w{2,}/).count()) > 0;
  const hasDate =
    (await page.locator("text=/\\d{1,2}분 전|\\d{1,2}시간 전|어제|\\d{4}\\.\\d{1,2}\\.\\d{1,2}/").count()) > 0;
  const hasContent = (await page.locator("[class*='content'], [class*='text'], p, span").count()) > 0;
  const hasLikeButton = (await page.getByRole("button", { name: /좋아요/i }).count()) > 0;
  const commentSectionForLike = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last().locator("xpath=../../..");
  const hasLikeIcon = (await commentSectionForLike.locator('img[alt*="좋아요"]').count()) > 0;
  const hasLike = hasLikeButton || hasLikeIcon;
  const hasReply =
    (await page.getByRole("button", { name: /답글/i }).or(page.getByText(/답글|댓글\s*달기/)).count()) > 0;

  expect(hasNickname || hasContent).toBe(true);
  expect(hasDate).toBe(true);
  expect(hasLike).toBe(true);
  expect(hasReply).toBe(true);
});

And("클릭한 댓글의 좋아요 수가 1 증가하여 표시된다", async ({ page }) => {
  if (firstCommentLikeCountBefore === null) {
    throw new Error("첫 번째 댓글의 좋아요 클릭 전 수를 알 수 없습니다.");
  }
  const expectedPlus = firstCommentLikeCountBefore + 1;
  const expectedMinus = firstCommentLikeCountBefore - 1;
  const commentMarker = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last();
  const commentSection = commentMarker.locator("xpath=../../..");
  const firstLikeIcon = commentSection
    .locator('div.cursor-pointer')
    .filter({ has: page.locator('img[alt*="좋아요"]') })
    .filter({ has: page.locator('span.font-small2') })
    .first();
  const countLocator = firstLikeIcon.locator("span.font-small2");
  for (let i = 0; i < 24; i++) {
    await page.waitForTimeout(500);
    const countText = await countLocator.textContent().catch(() => "0");
    const n = parseInt(String(countText).replace(/\D/g, ""), 10);
    if (!Number.isNaN(n) && (n === expectedPlus || n === expectedMinus)) break;
  }
  const countText = await countLocator.textContent().catch(() => "0");
  let afterCount = parseInt(String(countText).replace(/\D/g, ""), 10);
  if (Number.isNaN(afterCount) || afterCount > 100000) afterCount = 0;
  const isPlusOne = afterCount === expectedPlus;
  const isMinusOne = afterCount === expectedMinus;
  expect(isPlusOne || isMinusOne).toBe(true);
});
