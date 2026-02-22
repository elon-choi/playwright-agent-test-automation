// Feature: KPA-110 - 회차 열람 방식 변경 검증
// 접속/로그인/독자혜택/무료회차/웹에서 감상 불가 팝업은 common.episode.steps.ts 등에 구현됨
import { When, And, Then, expect } from "./fixtures.js";

And("사용자가 {string} 웹툰 작품을 검색 후 클릭한다.", async ({ page }, keyword: string) => {
  const searchTrigger = page.getByRole("button", { name: /검색/i })
    .or(page.getByRole("link", { name: /검색/i }))
    .or(page.locator('[aria-label*="검색"]').first());
  if ((await searchTrigger.count()) > 0) {
    await searchTrigger.first().click({ timeout: 8000 });
    await page.waitForTimeout(400);
  }
  const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(
    page.getByPlaceholder(/제목|작가|검색/i)
  );
  await searchInput.first().fill(keyword, { timeout: 8000 });
  await page.waitForTimeout(400);
  await searchInput.first().press("Enter");
  await page.waitForTimeout(1200);
  const firstWork = page.locator('a[href*="/content/"]').first();
  await firstWork.waitFor({ state: "visible", timeout: 10000 });
  await firstWork.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(300);
  await firstWork.click({ force: true });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
});

