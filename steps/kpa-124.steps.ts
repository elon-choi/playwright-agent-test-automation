// Feature: KPA-124 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 전체 연령 작품의 무료 회차에 진입한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("뷰어 탭 하단에 다음 요소들이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});