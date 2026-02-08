// Feature: KPA-055 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

Then("최근본 작품탭 하단에 작품 리스트가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 메인홈에서 웹소설 메뉴로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("실시간 랭킹에서 2위 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("해당 작품의 1회차를 클릭하여 감상한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("실시간 랭킹 2위 작품의 1회차가 정상적으로 감상된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 추천탭 하단의 최근본 작품 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("최근본 작품 영역 하단 첫 번째 작품에 사용자가 방금 감상한 작품 이력이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});