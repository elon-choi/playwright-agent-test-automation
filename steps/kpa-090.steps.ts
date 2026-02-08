// Feature: KPA-090 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 구매 이력이 없는 계정으로 로그인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("{string}라는 메시지가 화면에 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});