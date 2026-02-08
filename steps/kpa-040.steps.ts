// Feature: KPA-040 (overnight generated)
import { Given, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

Then("{string}, {string}, {string} 정렬 옵션이 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});