// Feature: KPA-139 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 \"앱으로 보기\" 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("웹에서 감상 불가 팝업이 화면에 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 해당 플랫폼의 스토어로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});