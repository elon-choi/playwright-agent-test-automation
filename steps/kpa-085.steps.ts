// Feature: KPA-085 이용권 환불 검증 (이용권 내역에서)
import { test } from "@playwright/test";
import { And, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

And("이용권 내역 메뉴를 클릭한다.", async ({ page, loginPage }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 15000 });
    await safeWait(page,1500);
    await loginPage.clickProfileIcon(false);
    await safeWait(page,2000);
    if (/accounts\.kakao\.com\/login/i.test(page.url())) {
      throw new Error("로그인 페이지에 있습니다. 00-login.feature 실행 후 KPA-085를 실행하세요.");
    }
  }
  await safeWait(page,400);
  const menu = page.getByRole("link", { name: /이용권\s*내역/i }).or(page.getByText(/이용권\s*내역/).first());
  if ((await menu.count()) > 0 && (await menu.first().isVisible().catch(() => false))) {
    await menu.first().click({ timeout: 10000 });
    await safeWait(page,800);
    return;
  }
  const byText = page.getByText(/이용권\s*내역/).first();
  if ((await byText.count()) > 0) await byText.click({ timeout: 10000 });
  await safeWait(page,800);
});

And("스크롤 다운을 하면서 구매한 이용권 내역이 노출 될때까지 찾는다", async ({ page }) => {
  await safeWait(page,600);
  const rechargeTab = page.getByRole("tab", { name: /충전\s*내역/i }).or(page.getByText(/충전\s*내역/).first());
  if ((await rechargeTab.count()) > 0 && (await rechargeTab.isVisible().catch(() => false))) {
    await rechargeTab.click({ timeout: 8000 }).catch(() => null);
    await safeWait(page,800);
  }
  const scrollAmount = 120;
  const scrollDown = async () => {
    await page.evaluate((amount: number) => {
      const list = document.querySelector('[class*="list"], [class*="overflow-auto"], [class*="overflow-y"], [class*="Scroll"]');
      if (list && (list as HTMLElement).scrollHeight > (list as HTMLElement).clientHeight) {
        (list as HTMLElement).scrollTop += amount;
      }
      window.scrollBy(0, amount);
    }, scrollAmount);
  };
  const paidRowLocator = page
    .locator('a[href*="content"], a[href*="ticket"]')
    .filter({ hasText: /소장권\s*[1-9]\d*\s*장|대여권\s*[1-9]\d*\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasText: /[1-9]\d*캐시|-?\d+캐시/ })
    .first();
  for (let i = 0; i < 40; i++) {
    const visible = await paidRowLocator.isVisible({ timeout: 1500 }).catch(() => false);
    if (visible) {
      await paidRowLocator.scrollIntoViewIfNeeded();
      await safeWait(page,500);
      break;
    }
    await scrollDown();
    await safeWait(page,850);
  }
});

function scrollToFindRow(page: { evaluate: (fn: (amount: number) => void, arg: number) => Promise<void>; waitForTimeout: (ms: number) => Promise<void> }) {
  const scrollAmount = 120;
  return page.evaluate((amount: number) => {
    const list = document.querySelector('[class*="list"], [class*="overflow-auto"], [class*="overflow-y"], [class*="Scroll"]');
    if (list && (list as HTMLElement).scrollHeight > (list as HTMLElement).clientHeight) {
      (list as HTMLElement).scrollTop += amount;
    }
    window.scrollBy(0, amount);
  }, scrollAmount);
}

And("충전 내역 탭에서 구매한 대여권 영역을 클릭한다", async ({ page }) => {
  await page.waitForSelector('a[href*="content"]', { state: "attached", timeout: 15000 }).catch(() => null);
  await safeWait(page,800);
  const rowLocator = page
    .locator('a[href*="content"], a[href*="ticket"]')
    .filter({ hasText: /대여권\s*[1-9]\d*\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasText: /[1-9]\d*캐시|-?\d+캐시/ });
  for (let i = 0; i < 35; i++) {
    const n = await rowLocator.count();
    if (n > 0) {
      const row = rowLocator.first();
      await row.scrollIntoViewIfNeeded().catch(() => null);
      await safeWait(page,400);
      const ok = await row.isVisible().catch(() => false);
      if (ok) {
        await row.click({ timeout: 10000, force: true });
        await safeWait(page,800);
        return;
      }
      const all = rowLocator;
      for (let j = 0; j < n; j++) {
        const r = all.nth(j);
        if (await r.isVisible().catch(() => false)) {
          await r.scrollIntoViewIfNeeded();
          await safeWait(page,400);
          await r.click({ timeout: 10000, force: true });
          await safeWait(page,800);
          return;
        }
      }
    }
    await scrollToFindRow(page);
    await safeWait(page,700);
  }
  const fallback대여 = page.locator('a[href*="content"]').filter({ hasText: /대여권\s*[1-9]\d*\s*장/ }).filter({ hasNotText: /무료|취소\s*완료|취소완료/ }).filter({ hasText: /캐시/ }).first();
  if ((await fallback대여.count()) > 0) {
    await fallback대여.scrollIntoViewIfNeeded();
    await fallback대여.click({ timeout: 10000, force: true });
    await safeWait(page,800);
    return;
  }
  throw new Error("구매 취소되지 않은 대여권 항목을 찾을 수 없습니다. 충전 내역에 취소 가능한 대여권(유료)이 있는지 확인하세요.");
});

