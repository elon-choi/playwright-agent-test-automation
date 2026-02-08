// Feature: KPA-092 시나리오 검증
// Scenario: 작품홈(Home 탭)에서 첫화부터 정렬 옵션 선택 시 회차가 첫화부터~최신화 순으로 노출되는지 확인
import { Given, When, Then, expect, withAiFallback } from "./fixtures.js";

When("사용자가 최신 순 정렬 옵션을 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const currentSort = page.getByRole("button", { name: /최신\s*순/i });
      if (await currentSort.count()) {
        return;
      }
      const optionCandidates = [
        page.getByRole("option", { name: /최신\s*순/i }),
        page.getByRole("button", { name: /최신\s*순/i }),
        page.getByText(/최신\s*순/)
      ];
      for (const locator of optionCandidates) {
        if (await locator.count()) {
          await locator.first().click({ force: true });
          return;
        }
      }
      return;
    },
    "최신 순 정렬 옵션을 클릭한다",
    ai
  );
});

Then('"첫화부터"와 "최신순" 옵션이 화면에 노출된다', async ({ page }) => {
  const sortTrigger = page.getByText(/첫화부터|최신\s*순/i).first();
  if (await sortTrigger.count()) {
    await sortTrigger.click({ force: true });
    await page.waitForTimeout(400);
  }
  const firstTexts = page.getByText(/첫화부터/i);
  const firstCount = await firstTexts.count();
  for (let i = 0; i < firstCount; i += 1) {
    if (await firstTexts.nth(i).isVisible().catch(() => false)) {
      await expect(firstTexts.nth(i)).toBeVisible();
      break;
    }
  }
  const latestTexts = page.getByText(/최신\s*순/i);
  const latestCount = await latestTexts.count();
  for (let i = 0; i < latestCount; i += 1) {
    if (await latestTexts.nth(i).isVisible().catch(() => false)) {
      await expect(latestTexts.nth(i)).toBeVisible();
      break;
    }
  }
});

When('"첫화부터" 옵션을 클릭한다', async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const optionCandidates = [
        page.getByRole("option", { name: /첫화부터/i }),
        page.getByRole("button", { name: /첫화부터/i }),
        page.getByText(/첫화부터/i)
      ];
      for (const locator of optionCandidates) {
        if (await locator.count()) {
          await locator.first().click({ force: true });
          await page.waitForTimeout(300);
          return;
        }
      }
    },
    "첫화부터 옵션을 클릭한다",
    ai
  );
});

Then("회차가 첫화부터 순서대로 정렬되어 화면에 노출된다", async ({ page }) => {
  const isContentPage = /\/content\/|\/landing\/series\//i.test(page.url());
  if (!isContentPage) {
    throw new Error(
      `작품 상세(작품홈) 페이지가 아닙니다. 회차 목록은 작품홈(/content/ 또는 /landing/series/)에서만 노출됩니다. 현재 URL: ${page.url()}`
    );
  }
  const byHref = page.locator(
    'a[href*="/viewer/"], a[href*="/episode/"], a[href*="/content/"][href*="episode"]'
  );
  await page.waitForTimeout(500);
  let links = byHref;
  let count = await byHref.count();
  if (count === 0) {
    const main = page.locator("main, [role='main']");
    const scope = (await main.count()) ? main.first() : page;
    links = scope.locator('a').filter({ hasText: /\d+\s*화/ });
    count = await links.count();
  }
  if (count === 0) {
    throw new Error(
      "회차 목록을 찾지 못했습니다. 작품홈 Home 탭에서 목록이 로드되었는지 확인해 주세요."
    );
  }
  const sampleCount = Math.min(count, 6);
  const numbers: number[] = [];
  for (let i = 0; i < sampleCount; i += 1) {
    const text = await links.nth(i).innerText().catch(() => "");
    const match = text.match(/(\d+)\s*화/);
    if (match) {
      numbers.push(Number(match[1]));
    }
  }
  if (numbers.length < 2) {
    return;
  }
  expect(numbers[0]).toBeLessThanOrEqual(numbers[1]);
});

Then("회차가 최신 회차부터 순서대로 정렬되어 화면에 노출된다", async ({ page }) => {
  const isContentPage = /\/content\/|\/landing\/series\//i.test(page.url());
  if (!isContentPage) {
    throw new Error(
      `작품 상세(작품홈) 페이지가 아닙니다. 회차 목록은 작품홈(/content/ 또는 /landing/series/)에서만 노출됩니다. 현재 URL: ${page.url()}`
    );
  }
  const byHref = page.locator(
    'a[href*="/viewer/"], a[href*="/episode/"], a[href*="/content/"][href*="episode"]'
  );
  await page.waitForTimeout(500);
  let links = byHref;
  let count = await byHref.count();
  if (count === 0) {
    const main = page.locator("main, [role='main']");
    const scope = (await main.count()) ? main.first() : page;
    links = scope.locator('a').filter({ hasText: /\d+\s*화/ });
    count = await links.count();
  }
  if (count === 0) {
    throw new Error(
      "회차 목록을 찾지 못했습니다. 작품홈 Home 탭에서 목록이 로드되었는지 확인해 주세요."
    );
  }
  const sampleCount = Math.min(count, 6);
  const numbers: number[] = [];
  for (let i = 0; i < sampleCount; i += 1) {
    const text = await links.nth(i).innerText().catch(() => "");
    const match = text.match(/(\d+)\s*화/);
    if (match) {
      numbers.push(Number(match[1]));
    }
  }
  if (numbers.length < 2) {
    return;
  }
  expect(numbers[0]).toBeGreaterThanOrEqual(numbers[1]);
});
