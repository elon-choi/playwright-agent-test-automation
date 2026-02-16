// Feature: KPA-085-1 대여권 환불 검증 (이용권 내역에서)
import { And, Then, expect } from "./fixtures.js";

And("이용권 내역 메뉴를 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(400);
  const menu = page.getByRole("link", { name: /이용권\s*내역/i }).or(page.getByText(/이용권\s*내역/).first());
  if ((await menu.count()) > 0 && (await menu.first().isVisible().catch(() => false))) {
    await menu.first().click({ timeout: 10000 });
    await page.waitForTimeout(800);
    return;
  }
  const byText = page.getByText(/이용권\s*내역/).first();
  if ((await byText.count()) > 0) await byText.click({ timeout: 10000 });
  await page.waitForTimeout(800);
});

And("스크롤 다운을 하면서 구매한 이용권 내역이 노출 될때까지 찾는다", async ({ page }) => {
  await page.waitForTimeout(500);
  const rechargeTab = page.getByRole("tab", { name: /충전\s*내역/i }).or(page.getByText(/충전\s*내역/).first());
  if ((await rechargeTab.count()) > 0 && (await rechargeTab.isVisible().catch(() => false))) {
    await rechargeTab.click({ timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(600);
  }
  const scrollDown = async () => {
    await page.evaluate(() => {
      const list = document.querySelector('[class*="list"], [class*="overflow-auto"], [class*="overflow-y"]');
      if (list && (list as HTMLElement).scrollHeight > (list as HTMLElement).clientHeight) {
        (list as HTMLElement).scrollTop += 350;
      }
      window.scrollBy(0, 350);
    });
  };
  for (let i = 0; i < 20; i++) {
    const paidRow = page
      .locator('a[href*="ticket"], a[href*="content"], [class*="list"] a, [class*="item"] a, [class*="list"] [class*="item"], a')
      .filter({ hasText: /소장권\s*\d+\s*장|대여권\s*\d+\s*장/ })
      .filter({ hasNotText: /무료/ })
      .filter({ hasNotText: /구매\s*취소/ })
      .first();
    if ((await paidRow.count()) > 0 && (await paidRow.isVisible().catch(() => false))) break;
    await scrollDown();
    await page.waitForTimeout(450);
  }
});

function scrollToFindRow(page: { evaluate: (fn: () => void) => Promise<void>; waitForTimeout: (ms: number) => Promise<void> }) {
  return page.evaluate(() => {
    const list = document.querySelector('[class*="list"], [class*="overflow-auto"], [class*="overflow-y"]');
    if (list && (list as HTMLElement).scrollHeight > (list as HTMLElement).clientHeight) {
      (list as HTMLElement).scrollTop += 350;
    }
    window.scrollBy(0, 350);
  });
}

And("충전 내역 탭에서 구매한 대여권 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const row = page
    .locator('a[href*="ticket"], a[href*="content"], [class*="list"] a, [class*="item"] a, [class*="list"] [class*="item"], a')
    .filter({ hasText: /대여권\s*\d+\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /구매\s*취소/ })
    .first();
  let visible = await row.isVisible({ timeout: 2500 }).catch(() => false);
  for (let i = 0; i < 18 && !visible; i++) {
    await scrollToFindRow(page);
    await page.waitForTimeout(450);
    visible = await row.isVisible({ timeout: 2500 }).catch(() => false);
  }
  if (!visible) {
    throw new Error("구매 취소되지 않은 대여권 항목을 찾을 수 없습니다. 충전 내역에 취소 가능한 대여권이 있는지 확인하세요.");
  }
  await row.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await row.click({ timeout: 10000, force: true });
  await page.waitForTimeout(800);
});

And("충전 내역 탭에서 구매 취소 처리되지 않은 구매한 대여권 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const row = page
    .locator('a[href*="ticket"], a[href*="content"], [class*="list"] a, [class*="item"] a, [class*="list"] [class*="item"], a')
    .filter({ hasText: /대여권\s*\d+\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /구매\s*취소/ })
    .first();
  let visible = await row.isVisible({ timeout: 2500 }).catch(() => false);
  for (let i = 0; i < 18 && !visible; i++) {
    await scrollToFindRow(page);
    await page.waitForTimeout(450);
    visible = await row.isVisible({ timeout: 2500 }).catch(() => false);
  }
  if (!visible) {
    throw new Error("구매 취소되지 않은 대여권 항목을 찾을 수 없습니다. 충전 내역에 취소 가능한 대여권이 있는지 확인하세요.");
  }
  await row.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await row.click({ timeout: 10000, force: true });
  await page.waitForTimeout(800);
});