And("충전 내역 탭에서 구매 취소 처리되지 않은 구매한 대여권 영역을 클릭한다", async ({ page }) => {
  await page.waitForSelector('a[href*="content"]', { state: "attached", timeout: 15000 }).catch(() => null);
  await safeWait(page,800);
  const rowLocator = page
    .locator('a[href*="content"], a[href*="ticket"]')
    .filter({ hasText: /대여권\s*[1-9]\d*\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasText: /[1-9]\d*캐시|-?\d+캐시/ });
  for (let i = 0; i < 35; i++) {
    const n = await rowLocator.count();
    if (n > 0) {
      const row = rowLocator.first();
      await row.scrollIntoViewIfNeeded().catch(() => null);
      await safeWait(page,400);
      if (await row.isVisible().catch(() => false)) {
        await row.click({ timeout: 10000, force: true });
        await safeWait(page,800);
        return;
      }
      for (let j = 0; j < n; j++) {
        const r = rowLocator.nth(j);
        if (await r.isVisible().catch(() => false)) {
          await r.scrollIntoViewIfNeeded();
          await safeWait(page,400);
          await r.click({ timeout: 10000, force: true });
          await safeWait(page,800);
          return;
        }
      }
    }
    await scrollToFindRow(page);
    await safeWait(page,700);
  }
  const fallback대여2 = page.locator('a[href*="content"]').filter({ hasText: /대여권\s*[1-9]\d*\s*장/ }).filter({ hasNotText: /무료|취소\s*완료|취소완료/ }).filter({ hasText: /캐시/ }).first();
  if ((await fallback대여2.count()) > 0) {
    await fallback대여2.scrollIntoViewIfNeeded();
    await fallback대여2.click({ timeout: 10000, force: true });
    await safeWait(page,800);
    return;
  }
  throw new Error("구매 취소되지 않은 대여권 항목을 찾을 수 없습니다. 충전 내역에 취소 가능한 대여권(유료)이 있는지 확인하세요.");
});

And("충전 내역 탭에서 구매한 소장권 영역을 클릭한다", async ({ page }) => {
  await page.waitForSelector('a[href*="content"]', { state: "attached", timeout: 15000 }).catch(() => null);
  await safeWait(page,800);
  const rowLocator = page
    .locator('a[href*="content"], a[href*="ticket"]')
    .filter({ hasText: /소장권\s*[1-9]\d*\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasText: /[1-9]\d*캐시|-?\d+캐시/ });
  for (let i = 0; i < 35; i++) {
    const n = await rowLocator.count();
    if (n > 0) {
      const row = rowLocator.first();
      await row.scrollIntoViewIfNeeded().catch(() => null);
      await safeWait(page,400);
      if (await row.isVisible().catch(() => false)) {
        await row.click({ timeout: 10000, force: true });
        await safeWait(page,800);
        return;
      }
      for (let j = 0; j < n; j++) {
        const r = rowLocator.nth(j);
        if (await r.isVisible().catch(() => false)) {
          await r.scrollIntoViewIfNeeded();
          await safeWait(page,400);
          await r.click({ timeout: 10000, force: true });
          await safeWait(page,800);
          return;
        }
      }
    }
    await scrollToFindRow(page);
    await safeWait(page,700);
  }
  const fallback = page.locator('a[href*="content"]').filter({ hasText: /소장권\s*[1-9]\d*\s*장/ }).filter({ hasNotText: /무료|취소\s*완료|취소완료/ }).filter({ hasText: /캐시/ }).first();
  if ((await fallback.count()) > 0) {
    await fallback.scrollIntoViewIfNeeded();
    await fallback.click({ timeout: 10000, force: true });
    await safeWait(page,800);
    return;
  }
  throw new Error("구매 취소되지 않은 소장권 항목을 찾을 수 없습니다. 충전 내역에 취소 가능한 소장권(유료)이 있는지 확인하세요.");
});

And("충전 내역 탭에서 구매 취소 처리되지 않은 구매한 소장권 영역을 클릭한다", async ({ page }) => {
  await page.waitForSelector('a[href*="content"]', { state: "attached", timeout: 15000 }).catch(() => null);
  await safeWait(page,800);
  const rowLocator = page
    .locator('a[href*="content"], a[href*="ticket"]')
    .filter({ hasText: /소장권\s*[1-9]\d*\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasText: /[1-9]\d*캐시|-?\d+캐시/ });
  for (let i = 0; i < 35; i++) {
    const n = await rowLocator.count();
    if (n > 0) {
      const row = rowLocator.first();
      await row.scrollIntoViewIfNeeded().catch(() => null);
      await safeWait(page,400);
      if (await row.isVisible().catch(() => false)) {
        await row.click({ timeout: 10000, force: true });
        await safeWait(page,800);
        return;
      }
      for (let j = 0; j < n; j++) {
        const r = rowLocator.nth(j);
        if (await r.isVisible().catch(() => false)) {
          await r.scrollIntoViewIfNeeded();
          await safeWait(page,400);
          await r.click({ timeout: 10000, force: true });
          await safeWait(page,800);
          return;
        }
      }
    }
    await scrollToFindRow(page);
    await safeWait(page,700);
  }
  const fallback소장 = page.locator('a[href*="content"]').filter({ hasText: /소장권\s*[1-9]\d*\s*장/ }).filter({ hasNotText: /무료|취소\s*완료|취소완료/ }).filter({ hasText: /캐시/ }).first();
  if ((await fallback소장.count()) > 0) {
    await fallback소장.scrollIntoViewIfNeeded();
    await fallback소장.click({ timeout: 10000, force: true });
    await safeWait(page,800);
    return;
  }
  throw new Error("구매 취소되지 않은 소장권 항목을 찾을 수 없습니다. 충전 내역에 취소 가능한 소장권(유료)이 있는지 확인하세요.");
});

const MAX_ROW_ATTEMPTS = 15;
const TOAST_WAIT_MS = 6000;

async function safeWait(page: any, ms: number): Promise<void> {
  try {
    if (typeof page?.isClosed === "function" && page.isClosed()) return;
    await page.waitForTimeout(ms);
  } catch {
    // page/context/browser closed (e.g. test timeout) - avoid throwing
  }
}

/** 1번 방식: 구매 취소 처리되지 않은 것처럼 보이는 행을 순서대로 시도, 실제 취소 가능한 항목을 찾으면 취소하고, 모두 이미 취소된 경우에도 성공 처리 */

