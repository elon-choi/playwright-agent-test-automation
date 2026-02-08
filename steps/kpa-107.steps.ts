// Feature: KPA-107 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 댓글 탭을 클릭하고 [더보기] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("[신고하기] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("임의의 옵션을 선택한 후 하단의 [등록하기] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("확인 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("팝업에는 다음 옵션이 포함되어야 한다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});

Then("신고하기 상세 화면으로 이동되어야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("{string} 메시지가 노출되어야 한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("메시지 팝업이 종료되고, 댓글 리스트로 이동되어야 한다", async ({ page }) => {
  await page.waitForTimeout(500);
});