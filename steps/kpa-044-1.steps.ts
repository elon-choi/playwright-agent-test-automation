// Feature: KPA-044-1 구매작품 삭제 취소 검증 (테스트 계정 비용 절약용)
import { When, Then, And, expect } from "./fixtures.js";

When("삭제 확인 팝업이 노출되면 취소 버튼을 클릭한다", async ({ page }) => {
  const popupMessage = "선택한 1개 항목을 삭제합니다";
  const popup = page.getByText(popupMessage, { exact: false });
  await popup.waitFor({ state: "visible", timeout: 8000 });
  const cancelBtn = page.getByRole("button", { name: /취소/i });
  await cancelBtn.first().click({ timeout: 5000 });
  await popup.waitFor({ state: "hidden", timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(1000);
});

And("사용자가 편집 화면 하단의 취소 버튼을 클릭한다", async ({ page }) => {
  const bottomCancel = page.getByRole("button", { name: /취소/i });
  await bottomCancel.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});

Then("구매작품 리스트가 그대로 유지된다", async ({ page }) => {
  await page.waitForTimeout(1500);
  const contentLinks = page.locator('a[href*="/content/"]');
  await contentLinks.first().waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
  await expect(contentLinks.first()).toBeVisible({ timeout: 15000 });
  await expect(await contentLinks.count()).toBeGreaterThanOrEqual(1);
});