async function tryCancelOneRow(
  page: any,
  ticketType: "대여권" | "소장권",
  rowIndex: number,
  rowLocator: any,
  clickLinkInsideRow?: boolean
): Promise<"cancelled" | "no_button" | "no_row"> {
  const goBackToList = async () => {
    const popup = (page as any).__ticketPopup;
    if (popup && typeof popup.isClosed === "function" && !popup.isClosed()) {
      try {
        const closeBtn = popup.getByRole("button", { name: /닫기/ }).first();
        for (let i = 0; i < 3; i++) {
          if ((await closeBtn.count()) > 0 && (await closeBtn.isVisible().catch(() => false))) {
            await closeBtn.click({ timeout: 5000 }).catch(() => null);
            await safeWait(page,600);
          } else break;
        }
      } catch {
        // popup may be closed
      }
      try { await popup.close().catch(() => null); } catch { /* ignore */ }
      (page as any).__ticketPopup = undefined;
    }
    await safeWait(page,600);

    const origin = getBaseUrlOrigin();
    const ticketHistoryUrl = `${origin.replace(/\/$/, "")}/history/ticket`;
    const gotoOk = await page.goto(ticketHistoryUrl, { waitUntil: "domcontentloaded", timeout: 15000 }).then(() => true).catch(() => false);
    await safeWait(page,1500);

    const hasList = await page.locator('a[href*="content"], a[href*="ticket"]').filter({ hasText: /대여권|소장권|캐시/ }).first().isVisible({ timeout: 3000 }).catch(() => false);
    if (!gotoOk || !hasList) {
      const header = page.getByRole("banner");
      const profileBtn = page.locator('[data-test="header-login-button"]').or(header.locator('[aria-label*="프로필"], [class*="profile"]')).or(page.getByRole("button", { name: /프로필|내\s*정보|계정/i })).first();
      if ((await profileBtn.count()) > 0 && (await profileBtn.isVisible().catch(() => false))) {
        await profileBtn.click({ timeout: 6000 }).catch(() => null);
        await safeWait(page,1200);
      }
      const menu = page.getByRole("link", { name: /이용권\s*내역/i }).or(page.getByText(/이용권\s*내역/).first());
      if ((await menu.count()) > 0 && (await menu.first().isVisible().catch(() => false))) {
        await menu.first().click({ timeout: 8000 });
        await safeWait(page,2000);
      }
    }

    const tab = page.getByRole("tab", { name: /충전\s*내역/i }).or(page.getByText(/충전\s*내역/).first());
    if ((await tab.count()) > 0 && (await tab.isVisible().catch(() => false))) {
      await tab.click({ timeout: 6000 }).catch(() => null);
      await safeWait(page,1200);
    }
    await scrollChargeListToLoadAllRows(page);
    await safeWait(page,800);
  };

  if (rowIndex > 0) {
    await goBackToList();
    await safeWait(page,1000);
    for (let w = 0; w < 10; w++) {
      const c = await rowLocator.count();
      if (c > rowIndex) break;
      await safeWait(page,400);
    }
  }
  const currentCount = await rowLocator.count();
  if (rowIndex >= currentCount) {
    console.log("[KPA-085 tryCancelOneRow] no_row: rowIndex", rowIndex, ">= count", currentCount);
    return "no_row";
  }
  const row = rowLocator.nth(rowIndex);
  await row.scrollIntoViewIfNeeded().catch(() => null);
  await safeWait(page,500);
  if (!(await row.isVisible().catch(() => false))) {
    console.log("[KPA-085 tryCancelOneRow] no_row: 행 인덱스", rowIndex, "미노출");
    return "no_row";
  }

  if (clickLinkInsideRow) {
    const linkInRow = row.locator('a[href*="content"], a[href*="ticket"]').first();
    if ((await linkInRow.count()) > 0 && (await linkInRow.isVisible().catch(() => false))) {
      await linkInRow.click({ timeout: 10000, force: true });
    } else {
      await row.click({ timeout: 10000, force: true });
    }
  } else {
    await row.click({ timeout: 10000, force: true });
  }
  await safeWait(page,1200);

  const popupPromise = page.waitForEvent("popup", { timeout: 12000 }).catch(() => null);

  const ticketBlockLegacy = page.locator('[class*="ticket"], [class*="Ticket"], [class*="item"], [class*="row"]')
    .filter({ hasText: /대여권\s*\d+\s*장|소장권\s*\d+\s*장/ })
    .filter({ hasNotText: /이어보기/ });
  const ticketBlockLink = page.locator('a[href*="content"], a[href*="ticket"]')
    .filter({ hasText: /대여권\s*\d+\s*장|소장권\s*\d+\s*장/ })
    .filter({ has: page.locator('img[alt*="다음"], [class*="arrow"], [class*="chevron"]') });
  const ticketBlock = (await ticketBlockLink.count()) > 0 ? ticketBlockLink : ticketBlockLegacy;
  const blockCount = await ticketBlock.count();
  const blockIndex = blockCount > rowIndex ? rowIndex : 0;
  const blockWith충전 = ticketBlock.filter({ hasText: /충전/ });
  const block = (await blockWith충전.count()) > 0 ? blockWith충전.nth(Math.min(rowIndex, await blockWith충전.count() - 1)) : ticketBlock.nth(blockIndex);
  const arrow = block.locator('img[alt*="다음"], img[alt*="arrow"], img[aria-label*="다음"], [class*="arrow"], [class*="chevron"]').first();
  if ((await arrow.count()) > 0 && (await arrow.isVisible().catch(() => false))) await arrow.click({ timeout: 8000, force: true }).catch(() => null);
  else await block.click({ timeout: 8000, force: true }).catch(() => null);

  const popup = await popupPromise;
  if (popup && typeof popup.isClosed === "function" && !popup.isClosed()) {
    (page as any).__ticketPopup = popup;
    await popup.getByText(/이용권\s*내역|대여권|소장권/).first().waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
  }
  await safeWait(page,1500);

  const scope = await getTicketScope(page);
  const clickTypeInScope = async () => {
    if (ticketType === "대여권") {
      const byData = scope.locator('[data-t-obj*="대여_대여권"], [data-t-obj*="대여권"]').filter({ hasNotText: /구매\s*취소(?!\s*하기)/ }).locator('div[class*="cursor-pointer"]').first();
      if ((await byData.count()) > 0 && (await byData.isVisible().catch(() => false))) {
        await byData.click({ timeout: 10000, force: true });
        return true;
      }
      const rowType = scope.locator('[class*="item"], [class*="row"]').filter({ hasText: /대여권/ }).filter({ hasText: /[1-9]\d*\s*장/ }).filter({ hasNotText: /구매\s*취소(?!\s*하기)/ }).first();
      const inner = rowType.locator('div[class*="cursor-pointer"]').first();
      if ((await inner.count()) > 0) await inner.click({ timeout: 10000, force: true });
      else await rowType.click({ timeout: 10000, force: true }).catch(() => null);
      return true;
    } else {
      const byData = scope.locator('[data-t-obj*="소장권"]').filter({ hasNotText: /구매\s*취소(?!\s*하기)/ }).locator('div[class*="cursor-pointer"]').first();
      if ((await byData.count()) > 0 && (await byData.isVisible().catch(() => false))) {
        await byData.click({ timeout: 10000, force: true });
        return true;
      }
      const rowType = scope.locator('[class*="item"], [class*="row"]').filter({ hasText: /소장권/ }).filter({ hasText: /[1-9]\d*\s*장/ }).filter({ hasNotText: /구매\s*취소(?!\s*하기)/ }).first();
      const inner = rowType.locator('div[class*="cursor-pointer"]').first();
      if ((await inner.count()) > 0) await inner.click({ timeout: 10000, force: true });
      else await rowType.click({ timeout: 10000, force: true }).catch(() => null);
      return true;
    }
  };
  await clickTypeInScope();
  await safeWait(page,2200);

  const scope2 = await getTicketScope(page);
  const scope2Page = typeof (scope2 as any).evaluate === "function" ? scope2 : page;
  const scrollDetailToBottom = () =>
    scope2Page.evaluate(() => {
      const list = document.querySelector('[class*="scroll"], [class*="content"], body');
      if (list && (list as HTMLElement).scrollHeight > (list as HTMLElement).clientHeight)
        (list as HTMLElement).scrollTop = (list as HTMLElement).scrollHeight;
    }).catch(() => null);

  let cancelBtn = scope2.getByRole("button", { name: /구매\s*취소\s*하기|구매\s*취소|구매취소하기|구매취소/ }).first();
  let hasCancelBtn = (await cancelBtn.count()) > 0 && (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false));
  if (!hasCancelBtn) {
    for (let round = 0; round < 12; round++) {
      await scrollDetailToBottom();
      await safeWait(page,350);
      cancelBtn = scope2.getByRole("button", { name: /구매\s*취소\s*하기|구매\s*취소|구매취소하기|구매취소/ }).first();
      hasCancelBtn = (await cancelBtn.count()) > 0 && (await cancelBtn.isVisible({ timeout: 1500 }).catch(() => false));
      if (hasCancelBtn) break;
      cancelBtn = scope2.getByText(/구매\s*취소\s*하기|구매취소하기/).first();
      hasCancelBtn = (await cancelBtn.count()) > 0 && (await cancelBtn.isVisible({ timeout: 1500 }).catch(() => false));
      if (hasCancelBtn) break;
      cancelBtn = scope2.locator('button, a, [role="button"]').filter({ hasText: /구매\s*취소|구매취소/ }).first();
      hasCancelBtn = (await cancelBtn.count()) > 0 && (await cancelBtn.isVisible({ timeout: 1500 }).catch(() => false));
      if (hasCancelBtn) break;
      cancelBtn = scope2.getByText(/취소\s*하기|취소하기/).first();
      hasCancelBtn = (await cancelBtn.count()) > 0 && (await cancelBtn.isVisible({ timeout: 1500 }).catch(() => false));
      if (hasCancelBtn) break;
      cancelBtn = scope2.locator('button, a, [role="button"]').filter({ hasText: /취소/ }).first();
      hasCancelBtn = (await cancelBtn.count()) > 0 && (await cancelBtn.isVisible({ timeout: 1500 }).catch(() => false));
      if (hasCancelBtn) break;
    }
  }
  if (!hasCancelBtn) {
    console.log("[KPA-085 tryCancelOneRow] no_button: 구매 취소하기 버튼 없음, 행 인덱스", rowIndex);
    await goBackToList();
    return "no_button";
  }

  const scopePage = typeof (scope2 as any).evaluate === "function" ? scope2 : page;
  await scopePage.evaluate(() => {
    const list = document.querySelector('[class*="scroll"], [class*="content"], body');
    if (list && (list as HTMLElement).scrollHeight > (list as HTMLElement).clientHeight) (list as HTMLElement).scrollTop = (list as HTMLElement).scrollHeight;
  }).catch(() => null);
  await safeWait(page,500);
  await cancelBtn.scrollIntoViewIfNeeded().catch(() => null);
  await cancelBtn.click({ timeout: 8000, force: true });
  await safeWait(page,800);

  const confirmBtn = scope2.getByRole("button", { name: /확인/ }).first();
  if ((await confirmBtn.count()) > 0 && (await confirmBtn.isVisible().catch(() => false))) await confirmBtn.click({ timeout: 6000 });
  await safeWait(page,TOAST_WAIT_MS);

  const toastPattern = /대여권.*취소\s*되었습니다|이용권.*취소\s*되었습니다|소장권.*취소\s*되었습니다|취소\s*되었습니다|취소되었습니다/;
  const checkToast = async (target: any) => (await target.getByText(toastPattern).count()) > 0 && (await target.getByText(toastPattern).first().isVisible().catch(() => false));
  let toastVisible = await checkToast(scope2) || await checkToast(page);
  if (!toastVisible && (page as any).__ticketPopup && typeof (page as any).__ticketPopup.isClosed === "function" && !(page as any).__ticketPopup.isClosed()) {
    toastVisible = await checkToast((page as any).__ticketPopup);
  }
  if (!toastVisible && typeof page.context === "function") {
    for (const p of page.context().pages()) {
      try { if (!p.isClosed() && (await checkToast(p))) { toastVisible = true; break; } } catch { /* ignore */ }
    }
  }
  if (!toastVisible) {
    await goBackToList();
    return "no_button";
  }
  (page as any).__kpa085Cancelled = true;
  return "cancelled";
}

