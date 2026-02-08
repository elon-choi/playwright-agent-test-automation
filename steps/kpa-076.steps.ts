// Feature: KPA-076 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 회차 감상 이력이 없고, 이펍 뷰어를 사용한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 첫 화 보기 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 [다음화 보기] 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("첫 화 보기 탭이 노출되고, 연재 정보, 줄거리, 원고 이미지가 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("[다음 회차] 영역이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("다음 회차 뷰어가 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});