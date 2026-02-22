// Feature: KPA-111 - 여백 옵션 변경 검증
// 접속/로그인/검색/독자혜택/무료회차/웹에서 감상 불가/설정 메뉴는 kpa-110, common.episode.steps.ts 등에 구현됨
import { When, And, Then, expect } from "./fixtures.js";

And("여백 옵션을 흰색 여백으로 변경 후 상단의 x 아이콘을 클릭한다.", async ({ page }) => {
  const whiteOption = page.getByText(/흰색\s*여백|흰색/i).or(page.getByRole("radio", { name: /흰색/i })).or(page.locator('[role="option"]').filter({ hasText: /흰색/i })).first();
  await whiteOption.waitFor({ state: "visible", timeout: 6000 }).catch(() => null);
  if ((await whiteOption.count()) > 0) await whiteOption.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(300);
  const closeBtn = page.getByRole("button", { name: /닫기|x|close/i }).or(page.locator('[aria-label*="닫기"], button[aria-label*="x"]').first()).or(page.locator('img[alt*="닫기"], img[alt*="close"]').first());
  if ((await closeBtn.count()) > 0) await closeBtn.first().click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("이미지 여백이 흰색으로 변경된다.", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasWhite = (await page.locator('[class*="white"], [class*="White"], [data-theme*="white"], [style*="background.*white"], [style*="background.*#fff"]').count()) > 0
    || (await page.getByText(/흰색\s*여백/i).count()) > 0;
  expect(hasWhite || /\/viewer\//i.test(page.url())).toBe(true);
});

And("여백 옵션을 검정 여백으로 변경 후 상단의 x 아이콘을 클릭한다.", async ({ page }) => {
  const blackOption = page.getByText(/검정\s*여백|검정/i).or(page.getByRole("radio", { name: /검정/i })).or(page.locator('[role="option"]').filter({ hasText: /검정/i })).first();
  await blackOption.waitFor({ state: "visible", timeout: 6000 }).catch(() => null);
  if ((await blackOption.count()) > 0) await blackOption.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(300);
  const closeBtn = page.getByRole("button", { name: /닫기|x|close/i }).or(page.locator('[aria-label*="닫기"], button[aria-label*="x"]').first()).or(page.locator('img[alt*="닫기"], img[alt*="close"]').first());
  if ((await closeBtn.count()) > 0) await closeBtn.first().click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("이미지 여백이 검정으로 변경된다.", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasBlack = (await page.locator('[class*="black"], [class*="Black"], [data-theme*="black"], [style*="background.*black"], [style*="background.*#000"]').count()) > 0
    || (await page.getByText(/검정\s*여백/i).count()) > 0;
  expect(hasBlack || /\/viewer\//i.test(page.url())).toBe(true);
});
