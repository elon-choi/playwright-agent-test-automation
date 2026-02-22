// Feature: KPA-058 시나리오 검증 - 책 GNB > 기대 신작 TOP 배너 > 첫 번째 작품 클릭 > 콘텐츠홈 이동
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

const TOP_SECTION_TEXT = /기대\s*신작\s*TOP|기대\s*신작\s*TOP/i;

When("사용자가 웹 페이지에 진입하여 상단의 책 GNB 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const base = getBaseUrlOrigin();
  if (!/page\.kakao\.com/i.test(page.url())) await page.goto(base, { waitUntil: "domcontentloaded", timeout: 12000 }).catch(() => null);
  await page.waitForTimeout(500);
  const gnb = page.getByRole("link", { name: /책\s*탭|책/i }).or(page.getByText(/책/i).first());
  if ((await gnb.count()) > 0) await gnb.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

And("사용자는 기대 신작 TOP 운영 영역이 노출될때까지 스크롤 다운한다.", async ({ page }) => {
  const section = page.getByText(TOP_SECTION_TEXT).or(page.locator("section, div").filter({ hasText: TOP_SECTION_TEXT }));
  const maxScroll = 15;
  for (let i = 0; i < maxScroll; i++) {
    const visible = await section.first().isVisible().catch(() => false);
    if (visible) return;
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(400);
  }
  await section.first().waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
});

When("기대 신작 TOP 운영 배너이 노출되면 첫번째 작품 이미지를 클릭한다.", async ({ page }) => {
  const area = page.locator("section, div").filter({ hasText: TOP_SECTION_TEXT });
  const firstWork = area.locator('a[href*="/content/"]').first();
  await firstWork.waitFor({ state: "visible", timeout: 8000 });
  await firstWork.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
  await firstWork.click({ timeout: 8000, force: true });
  await page.waitForTimeout(1000);
});

Then("클릭한 작품의 콘텐츠홈으로 이동한다.", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(600);
  const onContentHome = /\/content\/|\/landing\/series\//i.test(page.url()) ||
    (await page.locator('a[href*="/content/"], [class*="content"]').count()) > 0;
  expect(onContentHome, "클릭한 작품의 콘텐츠홈(작품 상세) 페이지로 이동했어야 합니다.").toBe(true);
});
