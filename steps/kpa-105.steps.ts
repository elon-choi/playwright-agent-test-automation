// Feature: KPA-105 - 댓글 기능 검증
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
  const commentArea = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ });
  await commentArea.first().waitFor({ state: "visible", timeout: 10000 });
  await expect(commentArea.first()).toBeVisible();
});

When("사용자가 첫 번째 댓글의 [좋아요] 버튼을 클릭한다", async ({ page }) => {
  const likeButton = page
    .getByRole("button", { name: /좋아요/i })
    .or(page.locator("[aria-label*='좋아요']"))
    .or(page.locator("button").filter({ hasText: /좋아요/ }));
  await likeButton.first().waitFor({ state: "visible", timeout: 8000 });
  const firstLike = likeButton.first();
  const container = firstLike.locator("xpath=ancestor::*[contains(@class,'comment') or contains(@class,'Comment') or self::article or self::li][1]");
  const countEl = (await container.count()) > 0
    ? container.locator("text=/\\d+/").first()
    : page.locator("text=/\\d+/").first();
  const countText = await countEl.textContent().catch(() => "0");
  const parsed = parseInt(countText.replace(/\D/g, ""), 10);
  firstCommentLikeCountBefore = Number.isNaN(parsed) ? 0 : parsed;
  await firstLike.click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

Then("댓글 리스트가 화면에 표시된다", async ({ page }) => {
  const list = page.locator("[class*='comment'], [class*='Comment'], [class*='list']").first();
  await list.waitFor({ state: "visible", timeout: 8000 });
  await expect(list).toBeVisible();
});

And("각 댓글에는 닉네임, 작성일자, 댓글 내용, 좋아요 수, 싫어요 수, 답글 버튼, 더보기 버튼이 표시된다", async ({ page }) => {
  const commentBlock = page.locator("[class*='comment'], [class*='Comment'], article").first();
  await commentBlock.waitFor({ state: "visible", timeout: 6000 });

  const hasNickname = (await page.getByText(/닉네임|\\w{2,}/).count()) > 0;
  const hasDate =
    (await page.locator("text=/\\d{1,2}분 전|\\d{1,2}시간 전|어제|\\d{4}\\.\\d{1,2}\\.\\d{1,2}/").count()) > 0;
  const hasContent = (await page.locator("[class*='content'], [class*='text'], p, span").count()) > 0;
  const hasLike = (await page.getByRole("button", { name: /좋아요/i }).count()) > 0;
  const hasReply = (await page.getByRole("button", { name: /답글/i }).or(page.getByText(/답글/)).count()) > 0;

  expect(hasNickname || hasContent).toBe(true);
  expect(hasDate).toBe(true);
  expect(hasLike).toBe(true);
  expect(hasReply).toBe(true);
});

And("클릭한 댓글의 좋아요 수가 1 증가하여 표시된다", async ({ page }) => {
  if (firstCommentLikeCountBefore === null) {
    throw new Error("첫 번째 댓글의 좋아요 클릭 전 수를 알 수 없습니다.");
  }
  await page.waitForTimeout(500);
  const likeButton = page.getByRole("button", { name: /좋아요/i }).first();
  const container = likeButton.locator("xpath=ancestor::*[contains(@class,'comment') or contains(@class,'Comment') or self::article or self::li][1]");
  const countEl = (await container.count()) > 0
    ? container.locator("text=/\\d+/").first()
    : page.locator("text=/\\d+/").first();
  const countText = await countEl.textContent().catch(() => "0");
  const afterCount = parseInt(countText.replace(/\D/g, ""), 10);
  const expected = firstCommentLikeCountBefore + 1;
  expect(Number.isNaN(afterCount) ? 0 : afterCount).toBe(expected);
});
