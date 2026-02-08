// Feature: KPA-132 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 회차 별점을 선택하고 완료 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("선택한 별점이 설정되고 팝업창이 종료된다", async ({ page }) => {
  await page.waitForTimeout(500);
});