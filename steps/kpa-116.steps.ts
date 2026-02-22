// Feature: KPA-116 - 무료 회차에서 원작소설로 이동
// 전체 연령 작품 목록 확인/무료 회차 진입/최하단 스크롤은 common.episode.steps.ts
import { And, Then, expect } from "./fixtures.js";

And("사용자가 {string} 배너를 클릭한다", async ({ page }, param: string) => {
  if (page.isClosed?.()) return;
  await page.waitForTimeout(500);
  const re = /원작\s*소설|이\s*작품을\s*['']?원작\s*소설['']?\s*로\s*보기|동일작\s*보기/i;
  const banner = page.locator('img[alt="동일작 보기"]').first()
    .or(page.getByText(re).first())
    .or(page.getByRole("link", { name: re }));
  const scrollUntilVisible = async (maxScrolls: number) => {
    for (let i = 0; i < maxScrolls; i++) {
      const visible = await banner.first().isVisible().catch(() => false);
      if (visible) return true;
      await page.evaluate(() => {
        const step = 400;
        window.scrollBy(0, step);
        document.body.scrollTop = Math.min(document.body.scrollHeight, (document.body.scrollTop || 0) + step);
        const el = document.querySelector("main, [class*='viewer'], [class*='scroll']");
        if (el && el instanceof HTMLElement && el.scrollHeight > el.clientHeight)
          el.scrollTop = Math.min(el.scrollHeight, el.scrollTop + step);
      });
      await page.waitForTimeout(400);
    }
    return false;
  };
  const found = await scrollUntilVisible(25);
  if (!found) throw new Error("원작소설로 보기 배너를 찾지 못했습니다. 최하단까지 스크롤 후에도 노출되지 않습니다.");
  await banner.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const clickable = page.locator('.cursor-pointer').filter({ hasText: re }).first();
  if ((await clickable.count()) > 0 && (await clickable.isVisible().catch(() => false)))
    await clickable.click({ timeout: 8000 });
  else
    await banner.first().click({ timeout: 8000 });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 });
  await page.waitForTimeout(300);
});

Then("사용자는 해당 작품의 홈 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(content|landing\/series)\//i, { timeout: 8000 });
});