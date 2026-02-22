// Feature: KPA-024 시나리오 검증 - 쿠폰 등록 (비유효 쿠폰 번호)
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("쿠폰등록 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const menu = page
    .getByRole("link", { name: /쿠폰\s*등록|쿠폰등록/i })
    .or(page.getByRole("button", { name: /쿠폰\s*등록|쿠폰등록/i }))
    .or(page.getByText(/쿠폰\s*등록|쿠폰등록/i).first());
  await menu.first().click({ timeout: 10000 });
});

Then("쿠폰 등록 화면으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasTitle = await page.getByText(/쿠폰\s*등록/i).first().isVisible({ timeout: 10000 }).catch(() => false);
  const hasInput = await page.getByPlaceholder(/쿠폰번호\s*등록|쿠폰\s*번호/i).first().isVisible({ timeout: 5000 }).catch(() => false);
  expect(hasTitle || hasInput).toBe(true);
});

When("임의의 쿠폰 번호를 입력 한다.", async ({ page }) => {
  const input = page
    .getByPlaceholder(/쿠폰번호\s*등록|쿠폰\s*번호/i)
    .or(page.getByRole("textbox", { name: /쿠폰/i }));
  await input.first().waitFor({ state: "visible", timeout: 8000 });
  await input.first().fill("INVALID-COUPON-123", { timeout: 5000 });
});

When("등록하기 버튼을 클릭한다.", async ({ page }) => {
  const btn = page.getByRole("button", { name: /등록하기/i }).first();
  await btn.waitFor({ state: "visible", timeout: 8000 });
  await btn.click({ timeout: 5000 });
});

Then("잘못된 형식의 쿠폰입니다.메세지 팝업이 노출된다.", async ({ page }) => {
  const message = page.getByText(/잘못된\s*형식의\s*쿠폰|잘못된\s*형식의\s*쿠폰입니다/i);
  await expect(message.first()).toBeVisible({ timeout: 10000 });
});

When("팝업의 확인 버튼을 클릭한다", async ({ page }) => {
  const confirmBtn = page.getByRole("button", { name: /확인/i }).first();
  await confirmBtn.waitFor({ state: "visible", timeout: 5000 });
  await confirmBtn.click({ timeout: 5000 });
});
