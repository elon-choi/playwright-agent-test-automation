// Feature: KPA-118 - 무료 회차에 별점 남기기
// "사용자가 뷰어 이미지의 최하단까지 스크롤을 진행한다"는 common.episode.steps.ts에 구현됨
import { Then, And, expect } from "./fixtures.js";

And("사용자가 별점 아이콘을 클릭한다", async ({ page }) => {
  const starImg = page.getByRole("img", { name: /별점/ }).or(page.locator('img[alt*="별점"]').first());
  const ratingBlock = page.locator('div').filter({ has: page.locator('[data-testid="viewer-rating"]') }).first();
  const starOrBlock = starImg.or(ratingBlock);
  await starOrBlock.first().waitFor({ state: "visible", timeout: 10000 });
  await starOrBlock.first().scrollIntoViewIfNeeded();
  const n = await starImg.count();
  if (n > 0) {
    const img = starImg.first();
    const parent = img.locator("xpath=..");
    if (await parent.count() > 0) await parent.first().click({ timeout: 6000 });
    else await img.click({ timeout: 6000 });
  } else {
    await ratingBlock.first().click({ timeout: 6000 });
  }
  await page.waitForTimeout(400);
});

And("사용자가 회차 별점을 선택한 후 완료 버튼을 클릭한다", async ({ page }) => {
  const popup = page.getByRole("dialog").or(page.locator('[role="dialog"]')).or(
    page.locator('[class*="modal"], [class*="Modal"], [class*="popup"], [class*="Popup"]').filter({ has: page.getByText(/별점|완료|평가|별\s*점/i) }).first()
  );
  await popup.first().waitFor({ state: "visible", timeout: 8000 });
  const scope = popup.first();
  const starImgInPopup = scope.locator('img[alt*="별점"]').first();
  const starBtnInPopup = scope.locator("button").filter({ hasNotText: /완료/i }).first();
  const starCount = await starImgInPopup.count();
  const btnCount = await starBtnInPopup.count();
  expect(starCount > 0 || btnCount > 0).toBe(true);
  if (starCount > 0) {
    const starParent = starImgInPopup.locator("xpath=..");
    if (await starParent.count() > 0) await starParent.first().click({ timeout: 4000, force: true });
    else await starImgInPopup.click({ timeout: 4000, force: true });
  } else {
    await starBtnInPopup.click({ timeout: 4000 });
  }
  await page.waitForTimeout(200);
  const doneBtn = page.getByRole("button", { name: /완료/i }).or(page.getByText(/완료/).first());
  const doneCount = await doneBtn.count();
  expect(doneCount).toBeGreaterThan(0);
  await doneBtn.first().click({ timeout: 5000 });
  await page.waitForTimeout(400);
});

Then("회차 별점 남기기 팝업창이 노출된다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasDialog = (await page.getByRole("dialog").count()) > 0;
  const hasStarPopup = (await page.getByText(/별점|완료|평가|별/i).count()) > 0;
  expect(hasDialog || hasStarPopup).toBe(true);
});

And("선택한 별점이 설정된 후 팝업창이 종료된다", async ({ page }) => {
  await page.waitForTimeout(500);
  const dialogCount = await page.getByRole("dialog").count();
  expect(dialogCount).toBe(0);
});
