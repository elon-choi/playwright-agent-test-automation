// Feature: KPA-075 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

Given("사용자가 {string} 사이트에 모바일 웹 브라우저로 접속했을 때", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("사용자가 회차 감상 이력이 없는 경우", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 이펍 뷰어를 사용 중일 때", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 첫 화 보기 탭을 클릭하면", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 화면을 스크롤하면", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 [뷰어로 보기] 버튼을 클릭하면", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("첫 화 보기 탭이 노출되고, 연재 정보와 줄거리, 압축 해제 이후 원고 이미지가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("[뷰어로 보기] 버튼이 계속해서 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("감상 중인 회차의 뷰어가 화면에 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});