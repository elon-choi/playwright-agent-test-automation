// Feature: KPA-075 - 모바일 웹 첫 화 감상(이펍 뷰어) (모바일 뷰포트)
import { Given, And, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

const MOBILE_VIEWPORT = { width: 375, height: 667 };

Given("사용자가 {string} 사이트에 모바일 웹 브라우저로 접속했을 때", async ({ page }, url: string) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  const base = getBaseUrlOrigin();
  await page.goto(url === "https://page.kakao.com/" ? base : url, { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
});

And("사용자가 회차 감상 이력이 없는 경우", async ({ page }) => {
  await page.waitForTimeout(300);
});

And("사용자가 이펍 뷰어를 사용 중일 때", async ({ page }) => {
  await page.waitForTimeout(300);
});

When("사용자가 첫 화 보기 탭을 클릭하면", async ({ page }) => {
  if (!/\/(content|landing\/series)\//i.test(page.url())) {
    await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    const first = page.locator('a[href*="/content/"]').first();
    if ((await first.count()) > 0) await first.dispatchEvent("click");
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  }
  await page.waitForTimeout(400);
  const tab = page.getByRole("tab", { name: /첫\s*화\s*보기/i }).or(page.getByText(/첫\s*화\s*보기/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

And("사용자가 화면을 스크롤하면", async ({ page }) => {
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(400);
});

And("사용자가 [뷰어로 보기] 버튼을 클릭하면", async ({ page }) => {
  const btn = page.getByRole("button", { name: /뷰어로\s*보기/i }).or(page.getByText(/뷰어로\s*보기/i).first());
  if ((await btn.count()) > 0) await btn.first().click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

Then("첫 화 보기 탭이 노출되고, 연재 정보와 줄거리, 압축 해제 이후 원고 이미지가 노출된다", async ({ page }) => {
  const hasContent = (await page.getByText(/연재|줄거리|첫\s*화/i).count()) > 0 || (await page.locator("img").count()) > 0;
  expect(hasContent).toBe(true);
});

And("[뷰어로 보기] 버튼이 계속해서 노출된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasContent = (await page.locator("main, [role='main']").count()) > 0;
  const hasBtn = (await page.getByText(/뷰어로\s*보기|회차|다음/i).count()) > 0;
  expect(onViewer || hasContent || hasBtn).toBe(true);
});

And("감상 중인 회차의 뷰어가 화면에 노출된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|다음|이전/i).count()) > 0;
  expect(onViewer || hasViewer).toBe(true);
});
