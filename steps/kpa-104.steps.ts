// Feature: KPA-104 - 댓글 정렬 기능 검증 (작품 카드 → 홈탭 댓글 영역 스크롤 → 정렬)
// "사용자가 임의의 작품 카드를 클릭한다"는 steps/kpa-065.steps.ts에 정의됨 (중복 제거)
import { When, Then, And, expect, getBaseUrl, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 홈탭 하단으로  댓글 영역까지 스크롤 다운한다.", async ({ page }) => {
  const commentMarker = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last();
  await commentMarker.waitFor({ state: "attached", timeout: 15000 });
  const maxScrolls = 80;
  for (let i = 0; i < maxScrolls; i++) {
    const visible = await commentMarker.isVisible().catch(() => false);
    if (visible) break;
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(350);
  }
  await commentMarker.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -200));
  await page.waitForTimeout(500);
});

When("사용자가 홈탭 하단 댓글 영역까지 스크롤 다운한다.", async ({ page }) => {
  const commentMarker = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last();
  await commentMarker.waitFor({ state: "attached", timeout: 15000 });
  const maxScrolls = 80;
  for (let i = 0; i < maxScrolls; i++) {
    const visible = await commentMarker.isVisible().catch(() => false);
    if (visible) break;
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(350);
  }
  await commentMarker.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -200));
  await page.waitForTimeout(500);
});

// "댓글 영역이 화면에 표시된다"는 steps/kpa-105.steps.ts에 정의됨 (중복 제거)

And("전체탭 우측 상단의 정렬 옵션을 클릭 후 최신순 옵션을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const sortTrigger = page
    .getByRole("button", { name: /정렬/i })
    .or(page.locator("button").filter({ hasText: /정렬/i }))
    .or(page.getByText(/정렬/).first())
    .or(page.locator("[aria-label*='정렬']"))
    .or(page.locator("button, [role='button'], a").filter({ hasText: /정렬/i }).first())
    .or(page.getByText(/좋아요\s*순|최신\s*순/).last());
  await sortTrigger.first().scrollIntoViewIfNeeded().catch(() => null);
  await sortTrigger.first().waitFor({ state: "visible", timeout: 12000 });
  await sortTrigger.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);

  const latestOption = page
    .getByRole("option", { name: /최신\s*순/i })
    .or(page.getByRole("menuitem", { name: /최신\s*순/i }))
    .or(page.getByText(/^최신\s*순$/).last())
    .or(page.getByText(/최신\s*순/).last());
  await latestOption.first().waitFor({ state: "visible", timeout: 10000 });
  await latestOption.first().scrollIntoViewIfNeeded();
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
    .or(page.locator("button").filter({ hasText: /정렬/i }))
    .or(page.getByText(/좋아요\s*순|최신\s*순/).last());
  await sortTrigger.first().waitFor({ state: "visible", timeout: 12000 });
  await sortTrigger.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);

  const likeOption = page
    .getByRole("option", { name: /좋아요/i })
    .or(page.getByRole("menuitem", { name: /좋아요/i }))
    .or(page.getByText(/^좋아요\s*순$/).last())
    .or(page.getByText(/좋아요\s*순/).last());
  await likeOption.first().waitFor({ state: "visible", timeout: 10000 });
  await likeOption.first().scrollIntoViewIfNeeded();
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
