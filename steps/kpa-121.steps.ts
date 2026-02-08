// Feature: KPA-121 (overnight generated)
import { When, Then, And } from "./fixtures.js";

And("사용자가 \"다음화 보기 >\" 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});
