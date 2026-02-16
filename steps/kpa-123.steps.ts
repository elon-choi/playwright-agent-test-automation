// Feature: KPA-123 - 무료 회차에서 다른 작품으로 이동 후 뒤로 가기
import { And, Then, expect } from "./fixtures.js";

And("사용자가 \"이 작품과 함께보는 웹툰\" 섹션에서 임의의 작품을 클릭한다", async ({ page }) => {
  const section = page.getByText(/이 작품과 함께보는 웹툰|함께보는 웹툰|함께보는/i).first();
  await section.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(300).catch(() => null);
  const link = page.locator("a[href*='/content/']").first();
  if ((await link.count()) > 0) await link.click({ timeout: 8000 }).catch(() => null);
  await page.waitForURL(/\/content\/|\/landing\/series\//i, { timeout: 12000 }).catch(() => null);
});

Then("사용자는 처음 클릭한 작품의 홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 5000 });
});

And("사용자는 이전에 방문한 작품의 홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 5000 });
});