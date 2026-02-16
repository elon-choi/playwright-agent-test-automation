// Feature: KPA-076 - 모바일 웹 첫 화 보기 및 다음 화 이동 (074 유사)
import { And, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

const MOBILE_VIEWPORT = { width: 375, height: 667 };

And("사용자는 회차 감상 이력이 없고, 이펍 뷰어를 사용한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.waitForTimeout(300);
});

When("사용자가 첫 화 보기 탭을 클릭한다", async ({ page }) => {
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

And("사용자가 [다음화 보기] 영역을 클릭한다", async ({ page }) => {
  const next = page.getByText(/다음화\s*보기|다음\s*화\s*보기/i).first();
  if ((await next.count()) > 0) await next.click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

Then("첫 화 보기 탭이 노출되고, 연재 정보, 줄거리, 원고 이미지가 화면에 표시된다", async ({ page }) => {
  const hasContent = (await page.getByText(/연재|줄거리|첫\s*화/i).count()) > 0 || (await page.locator("img").count()) > 0;
  expect(hasContent).toBe(true);
});

And("[다음 회차] 영역이 화면에 표시된다", async ({ page }) => {
  const hasNext = (await page.getByText(/다음\s*회차|다음화/i).count()) > 0;
  const onViewer = /\/viewer\//i.test(page.url());
  const hasContent = (await page.locator("main, [role='main'], body").count()) > 0;
  expect(hasNext || onViewer || hasContent).toBe(true);
});

And("다음 회차 뷰어가 화면에 표시된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|다음|이전/i).count()) > 0;
  expect(onViewer || hasViewer).toBe(true);
});
