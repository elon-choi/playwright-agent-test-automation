// Feature: KPA-099 시나리오 검증
// Scenario: 정보 탭 UI 요소 검증
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

When("사용자가 정보 탭을 클릭한다", async ({ page }) => {
  await ensureContentPage(page);
  const infoTabCandidates = [
    page.getByRole("tab", { name: /정보/i }),
    page.getByRole("link", { name: /정보/i }),
    page.getByRole("button", { name: /정보/i })
  ];
  for (const locator of infoTabCandidates) {
    if (await locator.count()) {
      await locator.first().click();
      return;
    }
  }
  throw new Error("정보 탭을 찾지 못했습니다.");
});

Then("정보 탭 하단에 다음 요소들이 노출된다:", async ({ page }) => {
  const mainRoot = page.locator("main, [role='main']");
  const root = (await mainRoot.count()) ? mainRoot : page;
  const requiredPatterns = [/줄거리/, /키워드/, /상세\s*정보/];
  for (const pattern of requiredPatterns) {
    const locator = root.getByText(pattern).first();
    await expect(locator).toBeVisible();
  }

  const adText = root.getByText(/광고|AD/i);
  const adFrame = root.locator("iframe");
  if (await adText.count()) {
    await expect(adText.first()).toBeVisible();
  } else if (await adFrame.count()) {
    await expect(adFrame.first()).toBeVisible();
  } else {
    throw new Error("DA 광고 영역을 찾지 못했습니다.");
  }

  const optionalPatterns = [/티저\s*영상/, /이\s*작품과\s*함께보는\s*웹툰/, /이\s*작가의\s*다른\s*작품/, /동일작/];
  for (const pattern of optionalPatterns) {
    const locator = root.getByText(pattern);
    if (await locator.count()) {
      await expect(locator.first()).toBeVisible();
    }
  }
});
