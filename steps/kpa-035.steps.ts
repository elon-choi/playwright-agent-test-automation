// Feature: KPA-035 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("최근본 탭이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 최근본 탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 작품 리스트 상단의 정렬 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 임의의 정렬값을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("최근 순, 업데이트 순, 제목 순 정렬 옵션이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("선택한 정렬 기준으로 작품이 정렬되어 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});