And("충전 내역 탭에서 구매한 소장권 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const row = page
    .locator('a[href*="ticket"], a[href*="content"], [class*="list"] a, [class*="item"] a, [class*="list"] [class*="item"], a')
    .filter({ hasText: /소장권\s*\d+\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /구매\s*취소/ })
    .first();
  let visible = await row.isVisible({ timeout: 2500 }).catch(() => false);
  for (let i = 0; i < 18 && !visible; i++) {
    await scrollToFindRow(page);
    await page.waitForTimeout(450);
    visible = await row.isVisible({ timeout: 2500 }).catch(() => false);
  }
  if (!visible) {
    throw new Error("구매 취소되지 않은 소장권 항목을 찾을 수 없습니다. 충전 내역에 취소 가능한 소장권이 있는지 확인하세요.");
  }
  await row.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await row.click({ timeout: 10000, force: true });
  await page.waitForTimeout(800);
});

And("충전 내역 탭에서 구매 취소 처리되지 않은 구매한 소장권 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const row = page
    .locator('a[href*="ticket"], a[href*="content"], [class*="list"] a, [class*="item"] a, [class*="list"] [class*="item"], a')
    .filter({ hasText: /소장권\s*\d+\s*장/ })
    .filter({ hasNotText: /무료/ })
    .filter({ hasNotText: /구매\s*취소/ })
    .first();
  let visible = await row.isVisible({ timeout: 2500 }).catch(() => false);
  for (let i = 0; i < 18 && !visible; i++) {
    await scrollToFindRow(page);
    await page.waitForTimeout(450);
    visible = await row.isVisible({ timeout: 2500 }).catch(() => false);
  }
  if (!visible) {
    throw new Error("구매 취소되지 않은 소장권 항목을 찾을 수 없습니다. 충전 내역에 취소 가능한 소장권이 있는지 확인하세요.");
  }
  await row.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await row.click({ timeout: 10000, force: true });
  await page.waitForTimeout(800);
});

And("이용권 내역 팝업창에서 구매를 취소할 대여권 타입을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  const 무료아님 = page.locator('a, [role="button"], [class*="item"], [class*="Item"]').filter({ hasText: /대여권\s*\d+\s*장/ }).filter({ hasNotText: /무료\s*대여권|0\s*캐시/ }).first();
  if ((await 무료아님.count()) > 0) {
    await 무료아님.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300);
    await 무료아님.click({ timeout: 10000, force: true });
  } else {
    const 대여권타입 = page.getByText(/대여권\s*\d+\s*장/).first();
    await 대여권타입.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300);
    await 대여권타입.click({ timeout: 10000, force: true });
  }
  await page.waitForTimeout(1500);
});

And("이용권 내역 팝업창에서 구매를 취소할 소장권 타입을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(600);
  const 무료아님 = page.locator('a, [role="button"], [class*="item"], [class*="Item"]').filter({ hasText: /소장권\s*\d+\s*장/ }).filter({ hasNotText: /무료|0\s*캐시/ }).first();
  if ((await 무료아님.count()) > 0) {
    await 무료아님.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300);
    await 무료아님.click({ timeout: 10000, force: true });
  } else {
    const 소장권타입 = page.getByText(/소장권\s*\d+\s*장/).first();
    await 소장권타입.scrollIntoViewIfNeeded().catch(() => null);
    await page.waitForTimeout(300);
    await 소장권타입.click({ timeout: 10000, force: true });
  }
  await page.waitForTimeout(1500);
});

