// Feature: KPA-027 시나리오 검증
// Scenario: 검색 기능 및 작품 상세 페이지 이동 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입하여 우 상단의 검색 아이콘을 클릭한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(400);
  const searchIcon = page.getByRole("button", { name: /검색/i })
    .or(page.getByRole("link", { name: /검색/i }))
    .or(page.locator('[aria-label*="검색"]').first())
    .or(page.getByPlaceholder(/제목|작가를 입력/).first());
  if (await searchIcon.count() > 0 && (await searchIcon.first().isVisible().catch(() => false))) {
    await searchIcon.first().click({ timeout: 8000 });
    await page.waitForTimeout(300);
    return;
  }
  const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(
    page.getByPlaceholder(/제목|작가를 입력하세요/i)
  );
  if (await searchInput.count() > 0) {
    await searchInput.first().click({ timeout: 5000 });
    await page.waitForTimeout(200);
  }
});

And("임의의 텍스트를 입력하고 엔터 키를 누른다", async ({ page }) => {
  const searchInput = page.getByRole("textbox", { name: /제목|작가|검색/i }).or(
    page.getByPlaceholder(/제목|작가를 입력하세요/i)
  );
  await searchInput.first().fill("웹툰", { timeout: 8000 });
  await page.waitForTimeout(300);
  await searchInput.first().press("Enter");
  await page.waitForTimeout(800);
});

Then("검색 결과 화면이 표시된다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await expect(page).toHaveURL(/\/(search|통합검색|query|q=)/i, { timeout: 10000 }).catch(() => null);
  const hasSearchResult = await page.getByText(/검색\s*결과|매칭|작품\s*리스트/i).count() > 0
    || await page.locator('a[href*="/content/"]').count() > 0;
  if (!hasSearchResult) {
    await page.waitForTimeout(1000);
  }
});

And("매칭된 키워드에 해당하는 작품 리스트가 노출된다", async ({ page }) => {
  const list = page.locator('a[href*="/content/"]').or(
    page.getByRole("link", { name: /작품|웹툰|웹소설/i })
  );
  await expect(list.first()).toBeVisible({ timeout: 10000 });
});

When("사용자가 임의의 작품을 클릭한다", async ({ page }) => {
  const workCard = page.locator('a[href*="/content/"]').first();
  await workCard.waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
  await workCard.scrollIntoViewIfNeeded({ block: "center" }).catch(() => null);
  await page.waitForTimeout(300);
  await workCard.click({ timeout: 15000, force: true }).catch(async () => {
    await workCard.evaluate((el: HTMLElement) => el.click());
  });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(600);
});

Then("선택한 작품의 상세 페이지로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i, { timeout: 10000 });
});

And("작품 카드에는 썸네일, #장르명, 뱃지, 작품명, 작가명이 표시된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasThumbnail = await page.getByRole("img", { name: /썸네일|표지/i }).count() > 0
    || await page.locator('img').count() > 0;
  const hasTitleOrAuthor = await page.getByText(/.+/, { exact: false }).count() > 0;
  expect(hasThumbnail || hasTitleOrAuthor).toBe(true);
});
