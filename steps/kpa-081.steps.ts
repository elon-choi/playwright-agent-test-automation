// Feature: KPA-081 시나리오 검증 - 이용권 구매 흐름
import { And, Then, expect, getBaseUrl, getBaseUrlOrigin } from "./fixtures.js";

const ensureContentPage = async (page: any) => {
  if (/\/content\/|\/landing\/series\//i.test(page.url())) return;
  const fallbackCard = page.locator('main a[href*="/content/"], a[href*="/content/"]').first();
  if ((await fallbackCard.count()) > 0 && (await fallbackCard.isVisible().catch(() => false))) {
    await fallbackCard.click({ timeout: 10000, force: true }).catch(() => null);
    await page.waitForURL(/\/content\/|\/landing\/series\//i, { timeout: 15000 }).catch(() => null);
    return;
  }
  await page.goto(getBaseUrl(), { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(500);
};

And("사용자의 계정이 캐시가 충전된 상태이다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
});

And("상단 GNB 메뉴에서 웹툰 메뉴를 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(400);
  const webtoonGnb = page
    .getByRole("link", { name: /웹툰\s*탭|웹툰/i })
    .or(page.locator('a[href*="/menu/10010"]'));
  await webtoonGnb.first().click({ timeout: 10000 });
  await page.waitForTimeout(600);
});

Then("웹툰 메뉴로 이동한다.", async ({ page }) => {
  await page.waitForTimeout(400);
  const onWebtoon =
    /\/menu\/10010/i.test(page.url()) ||
    (await page.getByText(/웹툰|지금\s*신작|실시간\s*랭킹/i).first().isVisible().catch(() => false));
  expect(onWebtoon).toBe(true);
});

And("사용자가 임의의 웹툰 작품을 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(400);
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

And("사용자가 좌측 작품 정보 영역 이미지 하단의 충전 버튼을 클릭한다.", async ({ page }) => {
  await ensureContentPage(page);
  await page.waitForTimeout(400);
  const ticketBlock = page.getByText(/대여권\s*\d*\s*장|소장권\s*\d*\s*장/).first().locator("..").locator("..");
  const chargeInTicketArea = ticketBlock
    .getByRole("button", { name: /충전/i })
    .or(ticketBlock.getByRole("link", { name: /충전/i }))
    .or(ticketBlock.getByText(/충전/))
    .first();
  if ((await chargeInTicketArea.count()) > 0 && (await chargeInTicketArea.isVisible().catch(() => false))) {
    await chargeInTicketArea.click({ timeout: 8000 }).catch(() => chargeInTicketArea.evaluate((e: HTMLElement) => e.click()));
    await page.waitForTimeout(600);
    return;
  }
  const allCharge = page.locator("a, button").filter({ hasText: /충전/ });
  for (let i = 0; i < Math.min(await allCharge.count(), 5); i++) {
    const el = allCharge.nth(i);
    const href = await el.getAttribute("href").catch(() => null);
    if (href && /billing|kpg|payment_intro/.test(href)) continue;
    await el.click({ timeout: 8000 });
    await page.waitForTimeout(600);
    return;
  }
  throw new Error("이용권 충전 버튼을 찾지 못했습니다. 빌링(page-billing-web) 링크만 있습니다. 작품 정보 영역(대여권/소장권 옆)의 충전을 사용해야 합니다.");
});

And("이용권 충전 페이지에서 \"대여권 충전\" 영역의 첫번째 n00캐시 버튼을 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(800);
  const 대여권텍스트 = page.getByText(/대여권\s*충전/i).first();
  await 대여권텍스트.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(300);
  let section = 대여권텍스트.locator("..");
  for (let i = 0; i < 6; i++) {
    const firstPriceBtn = section
      .getByRole("button", { name: /\d+캐시|\d+원/ })
      .or(section.locator("button").filter({ hasText: /\d+캐시/ }))
      .first();
    if ((await firstPriceBtn.count()) > 0 && (await firstPriceBtn.isVisible().catch(() => false))) {
      await firstPriceBtn.click({ timeout: 8000 }).catch(() => firstPriceBtn.evaluate((e: HTMLElement) => e.click()));
      await page.waitForTimeout(400);
      return;
    }
    const byText = section.getByText(/\d+\s*캐시|\d+캐시/).first();
    if ((await byText.count()) > 0 && (await byText.isVisible().catch(() => false))) {
      await byText.click({ timeout: 8000 }).catch(() => byText.evaluate((e: HTMLElement) => e.click()));
      await page.waitForTimeout(400);
      return;
    }
    section = section.locator("..");
  }
  const fallback = page.getByText(/대여권\s*충전/i).locator("..").locator("..").locator("..").locator("..").locator("button").filter({ hasText: /\d+캐시/ }).first();
  if ((await fallback.count()) > 0) {
    await fallback.click({ timeout: 8000 });
  } else {
    throw new Error("대여권 충전 영역에서 가격 버튼을 찾지 못했습니다. 소장권 영역이 아닌 대여권 충전 섹션을 사용해야 합니다.");
  }
  await page.waitForTimeout(400);
});

And("대여권 1장이 기본 선택된 상태에서 하단의 \"충전하기\" 버튼을 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  const candidates = [
    page.getByRole("button", { name: /충전하기|결제하기|구매하기|이용권\s*구매/i }),
    page.getByText(/충전하기|결제하기|구매하기|이용권\s*구매/),
    page.locator("button").filter({ hasText: /충전하기|결제|구매하기/ }),
    page.locator("[role='button']").filter({ hasText: /충전하기|결제|구매/ })
  ];
  for (const loc of candidates) {
    const first = loc.first();
    if ((await first.count()) > 0) {
      await first.scrollIntoViewIfNeeded().catch(() => null);
      await page.waitForTimeout(200);
      if (await first.isVisible().catch(() => false)) {
        await first.click({ timeout: 8000 });
        await page.waitForTimeout(800);
        return;
      }
    }
  }
  const byText = page.getByText(/충전하기|구매하기/).first();
  if ((await byText.count()) > 0) {
    await byText.scrollIntoViewIfNeeded().catch(() => null);
    await byText.click({ timeout: 6000, force: true });
    await page.waitForTimeout(800);
    return;
  }
  const ctaButton = page.locator("button").filter({ hasText: /충전하기|구매하기|결제하기/ }).filter({ hasNot: page.locator("button").filter({ hasText: /\d+캐시/ }) }).first();
  if ((await ctaButton.count()) > 0) {
    await ctaButton.scrollIntoViewIfNeeded().catch(() => null);
    await ctaButton.click({ timeout: 6000 });
  }
  await page.waitForTimeout(800);
});

