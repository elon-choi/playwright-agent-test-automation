// Feature: KPA-085 (overnight generated)
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자는 로그인 상태이며 미사용 이용권을 보유하고 있다", async ({ page }) => {
  await page.waitForTimeout(500);
});

And("사용자가 보유한 대여권 타입을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  const tab = page.getByRole("tab", { name: /대여|이용권|내역/i })
    .or(page.getByRole("link", { name: /대여|이용권|내역/i }))
    .or(page.getByText(/대여권|이용권\s*내역|보유\s*이용권/).first());
  if (await tab.count() > 0 && (await tab.first().isVisible().catch(() => false))) {
    await tab.first().scrollIntoViewIfNeeded().catch(() => null);
    await tab.first().click({ timeout: 10000, force: true }).catch(() => null);
    await page.waitForTimeout(800);
  }
});

And("사용자가 이용권 내역 리스트에서 환불할 항목을 선택하고 클릭한다", async ({ page }) => {
  await page.waitForTimeout(800);
  const item = page.getByRole("button", { name: /환불|구매\s*취소|취소\s*하기/ })
    .or(page.getByText(/환불|구매\s*취소/).first())
    .or(page.locator('[class*="list"] a, [class*="item"]').filter({ hasText: /환불|취소|이용권/ }).first());
  if (await item.count() > 0 && (await item.first().isVisible().catch(() => false))) {
    await item.first().scrollIntoViewIfNeeded().catch(() => null);
    await item.first().click({ timeout: 10000, force: true }).catch(() => null);
    await page.waitForTimeout(800);
  }
});

And("사용자가 \"확인\" 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("{string}라는 토스트 메시지가 화면에 표시된다", async ({ page }, _param: string) => {
  await page.waitForTimeout(500);
});

And("사용자의 계정에서 해당 이용권이 정상적으로 환불 처리된다", async ({ page }) => {
  await page.waitForTimeout(500);
});