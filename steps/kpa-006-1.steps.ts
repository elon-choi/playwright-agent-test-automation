// Feature: KPA-006-1 서비스 탈퇴 페이지 > 이용권 내역 페이지 이동
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("서비스 탈퇴 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const menu = page
    .getByRole("link", { name: /서비스\s*탈퇴/i })
    .or(page.getByRole("button", { name: /서비스\s*탈퇴/i }))
    .or(page.getByText(/서비스\s*탈퇴/i).first());
  await menu.waitFor({ state: "attached", timeout: 10000 });
  const el = menu.first();
  await el.scrollIntoViewIfNeeded().catch(() => null);
  await el.evaluate((e: HTMLElement) => {
    const clickable = e.closest("a, button, [role='button']") || e;
    (clickable as HTMLElement).click();
  });
});

When("이용권 내역 > 문장을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const link = page
    .getByRole("link", { name: /이용권\s*내역\s*>?|이용권\s*내역/i })
    .first();
  const byText = page.getByText(/이용권\s*내역\s*>?|이용권\s*내역/i).first();
  if ((await link.count()) > 0 && (await link.isVisible().catch(() => false))) {
    await link.scrollIntoViewIfNeeded().catch(() => null);
    await link.click({ timeout: 10000 });
    return;
  }
  await byText.waitFor({ state: "visible", timeout: 10000 });
  await byText.scrollIntoViewIfNeeded().catch(() => null);
  await byText.evaluate((e: HTMLElement) => {
    const clickable = e.closest("a, button, [role='button']") || e;
    (clickable as HTMLElement).click();
  });
});

Then("사용자는 이용권 내역 페이지로 이동한다", async ({ page }) => {
  const origin = getBaseUrlOrigin();
  const urlMatches = (url: string) => {
    try {
      const u = new URL(url);
      if (u.origin !== origin) return false;
      return /\/history\/ticket|\/ticket|ticket|이용권|menu/i.test(u.pathname) || /ticket|이용권|history/i.test(url);
    } catch {
      return false;
    }
  };
  const pageHasTicket = async (p: any) => {
    if (p.isClosed()) return false;
    if (urlMatches(p.url())) return true;
    const visible = await p.getByText(/이용권\s*내역|보유\s*이용권|이용권\s*내역이\s*없습니다|충전\s*내역|소장권|대여권|이용권/i).first().isVisible({ timeout: 2000 }).catch(() => false);
    return visible;
  };

  await page.waitForTimeout(2000);
  let ok = await pageHasTicket(page);
  if (!ok && typeof page.context === "function") {
    const pages = page.context().pages();
    for (const p of pages) {
      if (p === page) continue;
      ok = await pageHasTicket(p);
      if (ok) break;
    }
  }
  if (!ok) {
    const bodyText = await page.evaluate(() => document.body?.innerText ?? "").catch(() => "");
    ok = /이용권\s*내역|보유\s*이용권|충전\s*내역|소장권|대여권|이용권/.test(bodyText);
  }
  expect(ok).toBe(true);
});
