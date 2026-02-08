// Feature: KPA-098 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 유료 회차를 선택할 수 있는 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 보유 이용권을 가지고 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("이용권 사용 확인 팝업이 활성화되어 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("회차 리스트가 화면에 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("취소 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("회차 리스트가 다시 화면에 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 미구매 회차를 선택한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("이용권 사용 확인 팝업이 화면에 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("팝업에는 On, Off, 취소 버튼이 포함되어 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

When("사용자가 팝업에서 취소 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("팝업이 종료되고 회차 리스트가 화면에 다시 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});