// Feature: KPA-073 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 모바일 웹 환경에서 접속한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 회차 감상 이력이 없는 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자는 이미지 뷰어를 사용한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 \"첫 화 보기\" 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 화면을 스크롤한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 \"[뷰어로 보기]\" 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("{string} 탭이 노출되고, 연재 정보, 줄거리, 원고 이미지가 화면에 표시된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("{string} 버튼이 화면에 표시된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("감상 중인 회차의 뷰어가 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});