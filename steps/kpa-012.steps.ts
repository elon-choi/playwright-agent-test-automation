// Feature: KPA-012 시나리오 검증
// Scenario: 비로그인 상태에서 유료 회차 접근 시 로그인 유도 팝업 확인
import { Given, When, Then, And, expect, withAiFallback } from "./fixtures.js";
import {
  getEpisodeListScope,
  OTHER_WORK_CARD_MARKER,
  getCurrentContentId,
  isLinkSameWork,
  clickEpisodeTabOfCurrentWork
} from "./common.episode.steps.js";

Given('사용자가 "기다무" 작품의 BM 카테고리를 선택한다', async ({ page }) => {
  const bmToggle = page.getByRole("button", { name: /BM|기다무/i });
  if (await bmToggle.count()) {
    await bmToggle.first().click();
  }
});

When('사용자가 임의의 "기다무" BM 작품 카드 하나를 클릭한다', async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const candidates = [
        page.getByRole("link", { name: /작품,.*기다무/i }),
        page.getByRole("link", { name: /작품,/i }),
        page.locator('a[href*="/content/"]')
      ];
      for (const locator of candidates) {
        if (await locator.count()) {
          await locator.first().click();
          await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
          return;
        }
      }
      throw new Error("작품 카드를 찾지 못했습니다.");
    },
    "기다무 BM 작품 카드 하나를 클릭한다",
    ai
  );
});

And("사용자가 회차탭 하단의 최신 유료 회차를 클릭한다", async ({ page, ai }) => {
  const episodeTabCandidates = [
    page.getByRole("tab", { name: /회차/i }),
    page.getByRole("link", { name: /회차/i }),
    page.getByRole("button", { name: /회차/i })
  ];
  for (const locator of episodeTabCandidates) {
    if (await locator.count()) {
      await locator.first().click();
      break;
    }
  }
  const paidEpisodeCandidates = [
    page.getByRole("button", { name: /구매|대여|소장|잠금|유료/i }),
    page.getByRole("link", { name: /구매|대여|소장|잠금|유료/i })
  ];
  for (const locator of paidEpisodeCandidates) {
    if (await locator.count()) {
      await locator.first().click();
      await page.waitForTimeout(500);
      return;
    }
  }
  const paidViewerLinks = page.locator('a[href*="/viewer/"]:not(:has-text("무료"))');
  if (await paidViewerLinks.count()) {
    const target = paidViewerLinks.first();
    await target.scrollIntoViewIfNeeded();
    await target.click({ force: true });
    await page.waitForTimeout(500);
    return;
  }
  const viewerLinks = page.locator('a[href*="/viewer/"]');
  if (await viewerLinks.count()) {
    await viewerLinks.first().scrollIntoViewIfNeeded();
    await viewerLinks.first().click({ force: true });
    await page.waitForTimeout(500);
  }
});

