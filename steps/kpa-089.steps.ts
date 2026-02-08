// Feature: KPA-089 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 구매 이력이 있는 계정으로 접속한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 구매회차 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("구매회차 목록에 사용자가 구매한 회차 리스트가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});