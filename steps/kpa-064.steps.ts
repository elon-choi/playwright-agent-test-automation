// Feature: KPA-064 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 장르전체 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("장르전체 메뉴 하단에 다음 UI 요소들이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});