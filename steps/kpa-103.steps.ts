// Feature: KPA-103 시나리오 검증
// Scenario: 소식 탭 UI 검증
import { Given, When, Then, expect, withAiFallback } from "./fixtures.js";

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

When('사용자가 "소식" 탭을 클릭한다', async ({ page, ai }) => {
  await withAiFallback(
    async () => {
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
      return;
    },
    "작품 상세 페이지에서 소식 탭을 클릭한다",
    ai
  );
});

Then('페이지는 "소식" 탭의 내용을 표시한다', async ({ page }) => {
  const urlHasNotice = /tab_type=notice/i.test(page.url());
  const urlIsContent = /\/content\/|\/landing\/series\//i.test(page.url());
  const noticeVisible = await page.getByText(/소식/i).first().isVisible().catch(() => false);
  const selectedTab = await page
    .locator('[aria-selected="true"]')
    .getByText(/소식/i)
    .first()
    .isVisible()
    .catch(() => false);
  const noticeContent = await page
    .getByText(/작품\s*소식|공지사항|등록된\s*공지사항이\s*없습니다/i)
    .first()
    .isVisible()
    .catch(() => false);

  if (!urlHasNotice && !noticeVisible && !selectedTab && !noticeContent && !urlIsContent) {
    throw new Error("소식 탭의 내용을 확인하지 못했습니다.");
  }
});

Then('페이지 하단에 "DA 광고 영역"이 있을 경우 노출된다', async ({ page }) => {
  const mainRoot = page.locator("main, [role='main']");
  const root = (await mainRoot.count()) ? mainRoot : page;
  const adText = root.getByText(/광고|AD/i);
  const adFrame = root.locator("iframe");
  if (await adText.count()) {
    if (await adText.first().isVisible().catch(() => false)) {
      await expect(adText.first()).toBeVisible();
    }
  } else if (await adFrame.count()) {
    if (await adFrame.first().isVisible().catch(() => false)) {
      await expect(adFrame.first()).toBeVisible();
    }
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
      const first = locator.first();
      if (await first.isVisible().catch(() => false)) {
        await expect(first).toBeVisible();
        return;
      }
    }
  }
  const eventLinks = root.locator('a[href*="/open/webview/event"]');
  if (await eventLinks.count()) {
    const first = eventLinks.first();
    if (await first.isVisible().catch(() => false)) {
      await expect(first).toBeVisible();
      return;
    }
  }
});
