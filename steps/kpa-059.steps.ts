// Feature: KPA-059 시나리오 검증
// Scenario: 바로가기 메뉴를 통한 페이지 이동 및 구성 요소 확인
import { Given, When, Then, expect } from "./fixtures.js";

let selectedShortcutUrl: string | null = null;

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  await loginPage.goto(url);
  await expect(page).toHaveURL(url);
});

Given("사용자는 로그인하지 않은 상태이다", async ({ loginPage }) => {
  await loginPage.ensureLoggedOut();
});

When("사용자가 웹 페이지 하단의 바로가기 메뉴를 클릭한다", async ({ page }) => {
  const shortcutLink = page.locator('a[href="/shortcut/list"]');
  if (await shortcutLink.count()) {
    await shortcutLink.first().click();
    return;
  }
  const fallback = page.getByRole("link", { name: /바로가기/i });
  await fallback.first().click();
});

Then("바로가기 메뉴 화면이 다음과 같이 구성되어 있는지 확인한다:", async ({ page }) => {
  await expect(page).toHaveURL(/\/shortcut\/list/i);

  await expect(page.getByRole("link", { name: /웹툰/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /웹소설/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /책/i }).first()).toBeVisible();

  await expect(page.getByText("추천").first()).toBeVisible();
  await expect(page.getByText("웹툰").first()).toBeVisible();
  await expect(page.getByText("웹소설").first()).toBeVisible();
  await expect(page.getByText("책").first()).toBeVisible();
});

When("사용자가 임의의 바로가기 메뉴를 클릭한다", async ({ page }) => {
  const shortcutLinks = page.locator(
    [
      'a[href^="/menu/"]',
      'a[href^="/landing/"]',
      'a[href^="/ranking/"]',
      'a[href^="/content/"]'
    ].join(", ")
  );
  if (!(await shortcutLinks.count())) {
    throw new Error("바로가기 메뉴 링크를 찾지 못했습니다.");
  }
  selectedShortcutUrl = await shortcutLinks.first().getAttribute("href");
  await shortcutLinks.first().click();
});

Then("사용자는 클릭한 메뉴에 해당하는 페이지로 이동한다", async ({ page }) => {
  if (!selectedShortcutUrl) {
    throw new Error("바로가기 URL을 확보하지 못했습니다.");
  }
  await expect(page).toHaveURL(new RegExp(selectedShortcutUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
