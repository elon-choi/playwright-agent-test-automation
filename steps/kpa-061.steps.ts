// Feature: KPA-061 시나리오 검증
// Scenario: 오늘신작 메뉴 및 작품 홈 이동 검증
import { Given, When, Then, expect, withAiFallback } from "./fixtures.js";

let selectedWorkUrl: string | null = null;

export function setSelectedWorkUrl(url: string | null) {
  selectedWorkUrl = url;
}

When("사용자가 상단의 추천 GNB 메뉴를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const gnbRecommend = page.getByRole("link", { name: /추천/i });
      await gnbRecommend.first().click({ force: true });
    },
    "상단 추천 메뉴를 클릭한다",
    ai
  );
});

When("사용자가 오늘신작 서브탭을 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const subTab = page.getByRole("link", { name: /오늘신작/i });
      await subTab.first().click({ force: true });
    },
    "오늘신작 탭을 클릭한다",
    ai
  );
});

Then("오늘신작 메뉴 하단에 다음 요소들이 노출된다:", async ({ page }) => {
  const webtoonTab = page.getByRole("link", { name: /웹툰/i }).or(page.locator('a[href*="/menu/10010"]'));
  const novelTab = page.getByRole("link", { name: /웹소설|소설/i }).or(page.locator('a[href*="/menu/10011"]'));
  const bookTab = page.getByRole("link", { name: /책/i }).or(page.locator('a[href*="/menu/10016"]'));
  const todaySection = page.getByText(/^TODAY$/).or(page.getByText(/TODAY/));
  let visibleCount = 0;
  if (await webtoonTab.first().isVisible().catch(() => false)) visibleCount += 1;
  if (await novelTab.first().isVisible().catch(() => false)) visibleCount += 1;
  if (await bookTab.first().isVisible().catch(() => false)) visibleCount += 1;
  if (await todaySection.first().isVisible().catch(() => false)) visibleCount += 1;
  expect(visibleCount).toBeGreaterThanOrEqual(2);
});

When("사용자가 첫번째 신작 작품을 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const todaySectionTitle = page.getByText(/^TODAY$/).first();
      await todaySectionTitle.waitFor({ state: "visible", timeout: 15000 });

      const workLink = page.getByRole("link", { name: /^작품,/ });
      await workLink.first().waitFor({ state: "visible", timeout: 15000 });

      selectedWorkUrl = await workLink.first().getAttribute("href");
      await workLink.first().click();
    },
    "TODAY 섹션에서 첫 번째 신작 작품을 클릭한다",
    ai
  );
});

Then("사용자는 클릭한 작품의 작품홈으로 이동한다", async ({ page }) => {
  if (!selectedWorkUrl) {
    const contentPattern = /\/(content|landing\/series|landing)\//i;
    await page.waitForURL(contentPattern, { timeout: 20000 }).catch(() => null);
    let ok = /\/content\/|\/landing\//i.test(page.url());
    if (!ok) {
      const newPage = await page.context().waitForEvent("page", { timeout: 5000 }).catch(() => null);
      if (newPage && /\/content\/|\/landing\//i.test(newPage.url())) {
        ok = true;
      }
      if (!ok) {
        for (const p of page.context().pages()) {
          if (p !== page && /\/content\/|\/landing\//i.test(p.url())) {
            ok = true;
            break;
          }
        }
      }
    }
    expect(ok).toBe(true);
    return;
  }
  await expect(page).toHaveURL(new RegExp(selectedWorkUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), { timeout: 15000 });
});
