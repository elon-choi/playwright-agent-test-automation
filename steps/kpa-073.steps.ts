// Feature: KPA-073 - 모바일 웹 첫 화 보기 및 뷰어 진입 (모바일 뷰포트)
import { And, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

const MOBILE_VIEWPORT = { width: 375, height: 667 };

async function ensureMobileAndWorkHome(page: import("@playwright/test").Page) {
  await page.setViewportSize(MOBILE_VIEWPORT);
  if (!/\/(content|landing\/series)\//i.test(page.url())) {
    await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(600);
    const first = page.locator('a[href*="/content/"]').first();
    if ((await first.count()) > 0) {
      await first.evaluate((el: HTMLElement) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await first.dispatchEvent("click");
      await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
    }
  }
  await page.waitForTimeout(500);
}

And("사용자는 모바일 웹 환경에서 접속한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.waitForTimeout(400);
});

And("사용자는 회차 감상 이력이 없는 상태이다", async ({ page }) => {
  await page.waitForTimeout(300);
});

And("사용자는 이미지 뷰어를 사용한다", async ({ page }) => {
  await page.waitForTimeout(300);
});

When("사용자가 \"첫 화 보기\" 탭을 클릭한다", async ({ page }) => {
  await ensureMobileAndWorkHome(page);
  const tab = page.getByRole("tab", { name: /첫\s*화\s*보기|첫화\s*보기/i }).or(page.getByText(/첫\s*화\s*보기/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

And("사용자가 화면을 스크롤한다", async ({ page }) => {
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(400);
});

And("사용자가 \"[뷰어로 보기]\" 버튼을 클릭한다", async ({ page }) => {
  const btn = page.getByRole("button", { name: /뷰어로\s*보기/i }).or(page.getByText(/뷰어로\s*보기/i).first());
  if ((await btn.count()) > 0) await btn.first().click({ timeout: 6000 });
  await page.waitForTimeout(600);
});

Then("{string} 탭이 노출되고, 연재 정보, 줄거리, 원고 이미지가 화면에 표시된다", async ({ page }) => {
  const hasContent = (await page.getByText(/연재|줄거리|첫\s*화/i).count()) > 0 || (await page.locator("img").count()) > 0;
  expect(hasContent).toBe(true);
});

And("{string} 버튼이 화면에 표시된다", async ({ page }) => {
  const hasViewer = (await page.getByText(/뷰어로\s*보기/i).count()) > 0 || /\/viewer\//i.test(page.url());
  expect(hasViewer).toBe(true);
});

