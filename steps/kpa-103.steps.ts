// Feature: KPA-103 시나리오 검증
// Scenario: 소식 탭 UI 검증
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

When('사용자가 "소식" 탭을 클릭한다', async ({ page }) => {
  await ensureContentPage(page);
  const noticeTabCandidates = [
    page.getByRole("tab", { name: /소식/i }),
    page.getByRole("link", { name: /소식/i }),
    page.getByRole("button", { name: /소식/i })
  ];
  for (const locator of noticeTabCandidates) {
    if (await locator.count()) {
      await locator.first().click({ force: true });
      return;
    }
  }
  const noticeText = page.getByText(/소식/i);
  if (await noticeText.count()) {
    await noticeText.first().click({ force: true });
    return;
  }
  throw new Error("소식 탭을 찾지 못했습니다.");
});

Then('페이지는 "소식" 탭의 내용을 표시한다', async ({ page }) => {
  await expect(page).toHaveURL(/tab_type=notice/i);
  await expect(page.getByText(/소식/i).first()).toBeVisible();
});

Then('페이지 하단에 "DA 광고 영역"이 있을 경우 노출된다', async ({ page }) => {
  const mainRoot = page.locator("main, [role='main']");
  const root = (await mainRoot.count()) ? mainRoot : page;
  const adText = root.getByText(/광고|AD/i);
  const adFrame = root.locator("iframe");
  if (await adText.count()) {
    await expect(adText.first()).toBeVisible();
  } else if (await adFrame.count()) {
    await expect(adFrame.first()).toBeVisible();
  }
});

Then('페이지 하단에 "작품 소식 영역" 또는 안내 문구가 노출된다', async ({ page }) => {
  const mainRoot = page.locator("main, [role='main']");
  const root = (await mainRoot.count()) ? mainRoot : page;
  const noticeCandidates = [
    root.getByText(/작품\s*소식/i),
    root.getByText(/등록된\s*공지사항이\s*없습니다/i),
    root.getByText(/공지사항|기획전/i)
  ];
  for (const locator of noticeCandidates) {
    if (await locator.count()) {
      await expect(locator.first()).toBeVisible();
      return;
    }
  }
  const eventLinks = root.locator('a[href*="/open/webview/event"]');
  if (await eventLinks.count()) {
    await expect(eventLinks.first()).toBeVisible();
    return;
  }
  throw new Error("작품 소식 영역을 찾지 못했습니다.");
});
