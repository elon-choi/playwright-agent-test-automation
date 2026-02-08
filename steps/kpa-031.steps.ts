// Feature: KPA-031 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자의 계정에 감상 이력이 존재한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 웹 페이지에 진입하여 우측 상단의 보관함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("최근본 탭 하단에 작품 리스트가 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 임의의 작품 이미지를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("해당 작품의 홈 페이지로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 임의의 작품에서 이어보기 또는 다음화 보기 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("최근본 작품이 정렬 기준에 따라 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자의 회차 열람 이력 및 보유한 이용권 수에 따라 이어보기 또는 다음 회차로 진입한다", async ({ page }) => {
  await page.waitForTimeout(500);
});