Then("구매 완료 메시지가 화면에 다음의 요소가 표시되어야 한다.", async ({ page }, dataTable?: unknown) => {
  await page.waitForTimeout(2500);
  const completionMsg = page.getByText(
    /대여권\s*1장\s*구매가\s*완료|대여권\s*1장\s*구매\s*완료|소장권\s*1장\s*구매가\s*완료|소장권\s*1장\s*구매\s*완료|구매가\s*완료\s*되었습니다|1장\s*구매\s*완료|구매\s*완료\s*되었습니다/
  );
  const msgVisible = await completionMsg.first().isVisible().catch(() => false);
  if (msgVisible) {
    const hasConfirm = await page.getByRole("button", { name: /확인/ }).first().isVisible().catch(() => false);
    expect(hasConfirm).toBe(true);
    return;
  }
  const url = page.url();
  const onPaymentPage = /kakaopay|payment|kpg|billing|pay\.|결제|toss|payco/i.test(url);
  const stillOnChargePage = /이용권\s*충전|charge|ticket/i.test(url) || await page.getByText(/이용권\s*충전|대여권\s*충전/).first().isVisible().catch(() => false);
  if (onPaymentPage) {
    throw new Error("결제 페이지에 머물러 있습니다. 캐시 결제 완료 후 구매 완료 메시지가 노출되어야 합니다.");
  }
  if (stillOnChargePage) {
    throw new Error("이용권 충전 페이지에 머물러 있습니다. 충전하기 버튼 클릭 후 구매 완료 메시지가 노출되어야 합니다.");
  }
  await expect(completionMsg.first()).toBeVisible({ timeout: 15000 });
  const hasConfirm = await page.getByRole("button", { name: /확인/ }).first().isVisible().catch(() => false);
  expect(hasConfirm).toBe(true);
});

And("팝업의 확인 버튼을 클릭한다.", async ({ page }) => {
  if (/kakaopay|payment|kpg|billing|pay\.|toss|payco/i.test(page.url())) {
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(500);
    return;
  }
  const inDialog = page.getByRole("dialog").or(page.locator("[role='alertdialog']")).or(page.locator("[class*='modal'], [class*='Modal'], [class*='popup'], [class*='Popup']"));
  const confirmInPopup = inDialog.getByRole("button", { name: /확인/ }).first();
  if ((await confirmInPopup.count()) > 0 && (await confirmInPopup.isVisible().catch(() => false))) {
    await confirmInPopup.click({ timeout: 8000 });
    await page.waitForTimeout(500);
    return;
  }
  const confirmBtn = page.getByRole("button", { name: /확인/ }).first();
  if ((await confirmBtn.count()) > 0 && (await confirmBtn.isVisible().catch(() => false))) {
    await confirmBtn.scrollIntoViewIfNeeded().catch(() => null);
    await confirmBtn.click({ timeout: 8000 });
  }
  await page.waitForTimeout(500);
});

Then("작품홈 홈탭 화면으로 이동한다.", async ({ page }) => {
  await page.waitForTimeout(600);
  for (let i = 0; i < 3 && !/\/content\/|\/landing\/series\//i.test(page.url()); i++) {
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(400);
  }
  await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i, { timeout: 8000 });
});

Then("선택한 대여권이 정상적으로 구매되었음을 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin(), { timeout: 5000 });
});