When("사용자가 홈 탭 하단의 최신 유료 회차를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const episodeTabCandidates = [
        page.getByRole("tab", { name: /회차/i }),
        page.getByRole("link", { name: /회차/i }),
        page.getByRole("button", { name: /회차/i })
      ];
      for (const locator of episodeTabCandidates) {
        if (await locator.count()) {
          await locator.first().click();
          break;
        }
      }

      const paidEpisodeCandidates = [
        page.getByRole("button", { name: /구매|대여|소장|잠금|유료/i }),
        page.getByRole("link", { name: /구매|대여|소장|잠금|유료/i })
      ];
      for (const locator of paidEpisodeCandidates) {
        if (await locator.count()) {
          await locator.first().click();
          await page.waitForTimeout(500);
          return;
        }
      }

      const paidViewerLinks = page.locator('a[href*="/viewer/"]:not(:has-text("무료"))');
      if (await paidViewerLinks.count()) {
        const target = paidViewerLinks.first();
        await target.scrollIntoViewIfNeeded();
        await target.click({ force: true });
        try {
          await page.waitForURL(/\/viewer\/|accounts\.kakao\.com\/login/i, { timeout: 3000 });
        } catch (error) {
          // ignore and continue
        }
        const loginPrompt = page.getByText(/로그인이 필요합니다|연령 확인/i);
        if (await loginPrompt.count()) {
          return;
        }
        if (/\/viewer\//i.test(page.url())) {
          const nextArrow = page.locator('img[alt*="다음"]');
          if (await nextArrow.count()) {
            await nextArrow.first().click();
            try {
              await page.waitForURL(/accounts\.kakao\.com\/login/i, { timeout: 3000 });
            } catch (error) {
              // ignore and let next step decide
            }
          }
        }
        return;
      }

      try {
        await page.waitForSelector('a[href*="/viewer/"]', { timeout: 15000 });
      } catch (error) {
        // ignore and continue to other fallbacks
      }
      const viewerLinks = page.locator('a[href*="/viewer/"]');
      const viewerCount = await viewerLinks.count();
      for (let i = 0; i < Math.min(viewerCount, 50); i += 1) {
        const link = viewerLinks.nth(i);
        const text = await link.innerText();
        if (/화/.test(text) && !/무료/.test(text)) {
          await link.scrollIntoViewIfNeeded();
          await link.click();
          try {
            await page.waitForURL(/\/viewer\/|accounts\.kakao\.com\/login/i, { timeout: 3000 });
          } catch (error) {
            // ignore and continue
          }
          const loginPrompt = page.getByText(/로그인이 필요합니다|연령 확인/i);
          if (/accounts\.kakao\.com\/login/i.test(page.url()) || (await loginPrompt.count())) {
            return;
          }
          if (/\/viewer\//i.test(page.url())) {
            const nextArrow = page.locator('img[alt*="다음"]');
            if (await nextArrow.count()) {
              await nextArrow.first().click();
              try {
                await page.waitForURL(/accounts\.kakao\.com\/login/i, { timeout: 3000 });
              } catch (error) {
                // ignore and let next step decide
              }
            }
          }
        }
      }
      if (viewerCount > 0) {
        await viewerLinks.first().click();
        await page.waitForTimeout(500);
        return;
      }

      const ageGateMessage = page.getByText(/연령 확인이 필요|연령 확인/i);
      const ageGateLogin = page.getByRole("button", { name: /로그인/i });
      if (await ageGateMessage.count()) {
        if (await ageGateLogin.count()) {
          await ageGateLogin.first().click();
          await page.waitForTimeout(500);
          return;
        }
      }

      throw new Error("유료 회차 버튼을 찾지 못했습니다.");
    },
    "회차 탭에서 최신 유료 회차를 클릭한다",
    ai
  );
});

