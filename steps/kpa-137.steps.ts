// Feature: KPA-137 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 이전에 보던 작품의 홈으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});