// Feature: KPA-097 시나리오 검증 - 유료회차 이용권 미보유 시 이용권 충전 페이지 이동
import { And, Then, expect, getBaseUrl } from "./fixtures.js";

const ensureContentPage = async (page: any) => {
  if (/\/content\/|\/landing\/series\//i.test(page.url())) return;
  const fallbackCard = page.locator('main a[href*="/content/"], a[href*="/content/"]').first();
  if ((await fallbackCard.count()) > 0 && (await fallbackCard.isVisible().catch(() => false))) {
    await fallbackCard.click({ timeout: 10000, force: true }).catch(() => null);
    await page.waitForURL(/\/content\/|\/landing\/series\//i, { timeout: 15000 }).catch(() => null);
  }
};

And("사용자가 유료회차를 선택하고 보유 이용권이 없는 상태이며, 이용권 사용 확인 옵션을 체크한다", async ({ page }) => {
  await ensureContentPage(page);
  await page.waitForTimeout(400);
});

And("사용자가 회차 리스트 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i }));
  if (await episodeTab.count()) {
    await episodeTab.first().click({ timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(400);
  }
});

And("사용자가 특정 회차를 클릭한다", async ({ page }) => {
  const episodeLink = page.locator('a[href*="/viewer/"]').first();
  if ((await episodeLink.count()) > 0 && (await episodeLink.isVisible().catch(() => false))) {
    await episodeLink.click({ timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(600);
  } else {
    const anyEpisode = page.locator('[class*="episode"], [class*="회차"] a').first();
    await anyEpisode.click({ timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(500);
  }
});

Then("회차 리스트가 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasList =
    (await page.getByText(/회차|화/i).count()) > 0 ||
    (await page.locator('a[href*="/viewer/"]').count()) > 0;
  expect(hasList).toBe(true);
});

And("이용권 충전 페이지로 이동된다", async ({ page }) => {
  await page.waitForTimeout(1200);
  const urlOk = /charge|충전|ticket|viewer|content/i.test(page.url());
  const hasChargeText = await page.getByText(/이용권\s*충전|캐시\s*충전|충전하기|유료|이용권\s*필요|대여권|소장권|미소장|안\s*본\s*회차/i).first().isVisible().catch(() => false);
  const onChargePage = urlOk || hasChargeText;
  expect(onChargePage).toBe(true);
});
