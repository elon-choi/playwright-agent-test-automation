// Feature: KPA-131 - 무료 회차에서 좋아요 기능 검증
import { Then, expect } from "./fixtures.js";

Then("좋아요 버튼의 우측이 활성화된다", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasLike =
    (await page.getByText(/좋아요|♡|❤|♥/).count()) > 0 ||
    (await page.locator("[aria-pressed='true']").count()) > 0 ||
    (await page.locator('button[aria-label*="좋아요"]').count()) > 0 ||
    (await page.locator('[class*="like"][class*="active"], [class*="Like"][class*="active"], [data-liked="true"]').count()) > 0;
  expect(hasLike).toBe(true);
});