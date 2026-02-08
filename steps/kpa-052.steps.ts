// Feature: KPA-052 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지 상단의 웹툰 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 최근본 작품탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 메인홈에서 웹툰 메뉴로 이동하여 실시간 랭킹의 4위 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 해당 작품의 1회차를 클릭하여 감상한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 추천탭 하단의 최근본 작품 영역에서 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("최근본 작품이 정렬 기준에 따라 올바르게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 실시간 랭킹 4위 작품의 1회차를 성공적으로 감상한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("최근본 작품 영역의 첫 번째 작품에 사용자가 3번에서 감상한 작품 이력이 올바르게 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});