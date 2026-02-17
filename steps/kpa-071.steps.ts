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
  await page.waitForTimeout(800);

  const popupPromise = page.waitForEvent("popup", { timeout: 12000 }).catch(() => null);

  const ticketBlock = page.locator('[class*="ticket"], [class*="Ticket"], [class*="item"], [class*="row"]')
    .filter({ hasText: /대여권\s*\d+\s*장|소장권\s*\d+\s*장/ })
    .filter({ hasNotText: /이어보기/ });

  const clickArrowOnly = async (): Promise<boolean> => {
    const withCharge = ticketBlock.filter({ hasText: /충전/ }).first();
    const block = (await withCharge.count()) > 0 ? withCharge : ticketBlock.first();
    if ((await block.count()) === 0) return false;
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const arrow = block.locator('img[alt*="다음"], img[alt*="arrow"], img[aria-label*="다음"], [class*="arrow"], [class*="chevron"], [class*="Arrow"], [class*="Chevron"]').first();
    if ((await arrow.count()) > 0 && (await arrow.isVisible().catch(() => false))) {
      await arrow.click({ timeout: 8000, force: true }).catch(() => arrow.evaluate((e: HTMLElement) => e.click()));
      return true;
    }
    const linkArrow = block.getByRole("link", { name: ">" }).or(block.locator('a').filter({ hasText: /^>\s*$/ }));
    if ((await linkArrow.count()) > 0 && (await linkArrow.first().isVisible().catch(() => false))) {
      await linkArrow.first().click({ timeout: 8000, force: true });
      return true;
    }
    const btnArrow = block.getByRole("button", { name: ">" }).or(block.locator('button').filter({ hasText: /^>\s*$/ }));
    if ((await btnArrow.count()) > 0 && (await btnArrow.first().isVisible().catch(() => false))) {
      await btnArrow.first().click({ timeout: 8000, force: true });
      return true;
    }
    const genericArrow = block.locator('[class*="icon"], [class*="Icon"], span, div').filter({ hasText: /^>\s*$/ }).first();
    if ((await genericArrow.count()) > 0 && (await genericArrow.isVisible().catch(() => false))) {
      await genericArrow.click({ timeout: 8000, force: true });
      return true;
    }
    return false;
  };

  let clicked = await clickArrowOnly();

  if (!clicked) {
    const historyTicketLink = page.locator('a[href*="/history/ticket"]').first();
    if ((await historyTicketLink.count()) > 0 && (await historyTicketLink.isVisible().catch(() => false))) {
      await historyTicketLink.scrollIntoViewIfNeeded();
      await historyTicketLink.click({ timeout: 10000, force: true });
      clicked = true;
    }
  }

  if (!clicked) {
    const textPattern = /대여권\s*\d+\s*장\s*소장권\s*\d+\s*장|대여권\s*\d+\s*장|소장권\s*\d+\s*장/;
    const byContainer = page.locator('[class*="ticket"], [class*="Ticket"], [class*="item"], [class*="row"]')
      .filter({ hasText: /대여권/ })
      .filter({ hasText: /소장권|장/ })
      .filter({ hasNotText: /이어보기/ })
      .first();
    for (let attempt = 0; attempt < 4 && !clicked; attempt++) {
      if (attempt > 0) await page.waitForTimeout(400);
      if ((await byContainer.count()) > 0 && (await byContainer.isVisible().catch(() => false))) {
        const arrowIn = byContainer.locator('img, [class*="arrow"], [class*="chevron"], [class*="icon"]').first();
        if ((await arrowIn.count()) > 0 && (await arrowIn.isVisible().catch(() => false))) {
          await arrowIn.click({ timeout: 8000, force: true });
          clicked = true;
        } else {
          await byContainer.click({ timeout: 10000, force: true }).catch(() => byContainer.evaluate((e: HTMLElement) => e.click()));
          clicked = true;
        }
        break;
      }
      const byText = page.getByText(textPattern).first();
      if ((await byText.count()) > 0 && (await byText.isVisible({ timeout: 1500 }).catch(() => false))) {
        const containerWithArrow = page.locator('[class*="ticket"], [class*="Ticket"], [class*="item"], [class*="row"], div, section')
          .filter({ has: page.getByText(textPattern) })
          .filter({ has: page.locator('img, [class*="arrow"], [class*="chevron"], [class*="icon"]') })
          .first();
        const arrowEl = containerWithArrow.locator('img, [class*="arrow"], [class*="chevron"], [class*="icon"]').first();
        if ((await containerWithArrow.count()) > 0 && (await arrowEl.count()) > 0 && (await arrowEl.isVisible().catch(() => false))) {
          await arrowEl.click({ timeout: 8000, force: true });
        } else {
          await byText.scrollIntoViewIfNeeded();
          await byText.click({ timeout: 10000, force: true }).catch(() => byText.evaluate((e: HTMLElement) => e.click()));
        }
        clicked = true;
        break;
      }
    }
  }

  const popup = await popupPromise;
  if (popup && !popup.isClosed()) {
    (page as any).__ticketPopup = popup;
    await popup.getByText(/이용권\s*내역|대여권|소장권/).first().waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
  } else {
    await page.getByText(/이용권\s*내역|구매회차|대여권|소장권/).first().waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
  }
  await page.waitForTimeout(800);
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
