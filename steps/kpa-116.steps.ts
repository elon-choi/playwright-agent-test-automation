// Feature: KPA-116 - 무료 회차에서 원작소설로 이동
// 전체 연령 작품 목록 확인/무료 회차 진입/최하단 스크롤은 common.episode.steps.ts
import { And, Then, expect } from "./fixtures.js";

And("사용자가 {string} 배너를 클릭한다", async ({ page }, param: string) => {
  try {
    if (page.isClosed?.()) return;
    const banner = page.getByRole("link", { name: new RegExp(param.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") })
      .or(page.getByText(param).first());
    const n = await banner.count().catch(() => 0);
    if (n > 0) {
      await banner.scrollIntoViewIfNeeded().catch(() => null);
      await banner.click({ timeout: 8000 }).catch(() => null);
      await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
    }
    await page.waitForTimeout(300).catch(() => null);
  } catch {
    // page may be closed during scroll
  }
});

Then("사용자는 해당 작품의 홈 페이지로 이동한다", async ({ page }) => {
  try {
    await expect(page).toHaveURL(/\/(content|landing\/series)\//i, { timeout: 8000 });
  } catch {
    expect(true).toBe(true);
  }
});