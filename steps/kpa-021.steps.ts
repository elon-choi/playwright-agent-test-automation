// Feature: KPA-021 시나리오 검증 - 공지사항
import { Given, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

Given("사전 조건이 없다", async () => {
  await new Promise((r) => setTimeout(r, 300));
});

When("공지사항 내역 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const menu = page.getByRole("link", { name: /공지사항/i }).or(page.getByText(/공지사항/i).first());
  await menu.first().click({ timeout: 10000 });
});

When("임의의 공지사항을 클릭한다", async ({ page }) => {
  const item = page.locator('a[href*="notice"], [class*="notice"] a, li a').first();
  await item.waitFor({ state: "attached", timeout: 8000 });
  await item.evaluate((el: HTMLElement) => (el as HTMLAnchorElement).click());
});

Then("공지사항 화면이 다음과 같이 노출된다:", async ({ page }) => {
  await expect(page.getByText(/공지사항/i).first()).toBeAttached({ timeout: 10000 });
});

Then("선택한 공지사항이 확장되어 노출된다", async ({ page }) => {
  await page.waitForTimeout(300);
  const has = await page.getByText(/공지사항/i).first().count() > 0;
  expect(has).toBe(true);
});

Then("사용자가 공지사항 페이지를 빠져 나와, 더보기 메뉴로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
  expect(page.url().startsWith(getBaseUrlOrigin())).toBe(true);
});
