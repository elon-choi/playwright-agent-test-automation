// Feature: KPA-067 (overnight generated)
import { Given, When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 작품 이미지의 좌측 상단에 있는 BM 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("작품의 BM 타입에 따라 올바르게 표기되어 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});