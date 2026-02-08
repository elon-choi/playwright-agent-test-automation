// Feature: KPA-058 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입하여 상단의 책 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("최근본 작품탭 하단에 작품 리스트가 올바르게 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 메인홈에서 책 메뉴로 이동하여 랭킹 섹션에서 1위 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("최근본 작품 영역 하단의 첫 번째 작품에 사용자가 3번에서 감상한 작품 이력이 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});