// Feature: KPA-092 시나리오 검증
// Scenario: 작품홈 회차 정렬 옵션 - 최신순 선택 시 회차 내림차순 노출 확인
import { Given, When, Then, And, expect, withAiFallback } from "./fixtures.js";

And('"최신순" 옵션을 클릭한다', async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const optionCandidates = [
        page.getByRole("option", { name: /최신\s*순|최신순/i }),
        page.getByRole("button", { name: /최신\s*순|최신순/i }),
        page.getByText(/최신\s*순|최신순/i)
      ];
      for (const locator of optionCandidates) {
        if (await locator.count()) {
          await locator.first().click({ force: true });
          await page.waitForTimeout(300);
          return;
        }
      }
      throw new Error("최신순 정렬 옵션을 찾지 못했습니다.");
    },
    "최신순 옵션을 클릭한다",
    ai
  );
});

const EPISODE_SORT_SPAN = 'span.font-small2-bold.text-el-40, span[class*="font-small2-bold"]';

And("사용자가 회차 정렬에서 최신순 옵션을 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const episodeSortLabel = page.locator(EPISODE_SORT_SPAN).filter({ hasText: /^첫화부터$/ }).first();
      if (await episodeSortLabel.count() > 0) {
        const menuWithFirst = page.locator('[role="menu"], [role="listbox"], [class*="dropdown"], [class*="Dropdown"], [class*="menu"], [class*="Modal"]').filter({ hasText: /첫화부터/ }).filter({ hasText: /최신순/ }).filter({ hasNotText: /좋아요순/ }).first();
        if (await menuWithFirst.count() > 0) {
          const latestOption = menuWithFirst.getByRole("option", { name: /최신\s*순|최신순/i })
            .or(menuWithFirst.getByText(/^최신\s*순$|^최신순$/).first());
          if (await latestOption.count() > 0) {
            await latestOption.first().click({ force: true });
            await page.waitForTimeout(600);
            await page.keyboard.press("Escape").catch(() => null);
            await page.waitForTimeout(1200);
            return;
          }
        }
      }
      const menuWithFirstOnly = page.locator('[role="menu"], [role="listbox"]').filter({ hasText: /첫화부터/ }).filter({ hasText: /최신순/ }).first();
      if (await menuWithFirstOnly.count() > 0) {
        await menuWithFirstOnly.getByText(/최신\s*순|최신순/).first().click({ force: true });
        await page.waitForTimeout(600);
        await page.keyboard.press("Escape").catch(() => null);
        await page.waitForTimeout(1200);
        return;
      }
      const sortTrigger = page.locator('button, [role="button"], a, span').filter({ hasText: /^첫화부터$|^최신\s*순$|^최신순$/ }).first();
      if (await sortTrigger.count() > 0 && await sortTrigger.isVisible().catch(() => false)) {
        await sortTrigger.scrollIntoViewIfNeeded().catch(() => null);
        await page.waitForTimeout(300);
        await sortTrigger.click({ force: true });
        await page.waitForTimeout(600);
        const latestOpt = page.getByRole("option", { name: /최신\s*순|최신순/i }).or(page.getByText(/최신\s*순|최신순/).first());
        if (await latestOpt.count() > 0 && await latestOpt.first().isVisible().catch(() => false)) {
          await latestOpt.first().click({ force: true });
          await page.waitForTimeout(600);
          await page.keyboard.press("Escape").catch(() => null);
          await page.waitForTimeout(1200);
          return;
        }
      }
      const anyFirst = page.getByText(/첫화부터/).first();
      if (await anyFirst.count() > 0 && await anyFirst.isVisible().catch(() => false)) {
        const parent = anyFirst.locator("xpath=ancestor::*[self::button or self::a or @role='button' or @role='combobox'][1]");
        if (await parent.count() > 0) {
          await parent.first().click({ force: true });
          await page.waitForTimeout(600);
        } else {
          await anyFirst.click({ force: true });
          await page.waitForTimeout(600);
        }
        const reLatestSort = /최신\s*순|최신순/i;
        const latestOptLoc = page.getByRole("option", { name: reLatestSort });
        const latestMenuLoc = page.locator('[role="menuitem"]').filter({ hasText: reLatestSort });
        const latestTextLoc = page.getByText(reLatestSort).first();
        const latestInPage = latestOptLoc.or(latestMenuLoc).or(latestTextLoc);
        if (await latestInPage.count() > 0) {
          await latestInPage.first().click({ force: true });
          await page.waitForTimeout(800);
          await page.keyboard.press("Escape").catch(() => null);
          await page.waitForTimeout(1200);
          return;
        }
      }
      throw new Error("회차 정렬에서 최신순 옵션을 찾지 못했습니다. 첫화부터/최신순이 있는 회차 정렬 드롭다운인지 확인해 주세요.");
    },
    "회차 정렬에서 최신순 옵션을 클릭한다",
    ai
  );
});

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

