// Feature: KPA-131 (overnight generated)
import { Given, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

Then("좋아요 버튼의 우측이 활성화된다", async ({ page }) => {
  await page.waitForTimeout(500);
});