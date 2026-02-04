// Feature: KPA-091 시나리오 검증
// Scenario: 회차 정렬 기능 검증
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
      await sectionCard.first().click();
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      return;
    }
  }

  const fallbackCard = page.locator('main a[href*="/content/"], a[href*="/content/"]');
  if (await fallbackCard.count()) {
    await fallbackCard.first().click();
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

When('사용자가 "첫화부터" 정렬 옵션을 클릭한다', async ({ page }) => {
  const optionCandidates = [
    page.getByRole("option", { name: /첫화부터/i }),
    page.getByRole("button", { name: /첫화부터/i }),
    page.getByText(/^첫화부터$/)
  ];
  for (const locator of optionCandidates) {
    if (await locator.count()) {
      await locator.first().click({ force: true });
      return;
    }
  }
  throw new Error("첫화부터 정렬 옵션을 찾지 못했습니다.");
});

Then('"첫화부터" 옵션이 화면에 노출된다', async ({ page }) => {
  const sortTrigger = page.getByRole("button", { name: /첫화부터|최신순/i });
  if (await sortTrigger.count()) {
    await sortTrigger.first().click({ force: true });
  }
  await expect(page.getByText(/첫화부터/i).first()).toBeVisible();
});

Then("회차가 1화부터 순서대로 정렬되어 화면에 노출된다", async ({ page }) => {
  const episodeLinks = page.locator('a[href*="/viewer/"]');
  const count = await episodeLinks.count();
  if (count === 0) {
    throw new Error("회차 목록을 찾지 못했습니다.");
  }
  const sampleCount = Math.min(count, 5);
  const titles: string[] = [];
  for (let i = 0; i < sampleCount; i += 1) {
    titles.push(await episodeLinks.nth(i).innerText());
  }
  const firstIndex = titles.findIndex((text) => /1화/.test(text));
  const secondIndex = titles.findIndex((text) => /2화/.test(text));
  if (firstIndex === -1) {
    throw new Error("1화 항목을 찾지 못했습니다.");
  }
  if (secondIndex !== -1) {
    expect(firstIndex).toBeLessThan(secondIndex);
  }
});
