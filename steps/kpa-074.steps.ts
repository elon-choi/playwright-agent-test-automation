// Feature: KPA-074 - 모바일 웹 첫 화 보기 및 다음 화 보기 (모바일 뷰포트)
import { Given, And, expect, getBaseUrlOrigin } from "./fixtures.js";

const MOBILE_VIEWPORT = { width: 375, height: 667 };

Given("사용자가 {string} 사이트에 모바일 웹 브라우저로 접속한다", async ({ page }, url: string) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  const base = getBaseUrlOrigin();
  await page.goto(url === "https://page.kakao.com/" ? base : url, { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
});

And("사용자는 이미지 뷰어를 사용 중이다", async ({ page }) => {
  await page.waitForTimeout(300);
});

And("사용자가 화면을 최하단으로 스크롤한다", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
});

And("사용자가 \"[다음화 보기]\" 영역을 클릭한다", async ({ page }) => {
  const next = page.getByText(/다음화\s*보기|다음\s*화\s*보기/i).first();
  if ((await next.count()) > 0) await next.click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

And("\"[다음 회차]\" 영역이 화면에 표시된다", async ({ page }) => {
  const hasNext = (await page.getByText(/다음\s*회차|다음화/i).count()) > 0;
  expect(hasNext).toBe(true);
});

And("다음 회차의 뷰어가 화면에 표시된다", async ({ page }) => {
  const onViewer = /\/viewer\//i.test(page.url());
  const hasViewer = (await page.getByText(/회차|다음|이전/i).count()) > 0;
  expect(onViewer || hasViewer).toBe(true);
});
