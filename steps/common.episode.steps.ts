import { Given, When, expect, withAiFallback } from "./fixtures.js";

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

  const fallbackCard = page.locator('main a[href*="/content/"], a[href*="/content/"]');
  if (await fallbackCard.count()) {
    await fallbackCard.first().click({ force: true });
    await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
    return;
  }
  throw new Error("작품 상세 페이지로 이동하지 못했습니다.");
};

Given("사용자가 특정 작품홈에 진입한다", async ({ page }) => {
  const url = page.url();
  if (/\/menu\/\d+/i.test(url) && !/\/content\/|\/landing\/series\//i.test(url)) {
    await page.goto("https://page.kakao.com/", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(300);
  }
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
});

When("사용자가 회차 탭을 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const url = page.url();
      if (/\/menu\/\d+/i.test(url) && !/\/content\/|\/landing\/series\//i.test(url)) {
        await page.goto("https://page.kakao.com/", { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(300);
      }
      if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
        await ensureContentPage(page);
      }
      const episodeTabCandidates = [
        page.getByRole("tab", { name: /회차/i }),
        page.getByRole("link", { name: /회차/i }),
        page.getByRole("button", { name: /회차/i })
      ];
      for (const locator of episodeTabCandidates) {
        if (await locator.count()) {
          await locator.first().click();
          await page.waitForTimeout(400);
          return;
        }
      }
    },
    "작품 상세 페이지에서 회차 탭을 클릭한다",
    ai
  );
});

When("사용자가 정렬 메뉴를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const sortTrigger = page.getByRole("button", { name: /첫화부터|최신순|최신\s*순/i });
      if (await sortTrigger.count()) {
        await sortTrigger.first().click();
        return;
      }
      const sortFallback = page.getByText(/첫화부터|최신순|최신\s*순/);
      if (await sortFallback.count()) {
        await sortFallback.first().click();
        return;
      }
      throw new Error("정렬 메뉴를 찾지 못했습니다.");
    },
    "회차 정렬 메뉴(첫화부터 또는 최신순)를 클릭한다",
    ai
  );
});
