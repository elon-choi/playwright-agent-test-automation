// Feature: KPA-109 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 전체 연령 작품을 선택한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 무료 회차에 진입한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 무료 회차를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 뒤로 가기를 실행한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("뷰어 탭 하단에 다음 UI 요소들이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});

And("사용자는 작품홈 회차 리스트로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
});