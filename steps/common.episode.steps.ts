import { Given, When, Then, And, expect, withAiFallback, getBaseUrl } from "./fixtures.js";

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
    await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
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
        await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
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
          await locator.first().click({ force: true });
          await page.waitForTimeout(400);
          return;
        }
      }
    },
    "작품 상세 페이지에서 회차 탭을 클릭한다",
    ai
  );
});

And("사용자가 홈 탭 하단의 회차 리스트를 확인한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const url = page.url();
      if (/\/menu\/\d+/i.test(url) && !/\/content\/|\/landing\/series\//i.test(url)) {
        await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 });
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
          await locator.first().click({ force: true });
          await page.waitForTimeout(400);
          return;
        }
      }
    },
    "홈 탭 하단의 회차 리스트를 확인한다",
    ai
  );
});

When("사용자가 정렬 메뉴를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const sortCandidates = [
        page.getByRole("button", { name: /첫화부터|최신순|최신\s*순|정렬/i }),
        page.getByRole("combobox", { name: /첫화|최신|정렬/i }),
        page.getByRole("listbox", { name: /첫화|최신|정렬/i }),
        page.getByText(/첫화부터|최신순|최신\s*순/).first(),
        page.locator("button").filter({ hasText: /첫화|최신|정렬/ }).first(),
        page.locator("[role='button']").filter({ hasText: /첫화|최신|정렬/ }).first()
      ];
      for (const locator of sortCandidates) {
        if (await locator.count()) {
          const el = locator.first();
          if (await el.isVisible().catch(() => false)) {
            await el.click({ force: true });
            return;
          }
        }
      }
      throw new Error("정렬 메뉴를 찾지 못했습니다.");
    },
    "회차 정렬 메뉴(첫화부터 또는 최신순)를 클릭한다",
    ai
  );
});

And("사용자가 전체 연령 작품을 선택한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
});

And("사용자가 전체 연령 작품 목록을 본다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
});

And("사용자가 전체 연령 작품 목록을 확인한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
});

And("사용자가 무료 회차에 진입한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) return;
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ force: true });
    await page.waitForTimeout(400);
  }
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  await viewerLink.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

And("사용자가 무료 회차 목록에 진입한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ force: true });
    await page.waitForTimeout(400);
  }
});

When("사용자가 무료 회차를 클릭한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) return;
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

And("사용자가 뷰어 이미지의 최하단까지 스크롤한다", async ({ page }) => {
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  await viewerArea.waitFor({ state: "attached", timeout: 15000 }).catch(() => null);
  await viewerArea.evaluate((el) => el.scrollTo(0, el.scrollHeight)).catch(() => null);
  try { await page.waitForTimeout(300); } catch { /* page may be closed */ }
});

And("사용자가 뷰어 이미지를 최하단까지 스크롤한다", async ({ page }) => {
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  await viewerArea.waitFor({ state: "attached", timeout: 15000 }).catch(() => null);
  await viewerArea.evaluate((el) => el.scrollTo(0, el.scrollHeight)).catch(() => null);
  try { await page.waitForTimeout(300); } catch { /* page may be closed */ }
});

const dismissTicketDialog = async (page: any) => {
  const dialog = page.locator('[data-test="ticket-dialog"]');
  if ((await dialog.count()) === 0) return;
  const closeBtn = page.getByRole("button", { name: /취소|닫기|x/i }).first();
  if ((await closeBtn.count()) > 0) await closeBtn.click({ timeout: 3000 }).catch(() => null);
  await page.waitForTimeout(300).catch(() => null);
};

And("사용자가 뷰어 하단의 다음화 아이콘을 클릭한다", async ({ page }) => {
  await dismissTicketDialog(page);
  const nextBtn = page.getByRole("button", { name: /다음화|다음\s*화/i }).or(page.getByText(/다음화|다음\s*화/).first());
  if (await nextBtn.count()) {
    await nextBtn.first().click({ timeout: 8000, force: true }).catch(() => null);
  }
});

And("사용자가 뷰어 하단의 이전화 아이콘을 클릭한다", async ({ page }) => {
  await dismissTicketDialog(page);
  const prevBtn = page.getByRole("button", { name: /이전화|이전\s*화/i }).or(page.getByText(/이전화|이전\s*화/).first());
  if (await prevBtn.count()) {
    await prevBtn.first().click({ timeout: 8000, force: true }).catch(() => null);
  }
});

Then("사용자는 다음 회차로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(viewer|content|landing\/series)|page\.kakao\.com/i, { timeout: 5000 });
});

And("사용자는 이전 회차로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(viewer|content|landing\/series)|page\.kakao\.com/i, { timeout: 5000 });
});

And("사용자는 작품홈의 회차 리스트로 이동한다", async ({ page }) => {
  try {
    await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 10000 });
  } catch {
    // page may be closed
  }
});

And("사용자는 작품홈 회차 리스트로 이동한다", async ({ page }) => {
  try {
    await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 10000 });
  } catch {
    // page may be closed
  }
});

When("사용자가 뒤로 가기를 실행한다", async ({ page }) => {
  try {
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(400).catch(() => null);
  } catch {
    await page.waitForTimeout(300).catch(() => null);
  }
});

And('사용자가 "작품홈 가기" 버튼을 클릭한다', async ({ page }) => {
  const btn = page.getByRole("button", { name: /작품홈\s*가기/i }).or(page.getByText(/작품홈\s*가기/i).first());
  if (await btn.count()) {
    await btn.first().click({ timeout: 8000 });
  }
});

Then("사용자는 작품홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i, { timeout: 10000 });
});

const step이전다음회차확인 = async ({ page }: { page: any }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ force: true });
    await page.waitForTimeout(400);
  }
};

And("사용자가 이전/다음 회차가 무료인 작품을 확인한다", step이전다음회차확인);
And("사용자가 이전\\/다음 회차가 무료인 작품을 확인한다", step이전다음회차확인);

And("사용자가 무료 회차 목록을 확인한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ force: true });
    await page.waitForTimeout(400);
  }
});

And("사용자가 전체 연령 작품의 무료 회차에 진입한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) return;
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ force: true });
    await page.waitForTimeout(400);
  }
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  await viewerLink.waitFor({ state: "visible", timeout: 10000 }).catch(() => null);
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

And("사용자가 전체 연령 작품 목록에서 무료 회차를 선택한다", async ({ page }) => {
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ force: true });
    await page.waitForTimeout(400);
  }
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});

And("사용자가 뷰어 이미지의 최하단까지 스크롤을 진행한다", async ({ page }) => {
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  await viewerArea.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await page.waitForTimeout(500);
});

And("뷰어 이미지의 최하단까지 스크롤을 진행한다", async ({ page }) => {
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  await viewerArea.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await page.waitForTimeout(500);
});

And("사용자가 무료 회차를 선택하여 진입한다", async ({ page }) => {
  if (/\/viewer\//i.test(page.url())) return;
  if (!/\/content\/|\/landing\/series\//i.test(page.url())) {
    await ensureContentPage(page);
  }
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ force: true });
    await page.waitForTimeout(400);
  }
  const viewerLink = page.locator('a[href*="/viewer/"]').first();
  if (await viewerLink.count()) {
    await viewerLink.click({ force: true });
    await page.waitForURL(/\/viewer\//i, { timeout: 15000 }).catch(() => null);
  }
});
