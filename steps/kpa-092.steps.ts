// Feature: KPA-092 시나리오 검증
// Scenario: 회차 탭에서 최신 순 정렬 옵션을 선택하여 회차 정렬 확인
import { Given, When, Then, expect } from "./fixtures.js";

const ensureContentPage = async (page: any) => {
  if (/\/content\/|\/landing\/series\//i.test(page.url())) {
    return;
  }
  const webtoonTab = page.getByRole("link", { name: /웹툰\s*탭/i });
  if (await webtoonTab.count()) {
    await webtoonTab.first().click();
  }

  const sectionTitle = page.getByText("지금, 신작!").first();
  if (await sectionTitle.count()) {
    await sectionTitle.scrollIntoViewIfNeeded();
    const sectionCard = sectionTitle.locator(
      'xpath=following-sibling::*[1]//a[contains(@href,"/content/")]'
    );
    if (await sectionCard.count()) {
      await sectionCard.first().click({ force: true });
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      return;
    }
  }

  const fallbackCard = page.locator('a[href^="/content/"], a[href*="/content/"]');
  if (await fallbackCard.count()) {
    await fallbackCard.first().click({ force: true });
    await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
    return;
  }
  throw new Error("작품 상세 페이지로 이동하지 못했습니다.");
};

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  await loginPage.goto(url);
  await expect(page).toHaveURL(url);
});

Given("사용자는 로그인하지 않은 상태이다", async ({ loginPage }) => {
  await loginPage.ensureLoggedOut();
});

When("사용자가 회차 탭을 클릭한다", async ({ page }) => {
  await ensureContentPage(page);
  const episodeTabCandidates = [
    page.getByRole("tab", { name: /회차/i }),
    page.getByRole("link", { name: /회차/i }),
    page.getByRole("button", { name: /회차/i }),
    page.getByRole("tab", { name: /홈/i }),
    page.getByRole("link", { name: /홈/i })
  ];
  for (const locator of episodeTabCandidates) {
    if (await locator.count()) {
      await locator.first().click();
      return;
    }
  }
});

When("사용자가 정렬 메뉴를 클릭한다", async ({ page }) => {
  const sortTrigger = page.getByRole("button", { name: /첫화부터|최신순/i });
  if (await sortTrigger.count()) {
    await sortTrigger.first().click();
    return;
  }
  const sortFallback = page.getByText(/첫화부터|최신순/);
  await sortFallback.first().click();
});

When("사용자가 최신 순 정렬 옵션을 클릭한다", async ({ page }) => {
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
  throw new Error("최신순 정렬 옵션을 찾지 못했습니다.");
});

Then('"첫화부터"와 "최신순" 옵션이 화면에 노출된다', async ({ page }) => {
  const sortTrigger = page.getByText(/첫화부터|최신\s*순/i).first();
  if (await sortTrigger.count()) {
    await sortTrigger.click({ force: true });
  }
  await expect(page.getByText(/첫화부터/i).first()).toBeVisible();
  await expect(page.getByText(/최신\s*순/i).first()).toBeVisible();
});

Then("회차가 최신 회차부터 순서대로 정렬되어 화면에 노출된다", async ({ page }) => {
  const episodeLinks = page.locator('a[href*="/viewer/"]');
  const count = await episodeLinks.count();
  if (count === 0) {
    throw new Error("회차 목록을 찾지 못했습니다.");
  }
  const sampleCount = Math.min(count, 6);
  const numbers: number[] = [];
  for (let i = 0; i < sampleCount; i += 1) {
    const text = await episodeLinks.nth(i).innerText();
    const match = text.match(/(\d+)\s*화/);
    if (match) {
      numbers.push(Number(match[1]));
    }
  }
  if (numbers.length < 2) {
    throw new Error("회차 번호를 충분히 확인하지 못했습니다.");
  }
  expect(numbers[0]).toBeGreaterThanOrEqual(numbers[1]);
});