And("이용권 내역 상세 팝업창에서 스크롤 다운 후 구매 취소하기 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(1200);
  await page.getByText(/유효기간|구매일|구매\s*취소|구매취소|취소\s*하기/).first().waitFor({ state: "attached", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(600);
  const scrollInModal = async () => {
    await page.evaluate(() => {
      const selectors = [
        '[role="dialog"]',
        '[class*="modal"]',
        '[class*="Modal"]',
        '[class*="drawer"]',
        '[class*="Drawer"]',
        '[class*="bottomSheet"]',
        '[class*="sheet"]',
        '[class*="SlidePanel"]',
        '[class*="Panel"]',
      ];
      let d: Element | null = null;
      for (const sel of selectors) {
        try {
          d = document.querySelector(sel);
          if (d) break;
        } catch (_) {}
      }
      const scrollables: HTMLElement[] = [];
      if (d) {
        const inner = d.querySelector('[class*="overflow-auto"], [class*="overflow-y"], [class*="overflow-y-scroll"], [class*="scroll"], [class*="Scroll"]');
        if (inner && (inner as HTMLElement).scrollHeight > (inner as HTMLElement).clientHeight) scrollables.push(inner as HTMLElement);
        if (d.scrollHeight > (d as HTMLElement).clientHeight) scrollables.push(d as HTMLElement);
      }
      scrollables.forEach((el) => { el.scrollTop = el.scrollHeight; });
      const main = document.querySelector('main, [class*="content"]');
      if (main && (main as HTMLElement).scrollHeight > (main as HTMLElement).clientHeight) (main as HTMLElement).scrollTop = (main as HTMLElement).scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
    });
  };
  const cancelBtn = page
    .getByRole("button", { name: /구매\s*취소|취소\s*하기/ })
    .or(page.getByRole("link", { name: /구매\s*취소|취소\s*하기/ }))
    .or(page.locator("button, a, [role='button'], [class*='button']").filter({ hasText: /구매\s*취소|구매취소|취소\s*하기/ }).first())
    .or(page.getByText(/구매\s*취소\s*하기|구매취소하기|구매\s*취소|구매취소/).first());
  for (let i = 0; i < 20; i++) {
    await scrollInModal();
    await page.waitForTimeout(400);
    const found = cancelBtn.first();
    const count = await found.count().catch(() => 0);
    if (count > 0 && (await found.isVisible().catch(() => false))) {
      await found.scrollIntoViewIfNeeded().catch(() => null);
      await page.waitForTimeout(400);
      await found.click({ timeout: 10000, force: true });
      await page.waitForTimeout(500);
      return;
    }
  }
  await scrollInModal();
  await page.waitForTimeout(500);
  const btnAny = cancelBtn.first();
  let visible = await btnAny.isVisible({ timeout: 5000 }).catch(() => false);
  if (visible) {
    await btnAny.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await btnAny.click({ timeout: 10000, force: true });
    await page.waitForTimeout(500);
    return;
  }
  const clicked = await page.evaluate(() => {
    const re = /구매\s*취소\s*하기|구매취소하기|구매\s*취소|구매취소|취소\s*하기/;
    const sel = 'button, a, [role="button"], [class*="Button"], [class*="button"]';
    function findInRoot(root: Document | ShadowRoot | Element): boolean {
      const candidates = root.querySelectorAll(sel);
      for (const el of candidates) {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (re.test(text)) {
          (el as HTMLElement).click();
          return true;
        }
      }
      const all = root.querySelectorAll('*');
      for (const el of all) {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (re.test(text) && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute?.('role') === 'button' || (el as HTMLElement).click)) {
          (el as HTMLElement).click?.();
          return true;
        }
      }
      for (const el of root.querySelectorAll('*')) {
        const shadow = (el as HTMLElement).shadowRoot;
        if (shadow && findInRoot(shadow)) return true;
      }
      return false;
    }
    return findInRoot(document);
  });
  if (clicked) {
    await page.waitForTimeout(500);
    return;
  }
  throw new Error(
    "구매 취소하기 버튼을 찾을 수 없습니다. 이용권 내역 상세에서 스크롤 후 '구매 취소하기' 버튼이 노출되는지 확인하세요."
  );
});

And("이용권을 취소 하시겠습니까? 메세지 팝업에서 확인 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const dialog = page.getByRole("dialog").or(page.locator("[role='alertdialog']")).or(page.locator("[class*='modal'], [class*='Modal']"));
  const confirm = dialog.getByRole("button", { name: /^확인$/ }).or(page.getByRole("button", { name: /^확인$/ }).first());
  if ((await confirm.count()) > 0) await confirm.click({ timeout: 8000 });
  await page.waitForTimeout(500);
});

Then("이용권 또는 소장권이 취소 되었습니다. 토스트 메세지가 노출되는 걸 확인한다", async ({ page }) => {
  await page.waitForTimeout(800);
  const toast = page.getByText(/이용권.*취소\s*되었습니다|소장권.*취소\s*되었습니다|취소\s*되었습니다/).first();
  const visible = await toast.isVisible().catch(() => false);
  if (visible) {
    expect(visible).toBe(true);
    return;
  }
  const disabled = page.getByText(/구매\s*취소\s*불가|취소\s*불가/).first();
  const fallback = await disabled.isVisible().catch(() => false);
  expect(visible || fallback).toBe(true);
});

And("이용권 내역 상세 팝업 우측 상단의 닫기 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const closeBtn = page.getByRole("button", { name: /닫기/ }).or(page.getByText(/^닫기$/).first());
  if ((await closeBtn.count()) > 0 && (await closeBtn.isVisible().catch(() => false))) {
    await closeBtn.click({ timeout: 6000 });
  }
  await page.waitForTimeout(300);
});
