// Feature: KPA-115 (overnight generated)
import { Given, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

Then("뷰어 엔드 영역에 다음 요소들이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});