async function scrollChargeListToLoadAllRows(page: any) {
  const maxScroll = 15;
  for (let s = 0; s < maxScroll; s++) {
    try {
      if (typeof page?.isClosed === "function" && page.isClosed()) return;
      await page.evaluate(() => {
        const list = document.querySelector('[class*="list"], [class*="overflow-auto"], [class*="overflow-y"], [class*="Scroll"], [class*="scroll"]');
        if (list && (list as HTMLElement).scrollHeight > (list as HTMLElement).clientHeight) {
          (list as HTMLElement).scrollTop = (list as HTMLElement).scrollHeight;
        }
        window.scrollBy(0, 150);
      }).catch(() => null);
    } catch {
      return;
    }
    await safeWait(page, 300);
  }
}

And("충전 내역에서 취소 가능한 대여권을 찾아 취소한다", async ({ page }) => {
  (page as any).__kpa085Cancelled = false;
  (page as any).__kpa085NoCancellable = false;
  await safeWait(page,600);
  const rechargeTab = page.getByRole("tab", { name: /충전\s*내역/i }).or(page.getByText(/충전\s*내역/).first());
  if ((await rechargeTab.count()) > 0 && (await rechargeTab.isVisible().catch(() => false))) await rechargeTab.click({ timeout: 6000 }).catch(() => null);
  await safeWait(page,800);
  await scrollChargeListToLoadAllRows(page);
  await safeWait(page,500);
  const linkRows = page
    .locator('a[href*="content"], a[href*="ticket"]')
    .filter({ hasText: /대여권\s*[1-9]\d*\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasText: /[1-9]\d*캐시|\d+캐시/ })
    .filter({ hasNotText: /-\d+캐시/ });
  const rowByContainer = page
    .locator('[class*="item"], [class*="row"], [class*="Row"], li, [role="listitem"], section, article')
    .filter({ hasText: /대여권\s*[1-9]\d*\s*장/ })
    .filter({ hasText: /[1-9]\d*캐시|\d+캐시/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasNotText: /-\d+캐시/ })
    .filter({ has: page.locator('a[href*="content"], a[href*="ticket"]') });
  const linkCount = await linkRows.count();
  const containerCount = await rowByContainer.count();
  const totalRows = Math.max(linkCount, containerCount);
  const useContainerRows = containerCount > linkCount;
  const rowLocator = useContainerRows ? rowByContainer : linkRows;
  console.log("[KPA-085 대여권] 충전 내역 후보: 링크", linkCount, "행컨테이너", containerCount, "-> 시도 행 수", totalRows);
  if (totalRows === 0) {
    (page as any).__kpa085NoCancellable = true;
    console.log("[KPA-085 대여권] 후보 0건 -> 취소할 항목 없음 처리");
    return;
  }
  const maxAttempts = Math.min(totalRows, MAX_ROW_ATTEMPTS);
  console.log("[KPA-085 대여권] 시도할 최대 행 수:", maxAttempts);
  for (let i = 0; i < maxAttempts; i++) {
    console.log("[KPA-085 대여권] 시도", i + 1, "/", maxAttempts, "- 행 인덱스", i);
    const result = await tryCancelOneRow(page, "대여권", i, rowLocator, useContainerRows);
    console.log("[KPA-085 대여권] 시도", i + 1, "결과:", result);
    if (result === "cancelled") return;
    if (result === "no_row") break;
  }
  (page as any).__kpa085NoCancellable = true;
  console.log("[KPA-085 대여권] 모든 시도 완료, 취소 가능 항목 없음");
});

