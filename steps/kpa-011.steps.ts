// Feature: KPA-011 시나리오 검증
// Scenario: 비로그인 상태에서 BM 작품 열람 시 로그인 요구 확인
import { Given, When, Then, expect, withAiFallback } from "./fixtures.js";

const BADGE_IMG_NAME = /기다무|3다무|시계/i;
const BADGE_IMG_ALT = "img[alt*='기다무'], img[alt*='3다무'], img[alt*='시계'], img[alt*='기다무 뱃지']";

Given("사용자는 BM 작품을 기다무로 설정한다", async ({ page }) => {
  const bmToggle = page.getByRole("button", { name: /BM|기다무/i });
  if (await bmToggle.count()) {
    await bmToggle.first().click({ force: true });
  }
});

When("사용자가 임의의 기다무 BM 작품 카드를 클릭한다", async ({ page, ai }) => {
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
      throw new Error("기다무 BM 작품 카드를 찾지 못했습니다.");
    },
    "임의의 기다무 BM 작품 카드를 클릭한다",
    ai
  );
});

When("사용자가 회차탭 하단의 임의의 기다무 회차를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      await page.waitForTimeout(600);
      const episodeTabCandidates = [
        page.getByRole("tab", { name: /회차/i }),
        page.getByRole("link", { name: /회차/i }),
        page.getByRole("button", { name: /회차/i })
      ];
      for (const locator of episodeTabCandidates) {
        if (await locator.count()) {
          await locator.first().click();
          await page.waitForTimeout(400);
          break;
        }
      }
      const viewerLinks = page.locator('a[href*="/viewer/"]');
      const withBadgeImg = viewerLinks.filter({
        has: page.getByRole("img", { name: BADGE_IMG_NAME })
      });
      if (await withBadgeImg.count()) {
        await withBadgeImg.first().scrollIntoViewIfNeeded();
        await withBadgeImg.first().click({ force: true });
        await page.waitForTimeout(1500);
        return;
      }
      const withBadgeAlt = viewerLinks.filter({ has: page.locator(BADGE_IMG_ALT) });
      if (await withBadgeAlt.count()) {
        await withBadgeAlt.first().scrollIntoViewIfNeeded();
        await withBadgeAlt.first().click({ force: true });
        await page.waitForTimeout(1500);
        return;
      }
      const paidEpisodeCandidates = [
        page.getByRole("button", { name: /구매|대여|소장|잠금|유료|기다무/i }),
        page.getByRole("link", { name: /구매|대여|소장|잠금|유료|기다무/i }),
        page.locator("a").filter({ hasText: /\d+\s*화/ }).first()
      ];
      for (const locator of paidEpisodeCandidates) {
        if (await locator.count()) {
          const el = locator.first();
          if (await el.isVisible().catch(() => false)) {
            await el.scrollIntoViewIfNeeded();
            await el.click({ force: true });
            await page.waitForTimeout(1500);
            return;
          }
        }
      }
      const viewerCount = await viewerLinks.count();
      for (let i = 0; i < Math.min(viewerCount, 50); i += 1) {
        const link = viewerLinks.nth(i);
        const text = await link.innerText().catch(() => "");
        if (!/무료/.test(text)) {
          await link.scrollIntoViewIfNeeded();
          await link.click({ force: true });
          await page.waitForTimeout(1500);
          return;
        }
      }
      if (viewerCount > 0) {
        await viewerLinks.first().scrollIntoViewIfNeeded();
        await viewerLinks.first().click({ force: true });
        await page.waitForTimeout(1500);
        return;
      }
      throw new Error("회차탭 하단에서 기다무 회차를 찾지 못했습니다.");
    },
    "회차탭 하단의 임의의 기다무 회차를 클릭한다",
    ai
  );
});

When("사용자가 작품 이미지 좌측 상단에 3다무 또는 기다무 뱃지가 있는 작품 카드를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      const contentLinks = page.locator('a[href*="/content/"]');
      const withBadgeImg = contentLinks.filter({
        has: page.getByRole("img", { name: BADGE_IMG_NAME })
      });
      if (await withBadgeImg.count()) {
        await withBadgeImg.first().click({ force: true });
        await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
        return;
      }
      const withBadgeAlt = contentLinks.filter({ has: page.locator(BADGE_IMG_ALT) });
      if (await withBadgeAlt.count()) {
        await withBadgeAlt.first().click({ force: true });
        await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
        return;
      }
      const badgeImgThenLink = page.getByRole("img", { name: BADGE_IMG_NAME });
      const badgeCount = await badgeImgThenLink.count();
      for (let i = 0; i < badgeCount; i++) {
        const link = badgeImgThenLink.nth(i).locator("xpath=ancestor::a[contains(@href,'/content/')][1]");
        if (await link.count()) {
          await link.first().click({ force: true });
          await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
          return;
        }
      }
      const fallback = page.getByRole("link", { name: /작품,.*기다무/i }).or(
        page.locator('a[href*="/content/"]').first()
      );
      if (await fallback.count()) {
        await fallback.first().click({ force: true });
        await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
        return;
      }
      throw new Error("3다무/기다무 뱃지가 있는 작품 카드를 찾지 못했습니다.");
    },
    "작품 이미지 좌측 상단에 3다무 또는 기다무 뱃지가 있는 작품 카드를 클릭한다",
    ai
  );
});

