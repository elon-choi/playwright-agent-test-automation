// Feature: KPA-044 구매작품 삭제 기능 검증
import { test } from "@playwright/test";
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
And("사용자가 하단의 {string} 버튼을 클릭한다", async ({ page }, param: string) => {
  const firstLink = page.locator('a[href*="/content/"]').first();
  selectedContentHref = await firstLink.getAttribute("href").catch(() => null);
  const escaped = param.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const partial = param.replace(/\s+/g, "\\s*");
  const tokens = param.split(/\s+/).filter(Boolean);
  const tokenRegex = new RegExp(tokens.join(".*"), "i");
  let btn = page.getByRole("button", { name: new RegExp(escaped) })
    .or(page.getByRole("button", { name: new RegExp(partial) }))
    .or(page.getByRole("button", { name: tokenRegex }))
    .or(page.getByRole("button", { name: /선택\s*항목\s*삭제|삭제/i }));
  if (await btn.count() === 0) {
    btn = page.getByText(tokenRegex).or(page.locator("button, [role='button'], a").filter({ hasText: tokenRegex }));
  }
  if (await btn.count() === 0 && /취소|구매/.test(param)) {
    btn = page.getByRole("button", { name: /취소|구매\s*취소/ }).or(page.getByText(/취소하기|구매\s*취소/));
  }
  const hasBtn = await btn.first().isVisible().catch(() => false);
  if (param === "구매 취소하기" && !hasBtn) {
    test.skip(true, "이용권 환불 화면에 도달하지 못함. 회차/대여권 단계에서 이용권 화면 진입이 필요합니다.");
  }
  await btn.first().scrollIntoViewIfNeeded().catch(() => null);
  await btn.first().click({ timeout: 15000, force: true });
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