And("사용자가 홈 탭 하단의 회차 리스트에서 최신 유료 회차를 클릭한다", async ({ page, ai }) => {
  const PAID_INDICATOR = /구매|대여|소장|잠금|유료|\d+캐시|캐시\s*결제|대여권|소장권|결제/i;
  await withAiFallback(
    async () => {
      await clickEpisodeTabOfCurrentWork(page);
      await page.waitForTimeout(400);
      const episodeScope = await getEpisodeListScope(page);
      const currentContentId = getCurrentContentId(page.url());

      const paidButtonInScope = episodeScope.getByRole("button", { name: PAID_INDICATOR });
      const paidLinkInScope = episodeScope.getByRole("link", { name: PAID_INDICATOR });
      if (await paidButtonInScope.count() > 0) {
        const btn = paidButtonInScope.first();
        const inOtherWork = await btn.locator(`xpath=ancestor::*[contains(@class,\"border-sp-thumb-line\")]`).count() > 0;
        if (!inOtherWork) {
          await btn.scrollIntoViewIfNeeded().catch(() => null);
          await btn.click({ force: true });
          await page.waitForTimeout(500);
          return;
        }
      }
      if (await paidLinkInScope.count() > 0) {
        const link = paidLinkInScope.first();
        const inOtherWork = await link.locator(`xpath=ancestor::*[contains(@class,\"border-sp-thumb-line\")]`).count() > 0;
        if (!inOtherWork) {
          const href = await link.getAttribute("href").catch(() => null);
          const path = href ? new URL(href, page.url()).pathname : "";
          if (isLinkSameWork(path, currentContentId, page.url())) {
            await link.scrollIntoViewIfNeeded().catch(() => null);
            await link.click({ force: true });
            await page.waitForTimeout(500);
            return;
          }
        }
      }

      const rows = episodeScope
        .locator('[class*="item"], [class*="row"], [class*="episode"], [class*="Episode"], tr, li')
        .filter({ hasNot: episodeScope.locator(OTHER_WORK_CARD_MARKER) })
        .filter({ has: page.locator('a[href*="/viewer/"]') });
      const rowCount = await rows.count();
      for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const rowText = await row.textContent().catch(() => "") ?? "";
        const hasFree = /무료/.test(rowText);
        const hasPaid = PAID_INDICATOR.test(rowText);
        if (hasFree && !hasPaid) continue;
        const link = row.locator('a[href*="/viewer/"]').first();
        if ((await link.count()) === 0) continue;
        const href = await link.getAttribute("href").catch(() => null);
        const path = href ? new URL(href, page.url()).pathname : "";
        if (!isLinkSameWork(path, currentContentId, page.url())) continue;
        await link.scrollIntoViewIfNeeded().catch(() => null);
        await link.click({ force: true });
        try {
          await page.waitForURL(/\/viewer\/|accounts\.kakao\.com\/login/i, { timeout: 3000 });
        } catch {
          // ignore
        }
        const loginPrompt = page.getByText(/로그인이 필요합니다|연령 확인/i);
        if (await loginPrompt.count()) return;
        if (/\/viewer\//i.test(page.url())) {
          const nextArrow = page.locator('img[alt*="다음"]');
          if (await nextArrow.count()) {
            await nextArrow.first().click();
            try {
              await page.waitForURL(/accounts\.kakao\.com\/login/i, { timeout: 3000 });
            } catch {
              // ignore
            }
          }
        }
        return;
      }

      const scopeViewerLinks = episodeScope.locator('a[href*="/viewer/"]');
      const scopeLinkCount = await scopeViewerLinks.count();
      for (let i = 0; i < scopeLinkCount; i++) {
        const link = scopeViewerLinks.nth(i);
        const inOtherWork = await link.locator("xpath=ancestor::*[contains(@class,\"border-sp-thumb-line\")]").count() > 0;
        if (inOtherWork) continue;
        const href = await link.getAttribute("href").catch(() => null);
        const path = href ? new URL(href, page.url()).pathname : "";
        if (!isLinkSameWork(path, currentContentId, page.url())) continue;
        const text = await link.innerText().catch(() => "");
        if (/무료/.test(text) && !PAID_INDICATOR.test(text)) continue;
        await link.scrollIntoViewIfNeeded().catch(() => null);
        await link.click({ force: true });
        try {
          await page.waitForURL(/\/viewer\/|accounts\.kakao\.com\/login/i, { timeout: 3000 });
        } catch {
          // ignore
        }
        return;
      }

      const ageGateMessage = page.getByText(/연령 확인이 필요|연령 확인/i);
      const ageGateLogin = page.getByRole("button", { name: /로그인/i });
      if (await ageGateMessage.count() && (await ageGateLogin.count())) {
        await ageGateLogin.first().click();
        await page.waitForTimeout(500);
        return;
      }
      throw new Error("회차 리스트 영역에서 유료 회차를 찾지 못했습니다.");
    },
    "홈 탭 하단의 회차 리스트에서 최신 유료 회차를 클릭한다",
    ai
  );
});
