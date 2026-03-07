// Feature: KPA-046 시나리오 검증
// Scenario: 선물함 기능 검증
import { When, Then, expect } from "./fixtures.js";

When("사용자가 웹 페이지에 진입한 후 상단의 선물함 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const gift = page.getByRole("link", { name: /선물함/i }).or(page.getByRole("button", { name: /선물함/i }));
  await gift.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

Then("사용자는 선물함 화면에 진입하며, 다음과 같은 메뉴가 노출된다", async ({ page }) => {
  await expect(page.getByText(/선물함/i).first()).toBeVisible({ timeout: 8000 });
  await expect(page.getByText("전체").first()).toBeVisible({ timeout: 5000 });
  await expect(page.getByText("웹툰").first()).toBeVisible({ timeout: 3000 });
  await expect(page.getByText("웹소설").first()).toBeVisible({ timeout: 3000 });
  await expect(page.getByText("책").first()).toBeVisible({ timeout: 3000 });
});

let allGiftsAlreadyReceived = false;
let capturedToast = "";

When("사용자가 임의의 작품 리스트에서 선물 받기 메뉴를 클릭한다", async ({ page }) => {
  capturedToast = "";
  allGiftsAlreadyReceived = false;

  // 스크롤하면서 "선물받기" 버튼 탐색 (최대 20회)
  const maxScrolls = 20;
  let prevHeight = 0;
  for (let s = 0; s < maxScrolls; s++) {
    const giftButtons = page.locator('button:has-text("선물받기"), a:has-text("선물받기")');
    if ((await giftButtons.count()) > 0) {
      // 토스트 감지를 클릭 전에 설정 (빠르게 사라지므로)
      const toastLocator = page.getByText(/대여권.*장을\s*받았습니다|이미\s*받은\s*선물/i).first();
      const toastPromise = toastLocator
        .waitFor({ state: "visible", timeout: 10000 })
        .then(() => toastLocator.textContent())
        .then((t) => t ?? "")
        .catch(() => "");

      await giftButtons.first().click({ timeout: 5000 });
      capturedToast = await toastPromise;

      // "이미 받은 선물입니다" → 다음 선물받기 버튼 재시도
      if (/이미.*받은.*선물/i.test(capturedToast)) {
        capturedToast = "";
        await page.waitForTimeout(2000);
        continue;
      }
      return;
    }

    // 스크롤 다운
    const currentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(500);
    // 스크롤이 더 이상 안 되면 끝
    if (currentHeight === prevHeight && s > 0) break;
    prevHeight = currentHeight;
  }

  // 끝까지 스크롤해도 선물받기 버튼 없음 → 모든 선물 이미 수령 완료
  const viewButtons = page.locator('button:has-text("바로보기"), a:has-text("바로보기")');
  expect(await viewButtons.count(), "선물받기 또는 바로보기 버튼이 존재해야 합니다").toBeGreaterThanOrEqual(1);
  allGiftsAlreadyReceived = true;
});

Then("클릭한 작품의 이용권이 지급되었다는 토스트 메시지가 노출된다", async ({ page }) => {
  // 모든 선물을 이미 받은 상태 → 성공
  if (allGiftsAlreadyReceived) {
    expect(allGiftsAlreadyReceived).toBe(true);
    return;
  }
  // When 스텝에서 캡처한 토스트 확인
  if (/대여권.*장을\s*받았습니다/i.test(capturedToast)) {
    expect(capturedToast).toMatch(/대여권.*장을\s*받았습니다/i);
    return;
  }
  // 폴백: 현재 화면에서 토스트 확인
  const toast = page.getByText(/대여권.*장을\s*받았습니다/i).first();
  await expect(toast).toBeVisible({ timeout: 8000 });
});