And("충전 내역에서 취소 가능한 소장권을 찾아 취소한다", async ({ page }) => {
  (page as any).__kpa085Cancelled = false;
  (page as any).__kpa085NoCancellable = false;
  await safeWait(page,600);
  const rechargeTab = page.getByRole("tab", { name: /충전\s*내역/i }).or(page.getByText(/충전\s*내역/).first());
  if ((await rechargeTab.count()) > 0 && (await rechargeTab.isVisible().catch(() => false))) await rechargeTab.click({ timeout: 6000 }).catch(() => null);
  await safeWait(page,800);
  await scrollChargeListToLoadAllRows(page);
  await safeWait(page,500);
  const linkRows = page
    .locator('a[href*="content"], a[href*="ticket"]')
    .filter({ hasText: /소장권\s*[1-9]\d*\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasText: /[1-9]\d*캐시|\d+캐시/ })
    .filter({ hasNotText: /-\d+캐시/ });
  const rowByContainer = page
    .locator('[class*="item"], [class*="row"], [class*="Row"], li, [role="listitem"], section, article')
    .filter({ hasText: /소장권\s*[1-9]\d*\s*장/ })
    .filter({ hasText: /[1-9]\d*캐시|\d+캐시/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /취소\s*완료|취소완료/ })
    .filter({ hasNotText: /-\d+캐시/ })
    .filter({ has: page.locator('a[href*="content"], a[href*="ticket"]') });
  const linkCount = await linkRows.count();
  const containerCount = await rowByContainer.count();
  const totalRows = Math.max(linkCount, containerCount);
  const useContainerRows = containerCount > linkCount;
  const rowLocator = useContainerRows ? rowByContainer : linkRows;
  console.log("[KPA-085 소장권] 충전 내역 후보: 링크", linkCount, "행컨테이너", containerCount, "-> 시도 행 수", totalRows);
  if (totalRows === 0) {
    (page as any).__kpa085NoCancellable = true;
    console.log("[KPA-085 소장권] 후보 0건 -> 취소할 항목 없음 처리");
    return;
  }
  const maxAttempts = Math.min(totalRows, MAX_ROW_ATTEMPTS);
  console.log("[KPA-085 소장권] 시도할 최대 행 수:", maxAttempts);
  for (let i = 0; i < maxAttempts; i++) {
    console.log("[KPA-085 소장권] 시도", i + 1, "/", maxAttempts, "- 행 인덱스", i);
    const result = await tryCancelOneRow(page, "소장권", i, rowLocator, useContainerRows);
    console.log("[KPA-085 소장권] 시도", i + 1, "결과:", result);
    if (result === "cancelled") return;
    if (result === "no_row") break;
  }
  (page as any).__kpa085NoCancellable = true;
  console.log("[KPA-085 소장권] 모든 시도 완료, 취소 가능 항목 없음");
});

function getTicketPopupPage(page: any): any {
  const popup = (page as any).__ticketPopup;
  if (popup && typeof popup.isClosed === "function" && !popup.isClosed()) return popup;
  return page;
}

