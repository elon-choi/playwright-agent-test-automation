// Feature: KPA-093 시나리오 검증 - 회차 리스트와 뷰어 이동
import { And, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";
import { getEpisodeListScope } from "./common.episode.steps.js";

And("사용자가 무료 회차와 일반 회차가 있는 페이지에 도달한다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요할 수 있습니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  if (/\/content\/|\/landing\/series\//i.test(page.url())) return;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(600);
  const card = page.locator('a[href*="/content/"]').first();
  await card.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  await card.click({ timeout: 8000 });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
});

Then("회차 리스트 영역이 화면에 표시된다", async ({ page }) => {
  const list = page.locator('a[href*="/viewer/"]').or(page.getByText(/\d+\s*화|\d+\s*회차|회차/));
  await expect(list.first()).toBeVisible({ timeout: 10000 });
});

// 회차 정렬을 "첫화부터"로 변경하여 무료 회차가 상단에 오도록 함
async function ensureSortedByFirst(page: any) {
  const SORT_SPAN = 'span.font-small2-bold.text-el-40, span[class*="font-small2-bold"]';
  const currentSort = page.locator(SORT_SPAN).filter({ hasText: /^최신\s*순$/ });
  if ((await currentSort.count()) === 0) return; // 이미 첫화부터 또는 정렬 메뉴 없음
  const trigger = currentSort.first().locator("xpath=ancestor::*[self::button or self::a or @role='button' or @role='combobox'][1]").first();
  if ((await trigger.count()) > 0) {
    await trigger.scrollIntoViewIfNeeded().catch(() => null);
    await trigger.click({ force: true }).catch(() => null);
    await page.waitForTimeout(400);
  } else {
    await currentSort.first().locator("xpath=..").click({ force: true }).catch(() => null);
    await page.waitForTimeout(400);
  }
  const firstOption = page.getByRole("option", { name: /첫화부터/i }).or(page.getByText(/^첫화부터$/).first());
  if ((await firstOption.count()) > 0) {
    await firstOption.first().click({ force: true }).catch(() => null);
    await page.waitForTimeout(800);
  }
}

// 회차 링크를 클릭하고 뷰어로 이동했는지 확인, 실패 시 다음 회차 시도
async function clickEpisodeUntilViewer(page: any) {
  await ensureSortedByFirst(page);
  const contentUrl = page.url();

  // 1) 무료 뱃지 회차 우선 시도
  const freeEpisode = page.locator('a[href*="/viewer/"]').filter({ hasText: /무료|Free|FREE/ }).first();
  if ((await freeEpisode.count()) > 0 && (await freeEpisode.isVisible().catch(() => false))) {
    await freeEpisode.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(200);
    await freeEpisode.click({ timeout: 10000, force: true }).catch(async () => {
      await freeEpisode.evaluate((el: HTMLElement) => el.click());
    });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
    if (/\/viewer\//i.test(page.url())) return;
    // 뷰어 아님 → 뒤로 가서 재시도
    await page.goto(contentUrl, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
    await page.waitForTimeout(500);
    await ensureSortedByFirst(page);
  }

  // 2) 순서대로 회차 시도 (최대 5개)
  const allEpisodes = page.locator('a[href*="/viewer/"]');
  const total = Math.min(await allEpisodes.count(), 5);
  for (let i = 0; i < total; i++) {
    const ep = allEpisodes.nth(i);
    if (!(await ep.isVisible().catch(() => false))) continue;
    await ep.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(200);
    await ep.click({ timeout: 10000, force: true }).catch(async () => {
      await ep.evaluate((el: HTMLElement) => el.click());
    });
    await page.waitForURL(/\/viewer\//i, { timeout: 12000 }).catch(() => null);
    if (/\/viewer\//i.test(page.url())) return;
    // 뷰어 아님 (유료 회차) → 뒤로
    await page.goto(contentUrl, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
    await page.waitForTimeout(500);
    await ensureSortedByFirst(page);
  }
}

When("사용자가 특정 [회차]를 클릭한다", async ({ page }) => {
  await clickEpisodeUntilViewer(page);
  await page.waitForTimeout(400);
});

When("사용자가 특정 무료 뱃지가 표시된 [회차]를 클릭한다", async ({ page }) => {
  await clickEpisodeUntilViewer(page);
  await page.waitForTimeout(400);
});

Then("해당 회차의 뷰어 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/viewer\//i, { timeout: 15000 });
  // toHaveURL이 이미 뷰어 URL을 검증하므로 추가 확인은 뷰어 콘텐츠에 집중
  const hasViewer = (await page.getByText(/회차|화|다음|이전/i).count()) > 0
    || (await page.locator('[class*="viewer"], [class*="Viewer"]').count()) > 0;
  expect(hasViewer).toBe(true);
});
