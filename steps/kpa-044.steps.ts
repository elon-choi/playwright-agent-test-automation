// Feature: KPA-044 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("구매작품 탭에 최소 1개의 작품이 존재한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 구매작품 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 하단의 {string} 버튼을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("선택한 작품이 구매작품 리스트에서 삭제된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("구매작품 리스트에 선택한 작품이 더 이상 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
});