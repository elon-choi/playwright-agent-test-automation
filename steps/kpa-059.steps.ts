// Feature: KPA-059 시나리오 검증
// Scenario: 요일연재 메뉴를 통한 페이지 이동 및 구성 요소 확인
import { Given, When, Then, expect } from "./fixtures.js";

let selectedMenuUrl: string | null = null;

When("사용자가 웹 페이지 하단의 요일연재 메뉴를 클릭한다", async ({ page }) => {
  const byHref = page.locator('a[href*="/day-of-week"]').first();
  const byRole = page.getByRole("link", { name: /요일연재/i }).first();
  if (await byHref.count() > 0) {
    await byHref.click({ timeout: 15000 });
  } else {
    await byRole.click({ timeout: 15000 });
  }
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });
  await page.waitForTimeout(500);
});

Then("요일연재 메뉴 화면이 다음과 같이 구성되어 있는지 확인한다:", async ({ page }) => {
  await expect(page).toHaveURL(/\/day-of-week/i);

  const dayTabs = page.locator('a[href*="day-of-week?day_id="]');
  await expect(dayTabs.first()).toBeVisible({ timeout: 8000 });
  await expect(dayTabs).toHaveCount(7);

  await expect(page.getByRole("link", { name: /전체/i }).first()).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/카웹Zone/i).first()).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("link", { name: /웹툰/i }).first()).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("link", { name: /웹소설/i }).first()).toBeVisible({ timeout: 5000 });

  await expect(page.getByText(/카웹Zone/i).first()).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/웹툰/).first()).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/웹소설/).first()).toBeVisible({ timeout: 5000 });

  const workList = page.locator('a[href*="/content/"]');
  await expect(workList.first()).toBeVisible({ timeout: 8000 });
});

When("사용자가 임의의 요일연재 메뉴를 클릭한다", async ({ page }) => {
  const dayLink = page.locator('a[href*="day-of-week?day_id="]').first();
  if ((await dayLink.count()) > 0) {
    selectedMenuUrl = await dayLink.getAttribute("href");
    await dayLink.click({ timeout: 8000 });
    return;
  }
  const contentLink = page.locator('a[href*="/content/"]').first();
  await expect(contentLink).toBeVisible({ timeout: 5000 });
  selectedMenuUrl = await contentLink.getAttribute("href");
  await contentLink.click({ timeout: 8000 });
});

Then("사용자는 클릭한 메뉴에 해당하는 페이지로 이동한다", async ({ page }) => {
  if (!selectedMenuUrl) {
    throw new Error("선택한 메뉴 URL을 확보하지 못했습니다.");
  }
  const urlPath = selectedMenuUrl.replace(/^https?:\/\/[^/]+/, "").split("?")[0];
  await expect(page).toHaveURL(new RegExp(urlPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), { timeout: 10000 });
});
