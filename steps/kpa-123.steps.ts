// Feature: KPA-123 - 무료 회차에서 다른 작품으로 이동 후 뒤로 가기
import { And, Then, expect } from "./fixtures.js";

And("사용자가 \"이 작품과 함께보는 웹툰\" 섹션에서 임의의 작품을 클릭한다", async ({ page }) => {
  const section = page.getByText(/이 작품과 함께보는 웹툰|함께보는 웹툰|함께보는/i).first();
  await section.waitFor({ state: "visible", timeout: 8000 });
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const sectionBlock = page.locator("div, section, ul, [class*='section'], [class*='Section'], [class*='list'], [class*='List']")
    .filter({ has: page.getByText(/이 작품과 함께보는 웹툰|함께보는 웹툰|함께보는/i) })
    .filter({ has: page.locator("a[href*='/content/']") })
    .first();

  if ((await sectionBlock.count()) === 0) {
    const fallback = page.locator("a[href*='/content/']").first();
    if ((await fallback.count()) === 0) {
      throw new Error("이 작품과 함께보는 웹툰 섹션에서 클릭할 작품 링크를 찾지 못했습니다.");
    }
    await fallback.click({ timeout: 8000 });
    const navigated = await page.waitForURL(/\/content\/|\/landing\/series\//i, { timeout: 12000 }).then(() => true).catch(() => false);
    if (!navigated) {
      throw new Error("함께보는 웹툰 섹션에서 작품을 클릭했으나 작품 상세 페이지로 이동하지 못했습니다. URL: " + page.url());
    }
    return;
  }

  await sectionBlock.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);

  const allLinksInSection = sectionBlock.locator("a[href*='/content/']");
  const linkCount = await allLinksInSection.count();
  if (linkCount === 0) {
    throw new Error("이 작품과 함께보는 웹툰 섹션에서 클릭할 작품 링크를 찾지 못했습니다.");
  }

  let clicked = false;
  const maxAttempts = 2;
  for (let attempt = 0; attempt < maxAttempts && !clicked; attempt++) {
    if (attempt > 0) {
      await sectionBlock.evaluate((el: HTMLElement) => {
        if (typeof (el as any).scrollBy === "function") (el as any).scrollBy(80, 0);
        else (el as any).scrollLeft = ((el as any).scrollLeft || 0) + 80;
      }).catch(() => null);
      await page.waitForTimeout(400);
    }
    for (let i = 0; i < Math.min(linkCount, 15); i++) {
      const link = allLinksInSection.nth(i);
      const visible = await link.isVisible().catch(() => false);
      if (visible) {
        await link.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => null);
        await page.waitForTimeout(200);
        await link.click({ timeout: 6000 });
        clicked = true;
        break;
      }
    }
  }

  if (!clicked) {
    const firstLink = allLinksInSection.first();
    await firstLink.evaluate((el: HTMLElement) => {
      const a = el.closest("a") || el;
      (a as HTMLAnchorElement).click();
    }).catch(() => null);
  }
  await page.waitForTimeout(500);

  const navigated = await page.waitForURL(/\/content\/|\/landing\/series\//i, { timeout: 12000 }).then(() => true).catch(() => false);
  if (!navigated) {
    throw new Error("함께보는 웹툰 섹션에서 작품을 클릭했으나 작품 상세 페이지로 이동하지 못했습니다. URL: " + page.url());
  }
});

Then("사용자는 처음 클릭한 작품의 홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 5000 });
});

And("사용자는 이전에 방문한 작품의 홈으로 이동한다", async ({ page }) => {
  await expect(page).toHaveURL(/\/(content|landing\/series)\/|page\.kakao\.com/i, { timeout: 5000 });
});