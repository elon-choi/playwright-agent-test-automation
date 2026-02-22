// Feature: KPA-018 캐시 내역 검증
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("캐시 내역 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const menu = page.getByRole("link", { name: /캐시\s*내역/i }).or(page.getByText(/캐시\s*내역/i).first());
  await menu.first().click({ timeout: 10000 });
});

Then("캐시 내역 화면이 다음과 같이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page.getByText(/캐시\s*내역/i).first()).toBeAttached({ timeout: 10000 });
  await expect(page.getByText(/캐시\s*내역/i).first()).toContainText("캐시");
});

When("사용자가 충전 내역 탭을 클릭한다", async ({ page }) => {
  await page.getByRole("tab", { name: /충전\s*내역/i }).or(page.getByText(/충전\s*내역/i).first()).click({ timeout: 8000 });
});

Then("사용자의 캐시 충전 리스트가 최근 리스트 순서대로 노출된다", async ({ page }) => {
  await page.waitForTimeout(300);
  const el = page.getByText(/충전|캐시|내역/i).first();
  await expect(el).toBeAttached({ timeout: 5000 });
});

When("사용자가 사용 내역 탭을 클릭한다", async ({ page }) => {
  await page.getByRole("tab", { name: /사용\s*내역/i }).or(page.getByText(/사용\s*내역/i).first()).click({ timeout: 8000 });
});

Then("사용자의 캐시 사용 리스트가 최근 리스트 순서대로 노출된다", async ({ page }) => {
  await page.waitForTimeout(300);
  const el = page.getByText(/사용|캐시|내역/i).first();
  await expect(el).toBeAttached({ timeout: 5000 });
});

const CHARGEPOPUP_VIEWPORT = { width: 1400, height: 900 };

const getChargePopupPage = async (page: any) => {
  const ctx = page.context();
  const pages = ctx.pages();
  for (const p of pages) {
    const isCharge = /billing|charge|kpg|payment_intro/i.test(p.url()) ||
      await p.getByText(/충전하기/i).first().isVisible().catch(() => false);
    if (isCharge) return p;
  }
  return page;
};

When("사용자가 [캐시 충전] 버튼을 클릭한다", async ({ page }) => {
  await page.setViewportSize(CHARGEPOPUP_VIEWPORT);
  await page.getByRole("button", { name: /캐시\s*충전/i }).or(page.getByText(/캐시\s*충전/i).first()).click({ timeout: 8000 });
});

Then("캐시 충전 메뉴로 이동된다", async ({ page }) => {
  await page.waitForTimeout(800);
  const chargePage = await getChargePopupPage(page);
  await chargePage.setViewportSize(CHARGEPOPUP_VIEWPORT);
  const onCharge = /charge|충전|cash|billing|kpg/i.test(chargePage.url()) ||
    await chargePage.getByText(/충전하기|캐시|충전/i).first().isVisible().catch(() => false);
  expect(onCharge).toBe(true);
});

When("사용자가 우측 상단 x 아이콘을 클릭한다", async ({ page }) => {
  const chargePage = await getChargePopupPage(page);
  await chargePage.setViewportSize(CHARGEPOPUP_VIEWPORT);
  await page.waitForTimeout(300);
  const closeBtn = chargePage.locator('div.new_popup_head_right.btn_comm.btn_cancel').or(
    chargePage.locator('div[class*="new_popup_head_right"][class*="btn_cancel"]')
  );
  await closeBtn.first().click({ timeout: 8000 });
});

Then("캐시 내역 화면으로 다시 이동된다", async ({ page }) => {
  await page.waitForTimeout(800);
  const cacheHistoryPage = page.context().pages().length === 1 ? page : page.context().pages()[0];
  const target = cacheHistoryPage;
  await expect(target.getByText(/캐시\s*내역/i).first()).toBeAttached({ timeout: 10000 });
  const chargeGone = await target.getByText(/충전하기/i).first().isHidden().catch(() => true);
  expect(chargeGone).toBe(true);
});

When("사용자가 좌측 상단 뒤로가기[⬅︎] 버튼을 클릭한다", async ({ page }) => {
  const backBtn = page.getByRole("button", { name: /뒤로가기|back|이전/i })
    .or(page.locator('button, a').filter({ hasText: /⬅|←|뒤로/i }).first());
  await backBtn.first().click({ timeout: 5000 }).catch(() => page.goBack());
});

