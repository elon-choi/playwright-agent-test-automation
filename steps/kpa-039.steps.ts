// Feature: KPA-039 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 로그인하여 좋아요 탭에 접근할 수 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 편집 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 임의의 작품을 선택한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 하단의 선택 항목 삭제 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("선택 항목 삭제 버튼이 활성화된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("선택한 작품이 삭제되어 좋아요 탭 리스트에서 더 이상 보이지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
});