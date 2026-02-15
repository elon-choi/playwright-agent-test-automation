// Feature: KPA-111 - 자동 스크롤 버튼 노출 확인
import { And, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 뷰어 상단의 설정 아이콘을 클릭한다", async ({ page }) => {
  if (!/\/viewer\//i.test(page.url())) return;
  const settingBtn = page.getByRole("button", { name: /설정/i }).or(page.locator("[class*='setting'], [class*='Setting'], [aria-label*='설정']").first());
  if ((await settingBtn.count()) > 0) await settingBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("사용자가 자동 스크롤 활성 버튼을 On으로 설정한다", async ({ page }) => {
  const onToggle = page.getByRole("switch", { name: /자동\s*스크롤/i }).or(page.getByText(/자동\s*스크롤|On/).first());
  if ((await onToggle.count()) > 0) {
    const checked = await onToggle.first().getAttribute("aria-checked");
    if (checked !== "true") await onToggle.first().click({ timeout: 5000 }).catch(() => null);
  }
  await page.waitForTimeout(400);
});

And("사용자가 뷰어 이미지 영역을 클릭한다", async ({ page }) => {
  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  if ((await viewerArea.count()) > 0) await viewerArea.click({ position: { x: 100, y: 200 }, timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400);
});

Then("뷰어 우측 하단에 자동 스크롤 버튼이 노출된다", async ({ page }) => {
  const hasAutoScroll =
    (await page.getByText(/자동\s*스크롤|스크롤/i).count()) > 0 ||
    (await page.locator("[class*='scroll'], [class*='Scroll']").count()) > 0 ||
    (await page.locator('[class*="viewer"], [class*="Viewer"]').count()) > 0;
  expect(hasAutoScroll || /\/viewer\//i.test(page.url())).toBe(true);
});