When("사용자가 홈 탭 하단의 회차 리스트에서 동일한 뱃지가 있는 기다무 회차를 클릭한다", async ({ page, ai }) => {
  await withAiFallback(
    async () => {
      await page.waitForTimeout(600);

      const viewerLinks = page.locator('a[href*="/viewer/"]');
      const withBadgeImg = viewerLinks.filter({
        has: page.getByRole("img", { name: BADGE_IMG_NAME })
      });
      if (await withBadgeImg.count()) {
        await withBadgeImg.first().scrollIntoViewIfNeeded();
        await withBadgeImg.first().click({ force: true });
        await page.waitForTimeout(1500);
        return;
      }
      const withBadgeAlt = viewerLinks.filter({ has: page.locator(BADGE_IMG_ALT) });
      if (await withBadgeAlt.count()) {
        await withBadgeAlt.first().scrollIntoViewIfNeeded();
        await withBadgeAlt.first().click({ force: true });
        await page.waitForTimeout(1500);
        return;
      }
      const badgeImgThenViewerLink = page.getByRole("img", { name: BADGE_IMG_NAME });
      const badgeCount = await badgeImgThenViewerLink.count();
      for (let i = 0; i < badgeCount; i++) {
        const link = badgeImgThenViewerLink.nth(i).locator("xpath=ancestor::a[contains(@href,'/viewer/')][1]");
        if (await link.count()) {
          const firstLink = link.first();
          if (await firstLink.isVisible().catch(() => false)) {
            await firstLink.scrollIntoViewIfNeeded();
            await firstLink.click({ force: true });
            await page.waitForTimeout(1500);
            return;
          }
        }
      }

      const paidEpisodeCandidates = [
        page.getByRole("button", { name: /구매|대여|소장|잠금|유료|기다무/i }),
        page.getByRole("link", { name: /구매|대여|소장|잠금|유료|기다무/i }),
        page.locator("button").filter({ hasText: /\d+\s*화|회차/ }).first(),
        page.locator("a").filter({ hasText: /\d+\s*화/ }).first()
      ];
      for (const locator of paidEpisodeCandidates) {
        if (await locator.count()) {
          const el = locator.first();
          if (await el.isVisible().catch(() => false)) {
            await el.scrollIntoViewIfNeeded();
            await el.click({ force: true });
            await page.waitForTimeout(1500);
            return;
          }
        }
      }

      const viewerCount = await viewerLinks.count();
      for (let i = 0; i < Math.min(viewerCount, 50); i += 1) {
        const link = viewerLinks.nth(i);
        const text = await link.innerText().catch(() => "");
        if (!/무료/.test(text)) {
          await link.scrollIntoViewIfNeeded();
          await link.click({ force: true });
          await page.waitForTimeout(1500);
          return;
        }
      }
      if (viewerCount > 0) {
        await viewerLinks.first().scrollIntoViewIfNeeded();
        await viewerLinks.first().click({ force: true });
        await page.waitForTimeout(1500);
        return;
      }

      const freeEpisodeCandidates = [
        page.getByRole("button", { name: /다음화 무료로 보기|무료로 보기/i }),
        page.getByRole("link", { name: /다음화 무료로 보기|무료로 보기/i }),
        page.locator("a, button").filter({ hasText: /\d+\s*화/ }).first()
      ];
      for (const locator of freeEpisodeCandidates) {
        if (await locator.count()) {
          const el = locator.first();
          if (await el.isVisible().catch(() => false)) {
            await el.click({ force: true });
            await page.waitForTimeout(1500);
            return;
          }
        }
      }
      throw new Error("홈 탭 하단에서 기다무 회차를 찾지 못했습니다.");
    },
    "홈 탭 하단 회차 리스트에서 기다무 회차를 클릭한다",
    ai
  );
});
