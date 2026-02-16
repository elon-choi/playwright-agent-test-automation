// Feature: KPA-057 (배너 동작 검증 - 책 GNB, 나머지 스텝은 kpa-048 공유)
import { When, getBaseUrlOrigin } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 상단의 책 GNB 메뉴를 클릭한다", async ({ page }) => {
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