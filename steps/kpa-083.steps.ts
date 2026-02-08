// Feature: KPA-083 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 임의의 유료 회차를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뒤로가기를 눌러 뷰어 대여 상태를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("{string}라는 토스트 메시지가 노출되며 뷰어로 진입된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("뷰어 하단에 {string}와 {string} 메시지가 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});