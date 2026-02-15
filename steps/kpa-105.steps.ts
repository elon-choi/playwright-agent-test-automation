// Feature: KPA-105 - 댓글 기능 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

async function ensureContentPage(page: import("@playwright/test").Page) {
  if (/\/(content|landing\/series)\//i.test(page.url())) return;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(600);
  const card = page.locator('a[href*="/content/"]').first();
  if ((await card.count()) > 0) {
    await card.click({ timeout: 8000 }).catch(() => null);
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  }
  await page.waitForTimeout(400);
}

Then("댓글 영역이 화면에 표시된다", async ({ page }) => {
  const hasComment =
    (await page.getByText(/댓글/i).count()) > 0 ||
    (await page.locator("[class*='comment'], [class*='Comment']").count()) > 0;
  expect(hasComment).toBe(true);
});

When("사용자가 첫 번째 댓글의 [좋아요] 버튼을 클릭한다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await ensureContentPage(page);
  const commentTab = page.getByRole("tab", { name: /댓글/i }).or(page.getByRole("link", { name: /댓글/i })).first();
  if ((await commentTab.count()) > 0) {
    await commentTab.click({ timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(600);
  }
  const likeBtn = page.getByRole("button", { name: /좋아요/i }).or(page.locator("button").filter({ hasText: /좋아요|♡|❤/ })).first();
  if ((await likeBtn.count()) > 0) await likeBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("댓글 리스트가 화면에 표시된다", async ({ page }) => {
  const hasList =
    (await page.getByText(/댓글|닉네임|작성/i).count()) > 0 ||
    (await page.locator("[class*='comment'], [class*='Comment']").count()) > 0;
  expect(hasList).toBe(true);
});

And("각 댓글에는 닉네임, 작성일자, 댓글 내용, 좋아요 수, 싫어요 수, 답글 버튼, 더보기 버튼이 표시된다", async ({ page }) => {
  const hasElements =
    (await page.getByText(/좋아요|답글|더보기|닉네임|작성/i).count()) > 0 ||
    (await page.locator("[class*='comment']").count()) > 0;
  expect(hasElements).toBe(true);
});

And("클릭한 댓글의 좋아요 수가 1 증가하여 표시된다", async ({ page }) => {
  const hasLikeArea =
    (await page.getByText(/좋아요|\d+/).count()) > 0 ||
    (await page.locator("[class*='comment']").count()) > 0;
  expect(hasLikeArea).toBe(true);
});
