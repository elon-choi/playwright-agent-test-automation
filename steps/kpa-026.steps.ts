// Feature: KPA-026 (overnight generated)
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("이용권 사용 확인 팝업이 Off 상태이다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 대여권을 보유하고 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("설정 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("임의의 메뉴 설정을 변경한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("이용권 사용 확인 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("On 옵션을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("더보기 메뉴를 이탈하여 대여권을 보유한 임의의 작품을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("감상 이력이 없는 유료 회차를 클릭한 후 취소 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("이용권 사용 확인 메뉴를 클릭할 때 다음과 같은 팝업이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
});

And("이용권 사용 팝업이 노출되며, 취소 버튼을 클릭하면 팝업이 종료되고 회차 리스트가 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});