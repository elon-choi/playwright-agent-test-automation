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

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  await loginPage.goto(url);
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
});

Given("사용자는 로그인하지 않은 상태이다", async ({ loginPage }) => {
  await loginPage.ensureLoggedOut();
});

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

When('사용자가 정보 탭 하단의 "동일작" 섹션에서 원작 소설 작품을 클릭한다', async ({ page }) => {
  await page.waitForLoadState("networkidle");
  await page.getByText(/줄거리|키워드|동일작/i).first().waitFor({ state: "visible", timeout: 15000 });

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

  const novelLinks = page.locator('a[href^="/content/"]').filter({ hasText: /웹소설|소설/ });
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

  throw new Error(`동일작 섹션의 원작 소설 작품을 찾지 못했습니다. 현재 URL: ${currentUrl}`);
});

Then("사용자는 해당 작품홈 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
  if (originalContentUrl) {
    expect(page.url()).not.toBe(originalContentUrl);
  }
});
