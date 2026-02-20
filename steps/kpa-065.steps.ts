// Feature: KPA-065 시나리오 검증
// Scenario: 작품 카드 클릭 후 이미지 확대 및 닫기 기능 검증
import { Given, When, Then, expect } from "./fixtures.js";

When("사용자가 카카오페이지 웹에 접속한다", async ({ page }) => {
  await expect(page).toHaveURL(/page\.kakao\.com/);
});

When("사용자가 임의의 작품 카드를 클릭한다", async ({ page }) => {
  const candidates = [
    page.getByRole("link", { name: /^작품,/ }),
    page.locator('a[href*="/content/"]')
  ];
  for (const locator of candidates) {
    const count = await locator.count();
    if (count > 0) {
      const maxIndex = Math.min(count - 1, 20);
      const index = Math.floor(Math.random() * (maxIndex + 1));
      await locator.nth(index).click();
      await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
      return;
    }
  }
  throw new Error("작품 카드 링크를 찾지 못했습니다.");
});

Then("메인 대표 이미지 영역이 화면에 표시된다", async ({ page }) => {
  const mainImage = page.locator('img[alt*="대표"], img[alt*="작품"], img[alt*="썸네일"]');
  await expect(mainImage.first()).toBeVisible();
});

When("사용자가 대표 이미지를 클릭한다", async ({ page }) => {
  const zoomCandidates = [
    page.getByRole("button", { name: /이미지 크게보기/i }),
    page.getByText(/이미지 크게보기/i),
    page.locator('img[alt*="이미지 크게보기"]')
  ];
  for (const locator of zoomCandidates) {
    if (await locator.count()) {
      await locator.first().click({ force: true });
      return;
    }
  }
  const mainImage = page.locator('img[alt*="대표"], img[alt*="작품"], img[alt*="썸네일"]');
  await mainImage.first().click({ force: true });
});

Then("대표 이미지가 화면 전체 사이즈로 확대된다", async ({ page }) => {
  const overlay = page.locator('[role="dialog"], [aria-modal="true"], .modal, .viewer');
  const closeButton = page.getByRole("button", { name: /닫기|close/i });
  const closeIcon = page.locator('img[alt*="닫기"]');
  if (await overlay.count()) {
    await expect(overlay.first()).toBeVisible();
    return;
  }
  if ((await closeButton.count()) || (await closeIcon.count())) {
    return;
  }
  throw new Error("이미지 확대 레이어를 확인하지 못했습니다.");
});

When("사용자가 확대된 이미지를 닫기 버튼을 클릭한다", async ({ page }) => {
  const closeCandidates = [
    page.getByRole("button", { name: /닫기|close/i }),
    page.locator('[aria-label*="닫기"], [aria-label*="close"]'),
    page.locator('img[alt*="닫기"]')
  ];
  for (const locator of closeCandidates) {
    if (await locator.count()) {
      await locator.first().click();
      return;
    }
  }
  await page.keyboard.press("Escape");
});

Then("이전 화면으로 돌아가고, 대표 섬네일 이미지가 노출된다", async ({ page }) => {
  const mainImage = page.locator('img[alt*="대표"], img[alt*="작품"], img[alt*="썸네일"]');
  await expect(mainImage.first()).toBeVisible();
});
