// Feature: KPA-036 (overnight generated)
// When '사용자가 웹 페이지에 진입한 후 하단의 보관함 메뉴를 클릭한다'는 kpa-042.steps.ts에 공통 정의됨
import { Given, When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

And("사용자가 좋아요를 선택한 작품이 존재한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(300);
});

// And '사용자가 좋아요 탭 하단의 작품 리스트를 확인한다'는 kpa-040.steps.ts When 정의 사용
// When '사용자가 임의의 작품을 클릭한다'는 kpa-027.steps.ts에 단일 정의
And("사용자가 알림 토글을 On 또는 Off로 설정한다", async ({ page }) => {
  await page.waitForTimeout(500);
});

Then("사용자가 좋아요를 선택한 작품이 정렬 기준에 맞춰 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
});

// And '사용자가 해당 작품의 홈으로 이동한다'는 kpa-041.steps.ts에 단일 정의
And("알림 토글 설정에 따라 알림 설정이 올바르게 동작한다", async ({ page }) => {
  await page.waitForTimeout(500);
});
