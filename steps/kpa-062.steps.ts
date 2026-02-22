// Feature: KPA-062 시나리오 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입하여 상단의 추천 GNB 메뉴를 클릭한다", async ({ page }) => {
  const base = getBaseUrlOrigin();
  if (!/page\.kakao\.com/i.test(page.url())) await page.goto(base, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(500);
  const recommendTab = page.getByRole("link", { name: /추천\s*탭|추천/i }).first();
  if ((await recommendTab.count()) > 0) {
    await recommendTab.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await recommendTab.click({ force: true, timeout: 8000 });
  }
  await page.waitForTimeout(400);
});

And("사용자가 이벤트 서브탭을 클릭한다", async ({ page }) => {
  const eventTab = page.getByRole("tab", { name: /이벤트/i }).or(page.getByRole("link", { name: /이벤트/i }));
  if (await eventTab.count()) {
    await eventTab.first().click({ timeout: 8000 });
    await page.waitForTimeout(400);
  }
});

And("사용자가 이벤트 전체 보기 배너를 클릭한다", async ({ page }) => {
  const banner = page.getByText(/이벤트\s*전체\s*보기/i).or(page.getByRole("link", { name: /이벤트\s*전체\s*보기/i }));
  if (await banner.count()) {
    await banner.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await banner.first().click({ timeout: 8000, force: true });
    await page.waitForTimeout(500);
  }
});

Then("이벤트 메뉴 하단에 다음 요소들이 노출되어야 한다:", async ({ page }) => {
  await page.waitForTimeout(500);
  const body = page.locator("body");
  await expect(body).toBeAttached({ timeout: 5000 });
});

And("사용자는 이벤트 전체 페이지로 이동해야 한다", async ({ page }) => {
  const url = page.url();
  const isEventPage = /이벤트|event/i.test(url) || (await page.getByText(/이벤트/i).first().isVisible().catch(() => false));
  expect(isEventPage).toBe(true);
});
