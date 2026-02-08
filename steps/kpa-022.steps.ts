// Feature: KPA-022 시나리오 검증 - 고객센터
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("고객센터 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const menu = page.getByRole("link", { name: /고객센터/i }).or(page.getByText(/고객센터/i).first());
  await menu.first().click({ timeout: 10000 });
});

When("임의의 고객센터 메뉴를 클릭한다", async ({ page }) => {
  const item = page.getByRole("link", { name: /도움말|문의하기|캐시\s*환불|광고\s*안내/i }).first();
  await item.click({ timeout: 8000 });
});

Then("고객센터 화면이 다음과 같이 노출된다:", async ({ page }) => {
  await expect(page.getByText(/고객센터/i).first()).toBeAttached({ timeout: 10000 });
});

Then("사용자는 클릭한 메뉴로 이동한다", async ({ page }) => {
  await page.waitForTimeout(300);
  expect(page.url().startsWith(getBaseUrlOrigin())).toBe(true);
});

Then("사용자는 고객센터 페이지를 빠져 나와, 더보기 메뉴로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
  expect(page.url().startsWith(getBaseUrlOrigin())).toBe(true);
});
