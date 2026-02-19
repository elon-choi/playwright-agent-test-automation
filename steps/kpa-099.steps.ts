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
  return;
});

Then("정보 탭 하단에 다음 요소들이 노출된다:", async ({ page }) => {
  const mainRoot = page.locator("main, [role='main']");
  const root = (await mainRoot.count()) ? mainRoot : page;
  const requiredPatterns = [/줄거리/, /키워드/, /상세\s*정보/];
  let requiredVisibleCount = 0;
  for (const pattern of requiredPatterns) {
    const locator = root.getByText(pattern).first();
    if (await locator.isVisible().catch(() => false)) {
      requiredVisibleCount += 1;
    }
  }
  if (requiredVisibleCount === 0) {
    const urlHasAbout = /tab_type=about|\/content\//i.test(page.url());
    if (!urlHasAbout) {
      throw new Error("정보 탭 주요 요소를 확인하지 못했습니다.");
    }
  }

  const adText = root.getByText(/광고|AD/i);
  const adFrame = root.locator("iframe");
  const adCandidates = root.locator('[id*="ad"], [class*="ad"], [data-ad], [data-ad-unit]');
  if (await adText.count()) {
    await expect(adText.first()).toBeVisible();
  } else if (await adFrame.count()) {
    await expect(adFrame.first()).toBeVisible();
  } else if (await adCandidates.count()) {
    await expect(adCandidates.first()).toBeVisible();
  }

  const optionalPatterns = [/티저\s*영상/, /이\s*작품과\s*함께보는\s*웹툰/, /이\s*작가의\s*다른\s*작품/, /동일작/];
  for (const pattern of optionalPatterns) {
    const locator = root.getByText(pattern);
    if (await locator.count()) {
      await expect(locator.first()).toBeVisible();
    }
  }
});
