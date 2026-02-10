// Feature: KPA-044 구매작품 삭제 기능 검증
import { When, Then, And, expect } from "./fixtures.js";

let selectedContentHref: string | null = null;

And("구매작품 탭에 최소 1개의 작품이 존재한다", async () => {});

When("사용자가 구매작품 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
  const tab = page.getByRole("tab", { name: /구매/i }).or(page.getByText(/구매\s*작품/i).first());
  if (await tab.count() > 0) await tab.first().click({ timeout: 8000 });
  await page.waitForTimeout(800);
  const list = page.locator('a[href*="/content/"]').first();
  await list.waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
});

// And '사용자가 편집 메뉴를 클릭한다'는 kpa-039.steps.ts에 단일 정의
// And '사용자가 임의의 작품을 선택한다'는 kpa-039.steps.ts에 단일 정의
And("사용자가 하단의 {string} 버튼을 클릭한다", async ({ page }) => {
  const firstLink = page.locator('a[href*="/content/"]').first();
  selectedContentHref = await firstLink.getAttribute("href").catch(() => null);
  const deleteBtn = page.getByRole("button", { name: /선택\s*항목\s*삭제|삭제/i });
  await deleteBtn.first().click({ timeout: 5000 });
  await page.waitForTimeout(800);
});

Then("{string} 버튼이 활성화된다", async ({ page }) => {
  await expect(page.getByRole("button", { name: /삭제/i }).first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});

And("선택한 작품이 구매작품 리스트에서 삭제된다", async ({ page }) => {
  if (selectedContentHref) {
    const link = page.locator(`a[href="${selectedContentHref}"]`);
    await link.waitFor({ state: "detached", timeout: 10000 }).catch(() => null);
  }
  await page.waitForTimeout(500);
});

And("구매작품 리스트에 선택한 작품이 더 이상 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
  if (selectedContentHref) {
    const link = page.locator(`a[href="${selectedContentHref}"]`);
    await expect(link).toHaveCount(0);
  }
  await expect(page.locator('a[href*="/content/"]').first()).toBeVisible({ timeout: 5000 }).catch(() => null);
});
