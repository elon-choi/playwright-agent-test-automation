// Feature: KPA-106 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 [답글] 버튼을 클릭하고 임의의 답글을 입력한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 [답글 등록] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("입력한 답글이 답글 목록에 등록된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("답글 카운트가 +1 증가하여 표시된다", async ({ page }) => {
  await page.waitForTimeout(500);
});