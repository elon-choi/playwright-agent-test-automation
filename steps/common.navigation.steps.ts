import { Given, When, Then, expect, ensurePageReady, getBaseUrl, getBaseUrlOrigin, dismissPermissionPopup } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다", async ({ page }) => {
  const recommendTab = page.getByRole("link", { name: /추천\s*탭|추천/i }).first();
  if (await recommendTab.count()) {
    await recommendTab.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await recommendTab.click({ force: true });
  }
});

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  const baseUrl = getBaseUrl();
  const baseOrigin = getBaseUrlOrigin();
  const targetUrl =
    url === "https://page.kakao.com/" || url === baseUrl ? baseUrl : url;
  await loginPage.goto(targetUrl);
  await ensurePageReady(page);
  await dismissPermissionPopup(page);
  if (/\/content\/|\/landing\/series\//i.test(url)) {
    await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
    return;
  }
  if (url === "https://page.kakao.com/" || url === baseUrl || /page\.kakao\.com/i.test(url)) {
    await expect(page).toHaveURL((u: URL) => u.origin === baseOrigin);
    return;
  }
  await expect(page).toHaveURL(url);
});

Then("캐시 내역 화면으로 다시 이동된다", async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page.getByText(/캐시\s*내역/i).first()).toBeAttached({ timeout: 8000 });
});

