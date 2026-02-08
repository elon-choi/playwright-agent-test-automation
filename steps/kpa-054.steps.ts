// Feature: KPA-054 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입하여 상단의 웹소설 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("배너는 배경 및 썸네일, 메인타이틀, 서브타이틀, 뱃지, 배너 순서로 구성된다", async ({ page }) => {
  await page.waitForTimeout(500);
});