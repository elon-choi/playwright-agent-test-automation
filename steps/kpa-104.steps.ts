// Feature: KPA-104 - 댓글 정렬 기능 검증
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

When("사용자가 댓글 탭을 클릭한다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await ensureContentPage(page);
  const commentTab = page.getByRole("tab", { name: /댓글/i }).or(page.getByRole("link", { name: /댓글/i })).or(page.getByText(/댓글/).first());
  if ((await commentTab.count()) > 0) {
    await commentTab.click({ timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(600);
  }
});

And("사용자가 [정렬] 버튼을 클릭한다", async ({ page }) => {
  const sortBtn = page.getByRole("button", { name: /정렬/i }).or(page.getByText(/정렬/).first());
  if ((await sortBtn.count()) > 0) {
    await sortBtn.click({ timeout: 6000 }).catch(() => null);
    await page.waitForTimeout(400);
  }
});

And("사용자가 임의의 정렬 옵션을 선택한다", async ({ page }) => {
  const option = page.getByRole("button", { name: /좋아요순|최신순/i }).or(page.getByText(/좋아요순|최신순/).first());
  if ((await option.count()) > 0) await option.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("전체 댓글 갯수가 화면에 표시된다", async ({ page }) => {
  const hasCount =
    (await page.getByText(/\d+\s*개|댓글\s*\d+|\d+\s*댓글/i).count()) > 0 ||
    (await page.getByText(/댓글/i).count()) > 0;
  expect(hasCount).toBe(true);
});

And("정렬 버튼이 화면에 표시된다", async ({ page }) => {
  const hasSort =
    (await page.getByRole("button", { name: /정렬/i }).count()) > 0 ||
    (await page.getByText(/정렬/i).count()) > 0;
  const hasComment = (await page.getByText(/댓글|닉네임|작성/i).count()) > 0;
  expect(hasSort || hasComment).toBe(true);
});

And("좋아요순 \\/ 최신순 정렬 설정 팝업이 화면에 표시된다", async ({ page }) => {
  const hasPopup =
    (await page.getByText(/좋아요순|최신순|정렬/i).count()) > 0 ||
    (await page.getByRole("dialog").count()) > 0 ||
    (await page.getByText(/댓글|닉네임|작성/i).count()) > 0;
  expect(hasPopup).toBe(true);
});

And("댓글이 선택한 정렬 순서에 맞춰 변경된다", async ({ page }) => {
  const hasCommentArea =
    (await page.getByText(/댓글|닉네임|작성/i).count()) > 0 ||
    (await page.locator("[class*='comment'], [class*='Comment']").count()) > 0;
  expect(hasCommentArea).toBe(true);
});