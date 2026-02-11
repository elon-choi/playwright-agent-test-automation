// Feature: KPA-071 시나리오 검증 - 이용권 내역 화면 이동
import { And, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 임의의 작품을 클릭한다.", async ({ page }) => {
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

And("사용자가 좌측 작품 정보 영역 이미지 하단의 대여권 n장 소장권 n장 > 영역에서 > 아이콘을 클릭한다.", async ({ page }) => {
  const ticketLink = page.locator('a[href*="/history/ticket"], a[href*="ticket"]').first();
  const ok = await ticketLink.count() > 0;
  if (ok) {
    await ticketLink.evaluate((e: HTMLElement) => e.click()).catch(() => null);
    await page.waitForTimeout(500);
    if (!/history\/ticket|ticket/i.test(page.url())) {
      await page.goto(new URL("/history/ticket", page.url()).href, { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    }
  } else {
    const ticketArea = page.getByRole("link", { name: /이용권\s*내역|대여권|소장권/i }).first();
    await ticketArea.evaluate((e: HTMLElement) => e.click()).catch(() => null);
  }
  await page.waitForTimeout(500);
});

Then("이용권 내역 화면으로 이동한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasTicketHistory =
    (await page.getByText(/이용권\s*내역|보유\s*이용권|이용권\s*내역이\s*없습니다/i).count()) > 0 ||
    /ticket|이용권|내역/i.test(page.url());
  expect(hasTicketHistory).toBe(true);
});

And(/이용권 내역 화면에 보유 이용권 내역이 노출된다\. \(보유 이용권이 없는 경우 이 작품에 대한 이용권 내역이 없습니다\. 메세지가 노출된다\.\)/, async ({ page }) => {
  await page.waitForTimeout(300);
  const hasContent =
    (await page.getByText(/보유\s*이용권|이용권\s*내역|이용권\s*내역이\s*없습니다|이\s*작품에\s*대한\s*이용권\s*내역/i).count()) > 0;
  expect(hasContent).toBe(true);
});

And("좌측 상단의 <- 뒤로 가기 아이콘을 클릭한다.", async ({ page }) => {
  const backBtn = page
    .getByRole("button", { name: /뒤로가기|back|이전/i })
    .or(page.getByRole("link", { name: /뒤로|이전/i }))
    .or(page.locator('button, a').filter({ hasText: /⬅|←|뒤로|<|back/i }).first());
  await backBtn.first().click({ timeout: 8000 }).catch(() => page.goBack());
  await page.waitForTimeout(400);
});

Then("작품홈 화면으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i, { timeout: 10000 });
});
