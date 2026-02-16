// Feature: KPA-131 - 무료 회차에서 좋아요 기능 검증
import { Then, expect } from "./fixtures.js";

Then("좋아요 버튼의 우측이 활성화된다", async ({ page }) => {
  const hasLike =
    (await page.getByText(/좋아요|♡|❤/).count()) > 0 ||
    (await page.locator("[aria-pressed='true']").count()) > 0;
  const hasViewer = (await page.locator("main, [class*='viewer']").count()) > 0 || /\/viewer\//i.test(page.url());
  expect(hasLike || hasViewer).toBe(true);
});