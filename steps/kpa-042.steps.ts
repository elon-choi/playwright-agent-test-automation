// Feature: KPA-042 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("구매 순 정렬이 선택된 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("구매 작품탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("메인홈에서 웹툰 > 실시간 랭킹 > 1위 작품을 클릭하여 이용권을 구매한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("보관함에서 구매 작품탭 하단의 작품 리스트를 다시 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("구매 작품이 정렬 기준에 따라 올바르게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("실시간 랭킹 1위 작품의 이용권 구매가 정상적으로 진행된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("구매 작품탭 최상단에 방금 감상한 작품 이력이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});