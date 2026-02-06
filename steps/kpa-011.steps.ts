// Feature: KPA-011 시나리오 검증
// Scenario: 비로그인 상태에서 BM 작품 열람 시 로그인 요구 확인
import { Given, When, Then, expect, withAiFallback } from "./fixtures.js";

Given("사용자는 BM 작품을 기다무로 설정한다", async ({ page }) => {
  const bmToggle = page.getByRole("button", { name: /BM|기다무/i });
  if (await bmToggle.count()) {
    await bmToggle.first().click();
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
      throw new Error("작품 카드를 찾지 못했습니다.");
    },
    "기다무 BM 작품 카드 하나를 클릭한다",
    ai
  );
});

When("사용자가 회차탭 하단의 임의의 기다무 회차를 클릭한다", async ({ page, ai }) => {
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
        if (!/무료/.test(text)) {
          await link.click();
          await page.waitForTimeout(500);
          return;
        }
      }
      if (viewerCount > 0) {
        await viewerLinks.first().click();
        await page.waitForTimeout(500);
        return;
      }

      const freeEpisodeCandidates = [
        page.getByRole("button", { name: /다음화 무료로 보기|무료로 보기/i }),
        page.getByRole("link", { name: /다음화 무료로 보기|무료로 보기/i })
      ];
      for (const locator of freeEpisodeCandidates) {
        if (await locator.count()) {
          await locator.first().click();
          await page.waitForTimeout(500);
          return;
        }
      }
      throw new Error("회차 버튼을 찾지 못했습니다.");
    },
    "회차 탭에서 유료 또는 기다무 회차를 클릭한다",
    ai
  );
});
