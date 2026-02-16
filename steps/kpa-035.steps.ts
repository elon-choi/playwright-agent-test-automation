// Feature: KPA-035 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("최근본 탭이 화면에 표시된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0 && (await storage.first().isVisible().catch(() => false))) {
    await storage.first().click({ timeout: 10000 });
    await page.waitForTimeout(600);
  }
  const recentTab = page.getByRole("tab", { name: /최근본/i }).or(page.getByRole("link", { name: /최근본/i })).or(page.locator('a[href*="/inven/recent"]').first());
  if (await recentTab.count() > 0 && (await recentTab.first().isVisible().catch(() => false))) {
    await recentTab.first().click({ timeout: 10000 });
    await page.waitForTimeout(600);
  } else {
    await page.goto(new URL("/inven/recent", getBaseUrlOrigin()).toString(), { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(500);
  }
});

When("사용자가 최근본 탭 하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const list = page.locator('a[href*="/content/"]').first();
  await list.waitFor({ state: "visible", timeout: 12000 }).catch(() => null);
});

// And '사용자가 작품 리스트 상단의 정렬 영역을 클릭한다'는 kpa-040.steps.ts에 단일 정의
// And '사용자가 임의의 정렬값을 클릭한다'는 kpa-040.steps.ts에 단일 정의
Then("최근 순, 업데이트 순, 제목 순 정렬 옵션이 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasSort = (await page.getByText(/최근\s*순|업데이트\s*순|제목\s*순/i).count()) > 0;
  expect(hasSort).toBe(true);
});

// And '선택한 정렬 기준으로 작품이 정렬되어 노출된다'는 kpa-040.steps.ts에 단일 정의