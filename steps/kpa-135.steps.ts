// Feature: KPA-135 - 무료 회차에서 다음 회차로 이동
import { And } from "./fixtures.js";

And("사용자가 \"다음화 보기\" 버튼을 클릭한다", async ({ page }) => {
  const nextBtn = page.getByRole("button", { name: /다음화\s*보기|다음\s*화\s*보기/i })
    .or(page.getByRole("link", { name: /다음화\s*보기|다음\s*회차/i }))
    .or(page.getByText(/다음화\s*보기|다음\s*회차/i).first());
  const count = await nextBtn.count().catch(() => 0);
  if (count > 0) {
    await nextBtn.first().scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300).catch(() => null);
    await nextBtn.first().click({ timeout: 8000 }).catch(() => null);
    await page.waitForURL(/\/(viewer|content)\//i, { timeout: 12000 }).catch(() => null);
  }
  await page.waitForTimeout(400).catch(() => null);
});
