// Feature: KPA-037 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 {string}을 선택한 상태이다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("사용자가 {string}에서 2위 작품을 클릭하고 {string} 아이콘을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("사용자가 {string} 하단의 작품 리스트를 확인한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("{string}의 최상단에 3번에서 선택한 작품이 이력으로 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});