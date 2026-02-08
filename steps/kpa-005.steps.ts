// Feature: KPA-005 로그아웃 기능 검증
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("로그아웃 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const logoutMenu = page
    .getByRole("link", { name: /로그아웃/i })
    .or(page.getByRole("button", { name: /로그아웃/i }))
    .or(page.getByText(/로그아웃/i).first());
  await logoutMenu.waitFor({ state: "attached", timeout: 10000 });
  await logoutMenu.evaluate((el: HTMLElement) => {
    const clickable = el.closest("a, button, [role='button']") || el;
    (clickable as HTMLElement).click();
  });
});

When("[로그아웃] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const confirmVisible = await page.getByText(/로그아웃\s*하시겠습니까/i).first().isVisible().catch(() => false);
  if (confirmVisible) {
    return;
  }
  const logoutMenu = page
    .getByRole("link", { name: /로그아웃/i })
    .or(page.getByRole("button", { name: /로그아웃/i }))
    .or(page.getByText(/로그아웃/i).first());
  await logoutMenu.waitFor({ state: "attached", timeout: 5000 });
  await logoutMenu.evaluate((el: HTMLElement) => {
    const clickable = el.closest("a, button, [role='button']") || el;
    (clickable as HTMLElement).click();
  });
});

Then("안내 팝업이 노출된다", async ({ page }) => {
  await expect(page.getByText(/로그아웃\s*하시겠습니까/i).first()).toBeVisible({ timeout: 10000 });
});

Then("팝업에는 {string} 메시지가 표시된다", async ({ page }, message: string) => {
  await expect(page.getByText(message).first()).toBeVisible({ timeout: 8000 });
});

Then("팝업에는 [취소]와 [로그아웃] 버튼이 표시된다", async ({ page }) => {
  const cancel = page.getByRole("button", { name: /취소/i });
  const logout = page.getByRole("button", { name: /^로그아웃$/i });
  await expect(cancel.first()).toBeVisible({ timeout: 5000 });
  await expect(logout.first()).toBeVisible({ timeout: 5000 });
});

When("사용자가 팝업에서 [로그아웃] 버튼을 클릭한다", async ({ page }) => {
  const logoutInPopup = page.getByRole("button", { name: /^로그아웃$/i });
  await logoutInPopup.first().click({ timeout: 10000 });
});

Then("사용자는 로그아웃되고 메인홈으로 이동한다", async ({ page }) => {
  await page.waitForURL((u: URL) => u.origin === getBaseUrlOrigin(), { timeout: 15000 });
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin());
  const onLoginPage = /accounts\.kakao\.com\/login/i.test(page.url());
  expect(onLoginPage).toBe(false);
});

Then("메인홈 페이지가 정상적으로 표시된다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin());
  await expect(
    page.getByText(/추천|웹툰|웹소설|홈/i).first()
  ).toBeVisible({ timeout: 10000 });
});
