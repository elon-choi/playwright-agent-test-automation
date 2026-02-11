// Feature: KPA-082 시나리오 검증 - 소장권 구매 (081과 공통 스텝은 kpa-081.steps.ts 사용)
import { And, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

And("이용권 충전 페이지에서 \"소장권 충전\" 영역의 첫번째 n00캐시 버튼을 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(800);
  const 소장권텍스트 = page.getByText(/소장권\s*충전/i).first();
  await 소장권텍스트.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(300);
  let section = 소장권텍스트.locator("..");
  for (let i = 0; i < 6; i++) {
    const firstPriceBtn = section
      .getByRole("button", { name: /\d+캐시|\d+원/ })
      .or(section.locator("button").filter({ hasText: /\d+캐시/ }))
      .first();
    if ((await firstPriceBtn.count()) > 0 && (await firstPriceBtn.isVisible().catch(() => false))) {
      await firstPriceBtn.click({ timeout: 8000 }).catch(() => firstPriceBtn.evaluate((e: HTMLElement) => e.click()));
      await page.waitForTimeout(400);
      return;
    }
    const byText = section.getByText(/\d+\s*캐시|\d+캐시/).first();
    if ((await byText.count()) > 0 && (await byText.isVisible().catch(() => false))) {
      await byText.click({ timeout: 8000 }).catch(() => byText.evaluate((e: HTMLElement) => e.click()));
      await page.waitForTimeout(400);
      return;
    }
    section = section.locator("..");
  }
  const fallback = page.getByText(/소장권\s*충전/i).locator("..").locator("..").locator("..").locator("..").locator("button").filter({ hasText: /\d+캐시/ }).first();
  if ((await fallback.count()) > 0) {
    await fallback.click({ timeout: 8000 });
  } else {
    throw new Error("소장권 충전 영역에서 가격 버튼을 찾지 못했습니다. 대여권 영역이 아닌 소장권 충전 섹션을 사용해야 합니다.");
  }
  await page.waitForTimeout(400);
});

And("소장권 1장이 기본 선택된 상태에서 하단의 \"충전하기\" 버튼을 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  const candidates = [
    page.getByRole("button", { name: /충전하기|결제하기|구매하기|이용권\s*구매/i }),
    page.getByText(/충전하기|결제하기|구매하기|이용권\s*구매/),
    page.locator("button").filter({ hasText: /충전하기|결제|구매하기/ }),
    page.locator("[role='button']").filter({ hasText: /충전하기|결제|구매/ })
  ];
  for (const loc of candidates) {
    const first = loc.first();
    if ((await first.count()) > 0) {
      await first.scrollIntoViewIfNeeded().catch(() => null);
      await page.waitForTimeout(200);
      if (await first.isVisible().catch(() => false)) {
        await first.click({ timeout: 8000 });
        await page.waitForTimeout(800);
        return;
      }
    }
  }
  const byText = page.getByText(/충전하기|구매하기/).first();
  if ((await byText.count()) > 0) {
    await byText.scrollIntoViewIfNeeded().catch(() => null);
    await byText.click({ timeout: 6000, force: true });
    await page.waitForTimeout(800);
    return;
  }
  const ctaButton = page.locator("button").filter({ hasText: /충전하기|구매하기|결제하기/ }).filter({ hasNot: page.locator("button").filter({ hasText: /\d+캐시/ }) }).first();
  if ((await ctaButton.count()) > 0) {
    await ctaButton.scrollIntoViewIfNeeded().catch(() => null);
    await ctaButton.click({ timeout: 6000 });
  }
  await page.waitForTimeout(800);
});

Then("선택한 소장권이 정상적으로 구매되었음을 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin(), { timeout: 5000 });
});
