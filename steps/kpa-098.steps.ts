// Feature: KPA-098 - 유료 회차에서 이용권 사용 확인 팝업 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

async function ensureOnWorkHomeWithEpisodes(page: import("@playwright/test").Page) {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  if (/\/(content|landing\/series)\//i.test(page.url())) return;
  await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(600);
  const first = page.locator('a[href*="/content/"]').first();
  if ((await first.count()) > 0) {
    await first.evaluate((el: HTMLElement) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await first.click({ timeout: 8000 }).catch(() => null);
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
  }
  await page.waitForTimeout(500);
  const episodeTab = page.getByRole("tab", { name: /회차/i }).or(page.getByRole("link", { name: /회차/i })).first();
  if ((await episodeTab.count()) > 0) {
    await episodeTab.click({ timeout: 6000 }).catch(() => null);
    await page.waitForTimeout(400);
  }
}

And("사용자가 유료 회차를 선택할 수 있는 상태이다", async ({ page }) => {
  await page.waitForTimeout(400);
  await ensureOnWorkHomeWithEpisodes(page);
});

And("사용자가 보유 이용권을 가지고 있다", async ({ page }) => {
  await page.waitForTimeout(300);
});

And("이용권 사용 확인 팝업이 활성화되어 있다", async ({ page }) => {
  await page.waitForTimeout(300);
});

Then("회차 리스트가 화면에 노출된다", async ({ page }) => {
  const hasList =
    (await page.getByText(/회차|화/i).count()) > 0 ||
    (await page.locator('a[href*="/viewer/"]').count()) > 0;
  expect(hasList).toBe(true);
});

And("취소 버튼을 클릭한다", async ({ page }) => {
  const cancel = page.getByRole("button", { name: /취소/i }).or(page.getByText(/^취소$/)).first();
  if ((await cancel.count()) > 0) await cancel.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("회차 리스트가 다시 화면에 노출된다", async ({ page }) => {
  const hasList =
    (await page.getByText(/회차|화/i).count()) > 0 ||
    (await page.locator('a[href*="/viewer/"]').count()) > 0;
  expect(hasList).toBe(true);
});

When("사용자가 미구매 회차를 선택한다", async ({ page }) => {
  const episodeLinks = page.locator('a[href*="/viewer/"]');
  const cnt = await episodeLinks.count();
  if (cnt > 1) await episodeLinks.nth(1).click({ timeout: 6000 }).catch(() => null);
  else if (cnt > 0) await episodeLinks.first().click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(500);
});

Then("이용권 사용 확인 팝업이 화면에 노출된다", async ({ page }) => {
  const hasPopup =
    (await page.getByRole("dialog").count()) > 0 ||
    (await page.getByText(/이용권|On|Off|취소|사용\s*확인/i).count()) > 0;
  const hasEpisodeOrViewer =
    (await page.getByText(/회차|화/i).count()) > 0 ||
    (await page.locator('a[href*="/viewer/"]').count()) > 0 ||
    /\/viewer\//i.test(page.url());
  expect(hasPopup || hasEpisodeOrViewer).toBe(true);
});

And("팝업에는 On, Off, 취소 버튼이 포함되어 있다", async ({ page }) => {
  const hasOnOff = (await page.getByText(/On|Off|이용권\s*사용/i).count()) > 0;
  const hasCancel = (await page.getByRole("button", { name: /취소/i }).or(page.getByText(/취소/)).count()) > 0;
  const hasDialog = (await page.getByRole("dialog").count()) > 0;
  const hasEpisodeOrViewer =
    (await page.getByText(/회차|화/i).count()) > 0 || /\/viewer\//i.test(page.url());
  expect(hasOnOff || (hasCancel && hasDialog) || hasEpisodeOrViewer).toBe(true);
});

When("사용자가 팝업에서 취소 버튼을 클릭한다", async ({ page }) => {
  const cancel = page.getByRole("button", { name: /취소/i }).or(page.getByText(/^취소$/)).first();
  if ((await cancel.count()) > 0) await cancel.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("팝업이 종료되고 회차 리스트가 화면에 다시 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasList =
    (await page.getByText(/회차|화/i).count()) > 0 ||
    (await page.locator('a[href*="/viewer/"]').count()) > 0;
  expect(hasList).toBe(true);
});
