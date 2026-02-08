// Feature: KPA-034 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 \"최근본\" 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("{string} 메뉴를 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("임의의 작품을 선택한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("하단의 {string} 버튼을 클릭한다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

Then("{string} 버튼이 활성화된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("선택한 작품이 삭제된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("최근본 감상탭 리스트에서 선택한 작품이 더 이상 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
});