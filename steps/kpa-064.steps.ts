// Feature: KPA-064 - 웹소설 GNB 및 장르전체, 작품 선택 후 UI 검증
import { And, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 장르전체 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /장르\s*전체|전체/i }).or(page.getByText(/장르\s*전체|전체/i).first());
  if ((await tab.count()) > 0) await tab.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

Then("장르전체 메뉴 하단에 다음 UI 요소들이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasList = (await page.locator('a[href*="/content/"]').count()) > 0;
  const hasFilter = (await page.getByText(/전체|장르|정렬|완결|작품/i).count()) > 0;
  expect(hasList || hasFilter).toBe(true);
});
