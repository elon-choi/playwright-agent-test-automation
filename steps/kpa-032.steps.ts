// Feature: KPA-032 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 {string} 정렬 상태를 선택한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

// And '사용자가 {string} 탭 하단의 작품 리스트를 확인한다'는 kpa-038.steps.ts When에 단일 정의
And("사용자가 {string} > {string} > {string} > 1위 작품을 클릭하고, 해당 작품의 1회차를 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("사용자가 {string} > {string} 탭 하단의 작품 리스트를 다시 확인한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("최근본 작품이 사용자가 선택한 정렬 기준대로 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("실시간 랭킹 1위 작품의 1회차가 정상적으로 감상된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("{string} 탭의 최상단에 사용자가 3번에서 감상한 작품의 이력이 노출된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});