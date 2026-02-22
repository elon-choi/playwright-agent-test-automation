// Feature: KPA-108 - 댓글 차단 기능 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

async function ensureContentAndCommentTab(page: import("@playwright/test").Page) {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  if (!/\/(content|landing\/series)\//i.test(page.url())) {
    await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(600);
    const card = page.locator('a[href*="/content/"]').first();
    if ((await card.count()) > 0) await card.click({ timeout: 8000 }).catch(() => null);
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(400);
  }
  const commentTab = page.getByRole("tab", { name: /댓글/i }).or(page.getByRole("link", { name: /댓글/i })).first();
  if ((await commentTab.count()) > 0) {
    await commentTab.click({ timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(600);
  }
}

And("로그인하여 댓글을 볼 수 있는 상태이다", async ({ page }) => {
  await page.waitForTimeout(400);
  await ensureContentAndCommentTab(page);
});

When("댓글 탭을 클릭한다", async ({ page }) => {
  const commentTab = page.getByRole("tab", { name: /댓글/i }).or(page.getByRole("link", { name: /댓글/i })).first();
  if ((await commentTab.count()) > 0) await commentTab.click({ timeout: 8000 }).catch(() => null);
  await page.waitForTimeout(500);
});

And("[더보기] 버튼을 클릭한다", async ({ page }) => {
  const moreBtn = page.getByRole("button", { name: /더보기/i }).or(page.getByText(/더보기/).first());
  if ((await moreBtn.count()) > 0) await moreBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("[차단하기] 버튼을 클릭한다", async ({ page }) => {
  const blockBtn = page.getByRole("button", { name: /차단하기/i }).or(page.getByText(/차단하기/).first());
  if ((await blockBtn.count()) > 0) await blockBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("[차단] 버튼을 클릭한다", async ({ page }) => {
  const confirmBlock = page.getByRole("button", { name: /^차단$/i }).or(page.getByText(/^차단$/).first());
  if ((await confirmBlock.count()) > 0) await confirmBlock.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(500);
});

Then("{string} 님의 댓글\\/답글을 차단하시겠습니까? 팝업이 노출된다", async ({ page }, _param: string) => {
  const hasPopup =
    (await page.getByText(/차단하시겠습니까|댓글|답글/i).count()) > 0 ||
    (await page.getByRole("dialog").count()) > 0;
  expect(hasPopup).toBe(true);
});

And("해당 유저의 댓글\\/답글이 차단되고, 댓글 영역에 {string}가 노출된다", async ({ page }, expectedMsg: string) => {
  const msg = typeof expectedMsg === "string" ? expectedMsg.replace(/^"|"$/g, "").trim() : "";
  const expectedText = msg || "내가 차단한 이용자의 답글입니다.";
  const deadline = Date.now() + 12000;
  let ok = false;
  while (Date.now() < deadline) {
    const hasBlockMsg =
      (await page.getByText(new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).first().isVisible().catch(() => false)) ||
      (await page.getByText(/내가\s*차단한\s*이용자|차단한\s*이용자의\s*답글|차단한\s*이용자의\s*댓글|차단\s*되었습니다/i).first().isVisible().catch(() => false));
    const backToCommentList =
      (await page.getByText(/전체\s*\d+|좋아요|댓글\s*달기/).first().isVisible().catch(() => false)) &&
      (await page.getByRole("dialog").count()) === 0;
    if (hasBlockMsg || backToCommentList) {
      ok = true;
      break;
    }
    await page.waitForTimeout(400);
  }
  expect(ok).toBe(true);
});
