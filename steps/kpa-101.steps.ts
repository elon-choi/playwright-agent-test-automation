// Feature: KPA-101 시나리오 검증
// Scenario: 웹툰의 관련 소설 영역으로 이동
import { Given, When, Then, expect } from "./fixtures.js";

const targetContentUrl = "https://page.kakao.com/content/58095657?tab_type=about";

const ensureContentPage = async (page: any) => {
  if (/\/content\/|\/landing\/series\//i.test(page.url())) {
    return;
  }
  await page.goto(targetContentUrl, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
};

let originalContentUrl = "";

When('사용자가 상단 메뉴에서 "정보" 탭을 클릭한다', async ({ page }) => {
  await ensureContentPage(page);
  originalContentUrl = page.url();
  const infoTabCandidates = [
    page.getByRole("tab", { name: /정보/i }),
    page.getByRole("link", { name: /정보/i }),
    page.getByRole("button", { name: /정보/i })
  ];
  for (const locator of infoTabCandidates) {
    if (await locator.count()) {
      await locator.first().click();
      await page.getByText(/줄거리|키워드|상세\s*정보|정보/i).first().waitFor({ state: "visible" });
      return;
    }
  }
  throw new Error("정보 탭을 찾지 못했습니다.");
});

const identicalSectionXPath =
  '//*[@id="__next"]/div/div[2]/div[1]/div/div[2]/div[2]/div/div/div[3]/div[3]/div[1]/div/div';

When('사용자가 정보 탭 하단의 "동일작" 섹션에서 원작 소설 작품을 클릭한다', async ({ page }) => {
  await page.waitForLoadState("networkidle");
  await page.getByText(/줄거리|키워드|동일작/i).first().waitFor({ state: "visible", timeout: 15000 });

  const identicalSection = page.locator(`xpath=${identicalSectionXPath}`);
  if (await identicalSection.count()) {
    await identicalSection.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  } else {
    const fallbackSection = page.getByText(/동일작/i).first();
    if (await fallbackSection.count()) {
      await fallbackSection.scrollIntoViewIfNeeded().catch(() => null);
      await page.waitForTimeout(300);
    }
  }

  const currentUrl = page.url();
  const identicalSectionLinks = page.locator(
    'xpath=(//*[contains(normalize-space(.),"동일작")])[1]/following::a[contains(@href,"/content/")]'
  );
  if (await identicalSectionLinks.count()) {
    const novelLink = identicalSectionLinks.filter({ hasText: /웹소설|소설|회귀자\s*사용설명서/ });
    if (await novelLink.count()) {
      await Promise.all([
        page.waitForURL(
          (url: URL) =>
            /\/content\/\d+/i.test(url.toString()) && url.toString() !== currentUrl,
          { timeout: 15000 }
        ),
        novelLink.first().click()
      ]);
      return;
    }
    await Promise.all([
      page.waitForURL(
        (url: URL) =>
          /\/content\/\d+/i.test(url.toString()) && url.toString() !== currentUrl,
        { timeout: 15000 }
      ),
      identicalSectionLinks.first().click()
    ]);
    return;
  }

  const novelLinks = page.locator('a[href^="/content/"]').filter({ hasText: /웹소설|소설|동일작|원작/ });
  if (await novelLinks.count()) {
    await Promise.all([
      page.waitForURL(
        (url: URL) => /\/content\/\d+/i.test(url.toString()) && url.toString() !== currentUrl,
        { timeout: 15000 }
      ),
      novelLinks.first().click()
    ]);
    return;
  }

  throw new Error(`동일작 섹션의 원작 소설 작품을 찾지 못했습니다. 현재 URL: ${page.url()}`);
});

Then("사용자는 해당 작품홈 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
  if (originalContentUrl) {
    expect(page.url()).not.toBe(originalContentUrl);
  }
});