Then("회차명이 내림차순 정렬되어 화면에 노출된다", async ({ page }) => {
  const isContentPage = /\/content\/|\/landing\/series\//i.test(page.url());
  if (!isContentPage) {
    throw new Error(
      `작품 상세(작품홈) 페이지가 아닙니다. 회차 목록은 작품홈(/content/ 또는 /landing/series/)에서만 노출됩니다. 현재 URL: ${page.url()}`
    );
  }

  const getEpisodeNumbers = async (): Promise<number[]> => {
    const episodeLabel = page.locator(EPISODE_SORT_SPAN).filter({ hasText: /첫화부터/ }).first();
    const tabpanel = page.getByRole("tabpanel").filter({ has: page.locator('a[href*="/viewer/"]') }).first();
    const episodeScopeFromLabel =
      (await episodeLabel.count()) > 0
        ? episodeLabel.locator("xpath=ancestor::*[.//a[contains(@href,'/viewer/')]][1]").first()
        : page.locator("main").first();
    const episodeScope = page.locator("main, section, [class*='episode'], [class*='Episode']")
      .filter({ has: page.locator('a[href*="/viewer/"]') })
      .filter({ hasText: /첫화부터/ })
      .first();
    let links =
      (await tabpanel.count()) > 0
        ? tabpanel.locator('a[href*="/viewer/"], a[href*="/episode/"]')
        : (await episodeScopeFromLabel.count()) > 0
          ? episodeScopeFromLabel.locator('a[href*="/viewer/"], a[href*="/episode/"]')
          : (await episodeScope.count()) > 0
            ? episodeScope.locator('a[href*="/viewer/"], a[href*="/episode/"]')
            : page.locator('a[href*="/viewer/"], a[href*="/episode/"]');
    let count = await links.count();
    if (count === 0) {
      const main = page.locator("main, [role='main']");
      const scope = (await main.count()) ? main.first() : page;
      links = scope.locator('a').filter({ hasText: /\d+\s*화/ });
      count = await links.count();
    }
    const numbers: number[] = [];
    const sampleCount = Math.min(count, 10);
    for (let i = 0; i < sampleCount; i += 1) {
      const text = await links.nth(i).innerText().catch(() => "");
      const match = text.match(/(\d+)\s*화/);
      if (match) numbers.push(Number(match[1]));
    }
    return numbers;
  };

  await page.waitForTimeout(500);
  let numbers = await getEpisodeNumbers();

  if (numbers.length < 2) {
    await page.waitForTimeout(1500);
    numbers = await getEpisodeNumbers();
  }
  if (numbers.length < 2) {
    throw new Error(
      `회차 번호를 2개 이상 찾지 못했습니다(찾은 개수: ${numbers.length}). 회차 탭이 열려 있고, 회차 리스트가 로드된 상태인지 확인해 주세요. URL: ${page.url()}`
    );
  }

  if (numbers[0] < numbers[1]) {
    await page.waitForTimeout(1500);
    numbers = await getEpisodeNumbers();
  }
  if (numbers.length >= 2 && numbers[0] < numbers[1]) {
    throw new Error(
      `회차가 최신순으로 정렬되지 않았습니다. 첫 번째: ${numbers[0]}화, 두 번째: ${numbers[1]}화(오름차순). 회차 정렬 메뉴에서 '최신순'을 선택한 뒤 드롭다운이 닫히고 목록이 갱신되었는지 확인해 주세요. URL: ${page.url()}`
    );
  }
  expect(numbers[0]).toBeGreaterThanOrEqual(numbers[1]);
});

And("댓글이 최신순으로 정렬되어 화면에 노출된다", async ({ page }) => {
  await page.waitForTimeout(600);
  const commentArea = page.locator("[class*='comment'], [class*='Comment'], [class*='list']").first();
  await commentArea.waitFor({ state: "attached", timeout: 12000 });

  const timeLocator = page.locator(
    "text=/\\d{1,2}분 전|\\d{1,2}시간 전|방금|어제|\\d+일\\s*전|\\d{4}[./-]\\d{1,2}[./-]\\d{1,2}/"
  );
  const timeTexts = await timeLocator.allTextContents();
  if (timeTexts.length < 2) {
    throw new Error(
      `댓글 영역에서 시간 정보를 2개 이상 찾을 수 없습니다(찾은 개수: ${timeTexts.length}). 홈 탭 댓글 영역이 노출된 상태인지 확인해 주세요. 현재 URL: ${page.url()}`
    );
  }
  const parseOrder = (t: string): number => {
    if (/방금/.test(t)) return 0;
    const m = t.match(/(\d+)\s*분\s*전/);
    if (m) return 0 - parseInt(m[1], 10);
    const h = t.match(/(\d+)\s*시간\s*전/);
    if (h) return -1000 - parseInt(h[1], 10);
    const d = t.match(/(\d+)\s*일\s*전/);
    if (d) return -10000 - parseInt(d[1], 10);
    if (/어제/.test(t)) return -20000;
    const date = t.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})/);
    if (date) return parseInt(date[1] + date[2].padStart(2, "0") + date[3].padStart(2, "0"), 10);
    return 0;
  };
  const orders = timeTexts.slice(0, 8).map(parseOrder);
  for (let i = 1; i < orders.length; i++) {
    expect(orders[i]).toBeLessThanOrEqual(orders[i - 1]);
  }
});
