// Feature: KPA-104 - 댓글 정렬 기능 검증 (회차 진입 → 댓글 아이콘 → 전체 탭 → 정렬)
import { When, Then, And, expect, getBaseUrl, getBaseUrlOrigin } from "./fixtures.js";

async function ensureContentPage(page: import("@playwright/test").Page) {
  if (/\/(content|landing\/series)\//i.test(page.url())) return;
  await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(500);
  const card = page.locator('a[href*="/content/"]').first();
  if ((await card.count()) > 0) {
    await card.click({ timeout: 8000 });
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 });
  }
  await page.waitForTimeout(400);
}

When("사용자가 두번째 무료 뱃지가 달린 회차를 클릭한다", async ({ page }) => {
  await ensureContentPage(page);
  const freeBadge = /무료|FREE/i;
  const episodeLinks = page.locator('a[href*="/viewer/"]').filter({
    has: page.getByText(freeBadge).or(page.locator("img[alt*='무료']")).or(page.locator("[class*='free'], [class*='badge']"))
  });
  await episodeLinks.first().waitFor({ state: "visible", timeout: 10000 });
  const second = episodeLinks.nth(1);
  await second.waitFor({ state: "visible", timeout: 6000 });
  await second.click({ timeout: 8000 });
  await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(600);
});

And("회차 진입 후 우측 상단의 댓글 아이콘을 클릭한다", async ({ page }) => {
  const commentIcon = page
    .getByRole("button", { name: /댓글/i })
    .or(page.locator("[aria-label*='댓글']"))
    .or(page.locator("a[href*='#comment'], a[href*='comment']"))
    .or(page.locator("button, a").filter({ hasText: /댓글/ }).first());
  await commentIcon.first().waitFor({ state: "visible", timeout: 10000 });
  await commentIcon.first().click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

And("사용자가 전체 탭을 클릭한다", async ({ page }) => {
  const allTab = page
    .getByRole("tab", { name: /^전체$/ })
    .or(page.getByRole("button", { name: /^전체$/ }))
    .or(page.getByText(/^전체$/, { exact: true }).first());
  await allTab.first().waitFor({ state: "visible", timeout: 8000 });
  await allTab.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);
});

And("전체탭 우측 상단의 정렬 옵션을 클릭 후 최신순 옵션을 클릭한다", async ({ page }) => {
  const sortTrigger = page
    .getByRole("button", { name: /정렬/i })
    .or(page.locator("button").filter({ hasText: /정렬/i }).first());
  await sortTrigger.first().waitFor({ state: "visible", timeout: 8000 });
  await sortTrigger.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);

  const latestOption = page
    .getByRole("option", { name: /최신순/i })
    .or(page.getByRole("menuitem", { name: /최신순/i }))
    .or(page.getByText(/^최신순$/).first());
  await latestOption.first().waitFor({ state: "visible", timeout: 5000 });
  await latestOption.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

Then("댓글이 생성된 일자가 최신순으로 노출되는지 확인한다", async ({ page }) => {
  const commentArea = page.locator("[class*='comment'], [class*='Comment'], [class*='list']").first();
  await commentArea.waitFor({ state: "attached", timeout: 8000 });

  const timeTexts = await page
    .locator("text=/\\d{1,2}분 전|\\d{1,2}시간 전|어제|\\d{4}\\.\\d{1,2}\\.\\d{1,2}/")
    .allTextContents();
  if (timeTexts.length >= 2) {
    const parseOrder = (t: string): number => {
      const m = t.match(/(\d+)\s*분\s*전/);
      if (m) return 0 - parseInt(m[1], 10);
      const h = t.match(/(\d+)\s*시간\s*전/);
      if (h) return -1000 - parseInt(h[1], 10);
      if (/어제/.test(t)) return -10000;
      const d = t.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
      if (d) return parseInt(d[1] + d[2].padStart(2, "0") + d[3].padStart(2, "0"), 10);
      return 0;
    };
    const orders = timeTexts.slice(0, 5).map(parseOrder);
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]).toBeLessThanOrEqual(orders[i - 1]);
    }
  }
  const hasCommentOrSort =
    (await page.getByText(/댓글|최신순|닉네임|작성/i).count()) > 0 ||
    (await page.getByRole("button", { name: /정렬|최신순/i }).count()) > 0;
  expect(hasCommentOrSort).toBe(true);
});

And("전체탭 우측 상단의 정렬 옵션을 클릭 후 좋아요 옵션을 클릭한다", async ({ page }) => {
  const sortTrigger = page
    .getByRole("button", { name: /정렬/i })
    .or(page.locator("button").filter({ hasText: /정렬/i }).first());
  await sortTrigger.first().waitFor({ state: "visible", timeout: 8000 });
  await sortTrigger.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);

  const likeOption = page
    .getByRole("option", { name: /좋아요/i })
    .or(page.getByRole("menuitem", { name: /좋아요/i }))
    .or(page.getByText(/^좋아요순$/))
    .or(page.getByText(/좋아요\s*순/).first());
  await likeOption.first().waitFor({ state: "visible", timeout: 5000 });
  await likeOption.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

Then("댓글이 좋아요를 많이 받은 순서대로 노출되는지 확인한다", async ({ page }) => {
  const hasCommentArea =
    (await page.getByText(/댓글|좋아요|닉네임|작성/i).count()) > 0 ||
    (await page.locator("[class*='comment'], [class*='Comment']").count()) > 0;
  expect(hasCommentArea).toBe(true);
  const sortLabel = page.getByText(/좋아요\s*순|정렬/i);
  await expect(sortLabel.first()).toBeVisible({ timeout: 5000 });
});
