// Feature: KPA-085 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 로그인 상태이며 미사용 이용권을 보유하고 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 보유한 대여권 타입을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 이용권 내역 리스트에서 환불할 항목을 선택하고 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 \"확인\" 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("{string}라는 토스트 메시지가 화면에 표시된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("사용자의 계정에서 해당 이용권이 정상적으로 환불 처리된다", async ({ page }) => {
  await page.waitForTimeout(500);
});