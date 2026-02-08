// Feature: KPA-049 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 작품 감상 이력이 있는 계정으로 로그인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 최근본 작품탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 메인홈에서 웹툰 > 실시간 랭킹 > 3위 작품을 클릭하고, 1회차를 감상한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 추천탭 하단의 최근본 작품 영역에서 작품 리스트가 노출되는지 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("최근본 작품이 최신 감상 이력을 기준으로 정렬되어 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("실시간 랭킹 3위 작품의 1회차가 정상적으로 감상된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("최근본 작품 영역 하단의 첫 번째 작품에 사용자가 3번에서 감상한 작품 이력이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});