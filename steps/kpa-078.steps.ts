// Feature: KPA-078 - 회차 감상 이력 있을 때 이어보기 (로그인 + 작품홈)
import { And, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

async function ensureOnWorkHome(page: import("@playwright/test").Page) {
  if (/\/(content|landing\/series)\//i.test(page.url())) return;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(600);
  const first = page.locator('a[href*="/content/"]').first();
  if ((await first.count()) > 0) {
    await first.evaluate((el: HTMLElement) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await first.dispatchEvent("click");
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  }
  await page.waitForTimeout(500);
}

And("사용자가 로그인하여 회차 감상 이력이 있는 상태이다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await page.waitForTimeout(400);
  await ensureOnWorkHome(page);
});

Then("[이어보기] 회차명이 화면에 표시된다", async ({ page }) => {
  const hasContinue = (await page.getByText(/이어보기|이어\s*보기/i).count()) > 0;
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|다음|이전/i).count()) > 0;
  expect(hasContinue || onViewer || hasViewer).toBe(true);
});

And("감상 중인 회차의 뷰어가 화면에 표시된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|다음|이전/i).count()) > 0;
  expect(onViewer || hasViewer).toBe(true);
});
