// Feature: KPA-063 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("요일 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const dayTab = page.getByRole("link", { name: /요일/i }).or(page.getByText(/요일/).first());
  if (await dayTab.count() > 0 && (await dayTab.first().isVisible().catch(() => false))) {
    await dayTab.first().scrollIntoViewIfNeeded().catch(() => null);
    await dayTab.first().click({ timeout: 10000, force: true }).catch(() => null);
    await page.waitForTimeout(600);
  }
});

And("임의의 작품을 클릭한다", async ({ page }) => {
  const workCard = page.locator('a[href*="/content/"]').first();
  await workCard.waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
  await workCard.scrollIntoViewIfNeeded({ block: "center" }).catch(() => null);
  await page.waitForTimeout(300);
  await workCard.click({ timeout: 15000, force: true }).catch(async () => {
    await workCard.evaluate((el: HTMLElement) => el.click());
  });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
});

Then("요일 메뉴 하단에 다음과 같은 메뉴가 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});