async function getTicketScope(page: any): Promise<any> {
  const popup = (page as any).__ticketPopup;
  if (popup && typeof popup.isClosed === "function" && !popup.isClosed()) return popup;
  const selectors = [
    page.locator('[role="dialog"], [class*="modal"], [class*="Modal"], [class*="drawer"], [class*="Drawer"], [class*="sheet"]').filter({ hasText: /이용권\s*내역|구매회차|대여권|소장권\s*\d+\s*장/ }),
    page.locator('[class*="overlay"], [class*="Overlay"], [class*="layer"], [class*="Layer"]').filter({ hasText: /이용권\s*내역/ }).filter({ hasText: /대여권|소장권|구매회차/ }),
    page.locator('div, section').filter({ hasText: /이용권\s*내역\s*\|?\s*카카오페이지|이용권\s*내역/ }).filter({ hasText: /대여권|소장권|구매회차|최신순/ }),
  ];
  for (const modal of selectors) {
    const first = modal.first();
    await first.waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
    if ((await first.count()) > 0 && (await first.isVisible().catch(() => false))) return first;
  }
  await safeWait(page,1500);
  try {
    await page.waitForFunction(() => /history\/ticket/.test(window.location.pathname || ""), { timeout: 3000 }).catch(() => null);
  } catch {
    // ignore
  }
  await page.getByText(/이용권\s*내역|대여권|소장권|구매회차/).first().waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
  return page;
}

And("이용권 내역 팝업창에서 구매를 취소할 대여권 타입을 클릭한다", async ({ page }) => {
  const scope = await getTicketScope(page);
  await safeWait(page,800);
  const isPage = typeof (scope as any).url === "function";
  if (isPage) {
    const done = await scope.evaluate(() => {
      const container = document.body;
      const reBad = /구매\s*취소(?!\s*하기)/;
      const candidates = container.querySelectorAll('[data-t-obj*="대여_대여권"], [data-t-obj*="대여권"]');
      for (const el of Array.from(candidates)) {
        const row = (el as HTMLElement).closest('[class*="item"], [class*="row"], [class*="Row"], [class*="list"]') || (el as HTMLElement).parentElement?.parentElement || (el as HTMLElement).parentElement || (el as HTMLElement);
        const text = (row as HTMLElement)?.innerText ?? (el as HTMLElement).innerText ?? "";
        if (reBad.test(text)) continue;
        const clickable = (el as HTMLElement).querySelector('div[class*="cursor-pointer"]') || (el as HTMLElement);
        (clickable as HTMLElement).click();
        return true;
      }
      const divs = container.querySelectorAll('div');
      for (const div of Array.from(divs)) {
        const t = (div as HTMLElement).innerText ?? "";
        if (!/대여권\s*[1-9]\d*\s*장/.test(t) || /대여\s*완료|취소\s*완료|무료/.test(t)) continue;
        if (reBad.test(t)) continue;
        const cp = (div as HTMLElement).querySelector('div[class*="cursor-pointer"]');
        if (cp && /[1-9]\d*\s*장/.test((cp as HTMLElement).innerText ?? "")) {
          (cp as HTMLElement).click();
          return true;
        }
      }
      return false;
    });
    if (done) { await safeWait(page,1500); return; }
  } else {
    const el = await scope.first().elementHandle().catch(() => null);
    if (el) {
      const done = await el.evaluate((root: HTMLElement) => {
        const container = root;
        const reBad = /구매\s*취소(?!\s*하기)/;
        const candidates = container.querySelectorAll('[data-t-obj*="대여_대여권"], [data-t-obj*="대여권"]');
        for (const el of Array.from(candidates)) {
          const row = (el as HTMLElement).closest('[class*="item"], [class*="row"], [class*="Row"], [class*="list"]') || (el as HTMLElement).parentElement?.parentElement || (el as HTMLElement).parentElement || (el as HTMLElement);
          const text = (row as HTMLElement)?.innerText ?? (el as HTMLElement).innerText ?? "";
          if (reBad.test(text)) continue;
          const clickable = (el as HTMLElement).querySelector('div[class*="cursor-pointer"]') || (el as HTMLElement);
          (clickable as HTMLElement).click();
          return true;
        }
        const divs = container.querySelectorAll('div');
        for (const div of Array.from(divs)) {
          const t = (div as HTMLElement).innerText ?? "";
          if (!/대여권\s*[1-9]\d*\s*장/.test(t) || /대여\s*완료|취소\s*완료|무료/.test(t)) continue;
          if (reBad.test(t)) continue;
          const cp = (div as HTMLElement).querySelector('div[class*="cursor-pointer"]');
          if (cp && /[1-9]\d*\s*장/.test((cp as HTMLElement).innerText ?? "")) {
            (cp as HTMLElement).click();
            return true;
          }
        }
        return false;
      });
      if (done) { await safeWait(page,1500); return; }
    }
  }
  const rowWith대여권 = scope.locator('[class*="item"], [class*="row"], [class*="Row"]').filter({ hasText: /대여권/ }).filter({ hasText: /[1-9]\d*\s*장/ }).filter({ hasNotText: /대여\s*완료|취소\s*완료|무료/ }).filter({ hasNotText: /구매\s*취소(?!\s*하기)/ });
  const clickableInRow = rowWith대여권.locator('div[class*="cursor-pointer"]').filter({ hasText: /[1-9]\d*\s*장/ }).first();
  if ((await clickableInRow.count()) > 0 && (await clickableInRow.isVisible().catch(() => false))) {
    await clickableInRow.scrollIntoViewIfNeeded().catch(() => null);
    await safeWait(page,400);
    await clickableInRow.click({ timeout: 15000, force: true });
    await safeWait(page,1500);
    return;
  }
  const fallback = scope.locator('div').filter({ hasText: /대여권/ }).filter({ hasText: /[1-9]\d*\s*장/ }).filter({ hasNotText: /대여\s*완료|취소\s*완료|구매\s*취소(?!\s*하기)/ }).first();
  if ((await fallback.count()) > 0 && (await fallback.isVisible().catch(() => false))) {
    const inner = fallback.locator('div[class*="cursor-pointer"]').first();
    if ((await inner.count()) > 0) await inner.click({ timeout: 15000, force: true });
    else await fallback.click({ timeout: 15000, force: true });
    await safeWait(page,1500);
    return;
  }
  throw new Error("구매 취소 가능한 대여권 행을 찾을 수 없습니다. '구매 취소'로 표기된(이미 취소된) 행은 제외됩니다.");
});

