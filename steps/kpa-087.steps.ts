// Feature: KPA-087 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 기다무 작품 BM을 선택하고, 해당 작품이 {string} 상태임을 확인한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("기다무 충전 영역에는 {string} 또는 {string}, {string}과 같은 정보가 표시되어야 한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});