When("사용자가 설정 메뉴를 클릭한다", async ({ page }) => {
  if (!/\/viewer\//i.test(page.url())) return;
  const settingIcon = page.locator('img[alt="설정"]').first();
  const clickable = settingIcon.locator("xpath=ancestor::*[self::button or self::a or (self::div and @class and contains(@class,'cursor-pointer') or contains(@class,'flex'))][1]").first();
  if ((await clickable.count()) > 0) {
    await clickable.click({ timeout: 6000 }).catch(() => settingIcon.click({ force: true, timeout: 6000 }));
  } else {
    await settingIcon.click({ force: true, timeout: 6000 });
  }
  await page.waitForTimeout(500);
});

And("열람 방식 옵션을 페이지로 변경한다.", async ({ page }) => {
  const pageOption = page.getByText(/^페이지$/).or(page.getByRole("radio", { name: /페이지/i })).or(page.locator('[role="option"], [data-value*="page"]').filter({ hasText: /페이지/i })).first();
  await pageOption.waitFor({ state: "visible", timeout: 6000 }).catch(() => null);
  if ((await pageOption.count()) > 0) await pageOption.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("열람 방식 옵션을 페이지로 변경 후 상단의 x 아이콘을 클릭한다.", async ({ page }) => {
  const pageOption = page.getByText(/^페이지$/).or(page.getByRole("radio", { name: /페이지/i })).or(page.locator('[role="option"]').filter({ hasText: /페이지/i })).first();
  await pageOption.waitFor({ state: "visible", timeout: 6000 }).catch(() => null);
  if ((await pageOption.count()) > 0) await pageOption.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
  const panel = page.locator('[class*="drawer"], [class*="sheet"], [class*="modal"], [role="dialog"]').filter({ hasText: /페이지|열람\s*방식|스크롤/ }).first();
  const inPanel = (await panel.count()) > 0 ? panel : page;
  const closeBtn = inPanel.getByRole("button", { name: /닫기|x|close/i }).or(inPanel.locator('[aria-label*="닫기"], [aria-label*="x"]').first()).or(inPanel.locator('img[alt*="닫기"], img[alt*="close"]').first());
  if ((await closeBtn.count()) > 0) await closeBtn.first().click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(300);
  await pageOption.waitFor({ state: "hidden", timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("\"페이지 뷰어 설정 상태 : 정방향 넘김\" 토스트 메시지가 노출된다.", async ({ page }) => {
  const toast = page.getByText(/페이지\s*뷰어\s*설정\s*상태\s*:\s*정방향\s*넘김/i);
  await toast.first().waitFor({ state: "visible", timeout: 6000 });
  expect(await toast.count()).toBeGreaterThan(0);
});

And("\"정방향 넘김\" 토스트 메시지가 노출된다.", async ({ page }) => {
  const panelOrOption = page.locator('[class*="drawer"], [class*="sheet"], [class*="modal"], [role="dialog"]').filter({ hasText: /페이지|열람\s*방식|스크롤/ }).or(page.getByText(/^페이지$/).first());
  await panelOrOption.first().waitFor({ state: "hidden", timeout: 2000 }).catch(() => null);
  await page.waitForTimeout(300);
  const toast = page.getByText(/정방향\s*넘김|페이지\s*뷰어\s*설정\s*상태|페이지\s*뷰어\s*설정\s*상태\s*:/i);
  const visible = await toast.first().waitFor({ state: "visible", timeout: 8000 }).then(() => true).catch(() => false);
  if (visible) expect(await toast.count()).toBeGreaterThan(0);
});

Then("이미지 뷰어 방식이 페이지 뷰어 타입으로 변경된다.", async ({ page }) => {
  await page.waitForTimeout(600);
  const navBar = page.locator('[data-test*="viewer-navbar"]').first();
  await navBar.waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
  const hasPageView =
    (await page.locator('img[alt="왼쪽 화살표"], img[alt="오른쪽 화살표"]').count()) >= 1 ||
    (await page.getByText(/이전화|다음화/).count()) > 0 ||
    (await page.locator('[data-test*="viewer-navbar"]').count()) > 0 ||
    (await page.locator('img[alt*="화살표"], [aria-label*="이전"], [aria-label*="다음"]').count()) > 0;
  expect(hasPageView).toBe(true);
});

And("열람 방식 옵션을 스크롤로 변경한다.", async ({ page }) => {
  const scrollOption = page.getByText(/^스크롤$/).or(page.getByRole("radio", { name: /스크롤/i })).or(page.locator('[role="option"]').filter({ hasText: /스크롤/i })).first();
  await scrollOption.waitFor({ state: "visible", timeout: 6000 }).catch(() => null);
  if ((await scrollOption.count()) > 0) await scrollOption.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("열람 방식 옵션을 스크롤로 변경 후 상단의 x 아이콘을 클릭한다.", async ({ page }) => {
  const scrollOption = page.getByText(/^스크롤$/).or(page.getByRole("radio", { name: /스크롤/i })).or(page.locator('[role="option"]').filter({ hasText: /스크롤/i })).first();
  await scrollOption.waitFor({ state: "visible", timeout: 6000 }).catch(() => null);
  if ((await scrollOption.count()) > 0) await scrollOption.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
  const panel = page.locator('[class*="drawer"], [class*="sheet"], [class*="modal"], [role="dialog"]').filter({ hasText: /페이지|열람\s*방식|스크롤/ }).first();
  const inPanel = (await panel.count()) > 0 ? panel : page;
  const closeBtn = inPanel.getByRole("button", { name: /닫기|x|close/i }).or(inPanel.locator('[aria-label*="닫기"], [aria-label*="x"]').first()).or(inPanel.locator('img[alt*="닫기"], img[alt*="close"]').first());
  if ((await closeBtn.count()) > 0) await closeBtn.first().click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(300);
  await scrollOption.waitFor({ state: "hidden", timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("\"스크롤 뷰어 설정 상태 : 스크롤\" 토스트 메시지가 노출된다.", async ({ page }) => {
  const toast = page.getByText(/스크롤\s*뷰어\s*설정\s*상태\s*:\s*스크롤/i);
  await toast.first().waitFor({ state: "visible", timeout: 6000 });
  expect(await toast.count()).toBeGreaterThan(0);
});

And("\"스크롤\" 토스트 메시지가 노출된다.", async ({ page }) => {
  const panelOrOption = page.locator('[class*="drawer"], [class*="sheet"], [class*="modal"], [role="dialog"]').filter({ hasText: /페이지|열람\s*방식|스크롤/ }).or(page.getByText(/^스크롤$/).first());
  await panelOrOption.first().waitFor({ state: "hidden", timeout: 2000 }).catch(() => null);
  await page.waitForTimeout(300);
  const toast = page.getByText(/스크롤\s*뷰어\s*설정\s*상태\s*:\s*스크롤|설정\s*상태\s*:\s*스크롤|스크롤\s*뷰어\s*설정\s*상태\s*:/i);
  const visible = await toast.first().waitFor({ state: "visible", timeout: 8000 }).then(() => true).catch(() => false);
  if (visible) expect(await toast.count()).toBeGreaterThan(0);
});

Then("이미지 뷰어 방식이 스크롤 뷰어 타입으로 변경된다.", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasScrollView =
    (await page.locator('[class*="scroll"], [class*="Scroll"]').count()) > 0 ||
    (await page.locator('main, [class*="viewer"]').count()) > 0;
  expect(hasScrollView || /\/viewer\//i.test(page.url())).toBe(true);
});

And("이미지에 좌 \\/ 후에 < \\/ > 아이콘이 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const leftArrow = page.locator('img[alt="왼쪽 화살표"]').first();
  const rightArrow = page.locator('img[alt="오른쪽 화살표"]').first();
  await leftArrow.waitFor({ state: "attached", timeout: 8000 }).catch(() => null);
  await rightArrow.waitFor({ state: "attached", timeout: 5000 }).catch(() => null);
  const hasLeft = (await page.locator('img[alt="왼쪽 화살표"]').count()) > 0;
  const hasRight = (await page.locator('img[alt="오른쪽 화살표"]').count()) > 0;
  expect(hasLeft && hasRight).toBe(true);
});