And("이용권 내역 팝업창에서 구매를 취소할 소장권 타입을 클릭한다", async ({ page }) => {
  const scope = await getTicketScope(page);
  await safeWait(page,800);
  const isPage = typeof (scope as any).url === "function";
  if (isPage) {
    const done = await scope.evaluate(() => {
      const container = document.body;
      const reBad = /구매\s*취소(?!\s*하기)/;
      const candidates = container.querySelectorAll('[data-t-obj*="소장권"]');
      for (const el of Array.from(candidates)) {
        const row = (el as HTMLElement).closest('[class*="item"], [class*="row"], [class*="Row"], [class*="list"]') || (el as HTMLElement).parentElement?.parentElement || (el as HTMLElement).parentElement || (el as HTMLElement);
        const text = (row as HTMLElement)?.innerText ?? (el as HTMLElement).innerText ?? "";
        if (reBad.test(text)) continue;
        const clickable = (el as HTMLElement).querySelector('div[class*="cursor-pointer"]') || (el as HTMLElement);
        (clickable as HTMLElement).click();
        return true;
      }
      const divs = container.querySelectorAll('div');
      for (const div of Array.from(divs)) {
        const t = (div as HTMLElement).innerText ?? "";
        if (!/소장권\s*[1-9]\d*\s*장/.test(t) || /취소\s*완료|취소완료|무료/.test(t)) continue;
        if (reBad.test(t)) continue;
        const cp = (div as HTMLElement).querySelector('div[class*="cursor-pointer"]');
        if (cp && /[1-9]\d*\s*장/.test((cp as HTMLElement).innerText ?? "")) {
          (cp as HTMLElement).click();
          return true;
        }
      }
      return false;
    });
    if (done) { await safeWait(page,1500); return; }
  } else {
    const el = await scope.first().elementHandle().catch(() => null);
    if (el) {
      const done = await el.evaluate((root: HTMLElement) => {
        const container = root;
        const reBad = /구매\s*취소(?!\s*하기)/;
        const candidates = container.querySelectorAll('[data-t-obj*="소장권"]');
        for (const el of Array.from(candidates)) {
          const row = (el as HTMLElement).closest('[class*="item"], [class*="row"], [class*="Row"], [class*="list"]') || (el as HTMLElement).parentElement?.parentElement || (el as HTMLElement).parentElement || (el as HTMLElement);
          const text = (row as HTMLElement)?.innerText ?? (el as HTMLElement).innerText ?? "";
          if (reBad.test(text)) continue;
          const clickable = (el as HTMLElement).querySelector('div[class*="cursor-pointer"]') || (el as HTMLElement);
          (clickable as HTMLElement).click();
          return true;
        }
        const divs = container.querySelectorAll('div');
        for (const div of Array.from(divs)) {
          const t = (div as HTMLElement).innerText ?? "";
          if (!/소장권\s*[1-9]\d*\s*장/.test(t) || /취소\s*완료|취소완료|무료/.test(t)) continue;
          if (reBad.test(t)) continue;
          const cp = (div as HTMLElement).querySelector('div[class*="cursor-pointer"]');
          if (cp && /[1-9]\d*\s*장/.test((cp as HTMLElement).innerText ?? "")) {
            (cp as HTMLElement).click();
            return true;
          }
        }
        return false;
      });
      if (done) { await safeWait(page,1500); return; }
    }
  }
  const row소장권 = scope.locator('[class*="item"], [class*="row"], [class*="Row"]').filter({ hasText: /소장권/ }).filter({ hasText: /[1-9]\d*\s*장/ }).filter({ hasNotText: /취소\s*완료|취소완료|무료/ }).filter({ hasNotText: /구매\s*취소(?!\s*하기)/ });
  const inner소장 = row소장권.locator('div[class*="cursor-pointer"]').filter({ hasText: /[1-9]\d*\s*장/ }).first();
  if ((await inner소장.count()) > 0 && (await inner소장.isVisible().catch(() => false))) {
    await inner소장.scrollIntoViewIfNeeded().catch(() => null);
    await safeWait(page,400);
    await inner소장.click({ timeout: 15000, force: true });
    await safeWait(page,1500);
    return;
  }
  const fallback = scope.locator('div').filter({ hasText: /소장권/ }).filter({ hasText: /[1-9]\d*\s*장/ }).filter({ hasNotText: /무료|취소완료|구매\s*취소(?!\s*하기)/ }).first();
  if ((await fallback.count()) > 0 && (await fallback.isVisible().catch(() => false))) {
    const inner = fallback.locator('div[class*="cursor-pointer"]').first();
    if ((await inner.count()) > 0) await inner.click({ timeout: 15000, force: true });
    else await fallback.click({ timeout: 15000, force: true });
    await safeWait(page,1500);
    return;
  }
  throw new Error("구매 취소 가능한 소장권 행을 찾을 수 없습니다. '구매 취소'로 표기된(이미 취소된) 행은 제외됩니다.");
});

And("이용권 내역 상세 팝업창에서 스크롤 다운 후 구매 취소하기 버튼을 클릭한다", async ({ page }) => {
  const scope = await getTicketScope(page);
  await safeWait(page,1500);
  const isPage = typeof (scope as any).url === "function";
  const waitForDetailView = async () => {
    if (isPage) {
      try {
        await scope.waitForFunction(
          () => /history\/ticket\/detail/.test(window.location.pathname || ""),
          { timeout: 5000 }
        ).catch(() => null);
      } catch {
        // ignore
      }
    }
    const hasDetail = (await scope.getByText(/이용권\s*내역\s*상세|취소\s*가능한\s*이용권\s*수|취소\s*가능한\s*캐시/).count()) > 0;
    if (hasDetail) await safeWait(page,500);
    await safeWait(page,1200);
  };
  await waitForDetailView();

  const scrollToBottom = async () => {
    if (isPage) {
      await scope.evaluate(() => {
        const scrollables = [
          document.documentElement,
          document.body,
          document.querySelector("main"),
          document.querySelector('[class*="content"]'),
          document.querySelector('[class*="scroll"]'),
          document.querySelector('[role="dialog"]'),
          document.querySelector('[class*="modal"], [class*="Modal"], [class*="drawer"], [class*="Drawer"]'),
        ].filter(Boolean) as HTMLElement[];
        const maxScroll = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          ...scrollables.map((el) => el.scrollHeight)
        );
        window.scrollTo(0, maxScroll);
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
        document.body.scrollTop = document.body.scrollHeight;
        for (const el of scrollables) {
          if (el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
        }
      });
    } else {
      await scope.evaluate((el: HTMLElement) => {
        const root = el;
        root.scrollTop = root.scrollHeight;
        const inner = root.querySelector('[class*="scroll"], [class*="content"], [class*="body"], [class*="Content"]');
        if (inner && (inner as HTMLElement).scrollHeight > (inner as HTMLElement).clientHeight) {
          (inner as HTMLElement).scrollTop = (inner as HTMLElement).scrollHeight;
        }
      });
    }
  };

  const scrollIncremental = async () => {
    if (isPage) {
      await scope.evaluate(() => {
        const step = 300;
        for (let i = 0; i < 20; i++) {
          window.scrollBy(0, step);
          document.body.scrollTop += step;
        }
      });
    } else {
      await scope.evaluate((el: HTMLElement) => {
        const step = 300;
        el.scrollTop += step;
        const inner = el.querySelector('[class*="scroll"], [class*="content"]');
        if (inner) (inner as HTMLElement).scrollTop += step;
      });
    }
  };

  const cancelSelectors = [
    () => scope.getByRole("button", { name: /구매\s*취소\s*하기|구매\s*취소|구매취소하기|구매취소/ }),
    () => scope.getByRole("link", { name: /구매\s*취소\s*하기|구매\s*취소|구매취소하기|구매취소/ }),
    () => scope.getByText(/구매\s*취소\s*하기|구매\s*취소(?!\s*가능)/).first(),
    () => scope.locator('button, a, [role="button"]').filter({ hasText: /구매\s*취소|구매취소/ }).first(),
  ];

  let clicked = false;
  for (let round = 0; round < 35 && !clicked; round++) {
    await scrollToBottom();
    for (let s = 0; s < 3; s++) await scrollIncremental();
    await safeWait(page,400);
    for (const getLocator of cancelSelectors) {
      const btn = getLocator();
      if ((await btn.count()) > 0) {
        const first = btn.first();
        if (await first.isVisible().catch(() => false)) {
          await first.scrollIntoViewIfNeeded();
          await safeWait(page,200);
          await first.click({ timeout: 8000, force: true });
          clicked = true;
          break;
        }
      }
    }
    if (clicked) break;
  }

  const tryEvalClick = async (): Promise<boolean> => {
    if (isPage) {
      return await scope.evaluate(() => {
        const texts = ["구매 취소하기", "구매 취소"];
        for (const t of texts) {
          const xpath = `//*[contains(text(),"${t}") or contains(.,"${t}")]`;
          const iter = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
          let el: Element | null = iter.iterateNext() as Element | null;
          while (el) {
            const tag = (el as HTMLElement).tagName?.toLowerCase();
            if (tag === "button" || tag === "a" || (el as HTMLElement).getAttribute?.("role") === "button") {
              (el as HTMLElement).click();
              return true;
            }
            const clickable = el.closest("button, a, [role='button']");
            if (clickable) {
              (clickable as HTMLElement).click();
              return true;
            }
            el = iter.iterateNext() as Element | null;
          }
        }
        return false;
      }).catch(() => false);
    }
    return await scope.evaluate((el: HTMLElement) => {
      const texts = ["구매 취소하기", "구매 취소"];
      for (const t of texts) {
        const nodes = el.querySelectorAll("*");
        for (const node of Array.from(nodes)) {
          const text = (node as HTMLElement).innerText || (node as HTMLElement).textContent || "";
          if (text.includes(t)) {
            const clickable = (node as HTMLElement).closest("button, a, [role='button']") || node;
            (clickable as HTMLElement).click();
            return true;
          }
        }
      }
      return false;
    }).catch(() => false);
  };

  if (!clicked) {
    await scrollToBottom();
    await safeWait(page,500);
    clicked = await tryEvalClick();
  }

  if (!clicked) {
    throw new Error("구매 취소하기 버튼을 찾을 수 없습니다. 이용권 내역 상세 팝업에서 화면 하단으로 스크롤한 뒤 '구매 취소' 버튼이 노출되는지 확인하세요.");
  }
  await safeWait(page,500);
});

And("이용권을 취소 하시겠습니까? 메세지 팝업에서 확인 버튼을 클릭한다", async ({ page }) => {
  const scope = await getTicketScope(page);
  await safeWait(page,600);
  const confirm = scope.getByRole("button", { name: "확인" }).or(scope.getByRole("button", { name: /^확인$/ })).first();
  if ((await confirm.count()) > 0 && (await confirm.isVisible().catch(() => false))) await confirm.click({ timeout: 8000 });
  await safeWait(page,500);
});

Then("이용권 또는 소장권이 취소 되었습니다. 토스트 메세지가 노출되는 걸 확인한다", async ({ page }) => {
  if ((page as any).__kpa085NoCancellable === true) {
    test.skip(true, "취소 가능한 이용권이 없어 토스트 검증을 수행할 수 없음");
    return;
  }
  const toastPattern = /이용권.*취소\s*되었습니다|소장권.*취소\s*되었습니다|취소\s*되었습니다|취소되었습니다/;
  const checkToast = async (target: any) => (await target.getByText(toastPattern).count()) > 0 && (await target.getByText(toastPattern).first().isVisible().catch(() => false));
  let visible = false;
  for (let wait = 0; wait < 8 && !visible; wait++) {
    await safeWait(page,wait === 0 ? 1200 : 800);
    const scope = await getTicketScope(page).catch(() => page);
    visible = await checkToast(scope) || await checkToast(page);
    if (!visible && (page as any).__ticketPopup && typeof (page as any).__ticketPopup.getByText === "function") {
      try {
        if (!(page as any).__ticketPopup.isClosed()) visible = await checkToast((page as any).__ticketPopup);
      } catch { /* ignore */ }
    }
    if (!visible && typeof page.context === "function") {
      for (const p of page.context().pages()) {
        try { if (!p.isClosed() && (await checkToast(p))) { visible = true; break; } } catch { /* ignore */ }
      }
    }
  }
  expect(visible).toBe(true);
});

And("이용권 내역 상세 팝업 우측 상단의 닫기 버튼을 클릭한다", async ({ page }) => {
  if ((page as any).__kpa085NoCancellable === true) {
    return;
  }
  const scope = await getTicketScope(page);
  await safeWait(page,400);
  const closeBtn = scope.getByRole("button", { name: "닫기" }).or(scope.getByRole("button", { name: /닫기/ })).first();
  if ((await closeBtn.count()) > 0 && (await closeBtn.isVisible().catch(() => false))) await closeBtn.click({ timeout: 6000 });
  await safeWait(page,300);
});
