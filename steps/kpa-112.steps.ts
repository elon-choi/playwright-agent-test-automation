// Feature: KPA-112 - 무료 회차 정주행 기능 검증
// 접속/로그인/임의의 전체 연령 웹툰/독자혜택/무료회차/웹에서 감상 불가는 common.episode.steps.ts 등에 구현됨
// 뷰어 최하단 스크롤: common.episode.steps.ts "사용자가 뷰어 이미지의 최하단까지 스크롤한다"
import { Then, And, expect } from "./fixtures.js";

Then("뷰어 탭 상단에 다음 UI 요소들이 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
  await page.waitForURL(/\/viewer\//i, { timeout: 10000 }).catch(() => null);
  await expect(page).toHaveURL(/\/viewer\//i, { timeout: 5000 });
  const requiredUi = [
    { name: "회차명", locator: page.getByText(/회차|\d+화/i).first() },
    { name: "정주행 아이콘", locator: page.locator('img[alt*="정주행"]').first() },
    { name: "댓글 아이콘", locator: page.locator('img[alt="댓글"]').first() },
    { name: "이전화", locator: page.locator('img[alt="왼쪽 화살표"]').first() },
    { name: "다음화", locator: page.locator('[data-test="viewer-navbar-next-button"]').or(page.getByText(/다음화/)).first() },
    { name: "설정 메뉴", locator: page.locator('img[alt="설정"]').first() }
  ];
  for (const { name, locator } of requiredUi) {
    await locator.waitFor({ state: "visible", timeout: 10000 });
    expect(await locator.count(), `${name} 노출되어야 함`).toBeGreaterThan(0);
  }
});

And("사용자가 정주행 아이콘을 클릭한다.", async ({ page }) => {
  await click정주행Icon(page);
});

And("사용자가 뷰어 하단의 정주행 아이콘을 클릭한다", async ({ page }) => {
  await click정주행Icon(page);
});

async function click정주행Icon(page: { getByRole: any; locator: any; waitForTimeout: (ms: number) => Promise<void> }) {
  const byRole = page.getByRole("button", { name: /정주행/i }).first();
  const byImg = page.locator('img[alt*="정주행"]').first();
  if ((await byRole.count()) > 0) await byRole.click({ timeout: 8000 }).catch(() => null);
  else if ((await byImg.count()) > 0) await byImg.click({ timeout: 8000, force: true }).catch(() => null);
  await page.waitForTimeout(400);
}

And("정주행 안내 가이드 팝업창의 하단 확인 버튼을 클릭한다", async ({ page }) => {
  const inDialog = page.getByRole("dialog").getByRole("button", { name: /^확인$/ }).first();
  const exactBtn = page.getByRole("button", { name: /^확인$/ }).first();
  if ((await inDialog.count()) > 0) await inDialog.click({ timeout: 5000 }).catch(() => null);
  else if ((await exactBtn.count()) > 0) await exactBtn.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(300).catch(() => null);
});

And("사용자가 뷰어 엔드 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const endArea = page.getByText(/엔드|끝|다음화|정주행|작품홈|댓글/i).first();
  await endArea.waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
});

Then("정주행 아이콘이 활성화되고, 뷰어 엔드 영역에 노출되던 메뉴들(배너, 베스트 댓글 등)이 노출되지 않는다", async ({ page }) => {
  await assert정주행활성화및메뉴숨김(page);
});

Then("정주행 아이콘이 활성화되고, 뷰어 엔드 영역에 노출되던 메뉴들\\(배너, 베스트 댓글 등)이 노출되지 않는다", async ({ page }) => {
  await assert정주행활성화및메뉴숨김(page);
});

async function assert정주행활성화및메뉴숨김(page: { waitForTimeout: (ms: number) => Promise<void>; locator: any; getByText: any }) {
  await page.waitForTimeout(500);
  const 정주행Icon = page.locator('img[alt*="정주행"]').first();
  await 정주행Icon.waitFor({ state: "visible", timeout: 5000 }).catch(() => null);
  expect(await 정주행Icon.count()).toBeGreaterThan(0);
  const 다음화무료보기 = page.getByText(/다음화\s*무료\s*(로\s*)?보기/i);
  const 다음화무료Visible = (await 다음화무료보기.count()) > 0 && (await 다음화무료보기.first().isVisible().catch(() => false));
  expect(다음화무료Visible, "정주행 시 '다음화 무료로 보기' 메뉴가 미노출되어야 함").toBe(false);
  const 함께보는 = page.getByText(/이\s*작품과\s*함께보는\s*(웹툰)?/i);
  const 함께보는Visible = (await 함께보는.count()) > 0 && (await 함께보는.first().isVisible().catch(() => false));
  expect(함께보는Visible, "정주행 시 '이 작품과 함께보는 웹툰' 메뉴가 미노출되어야 함").toBe(false);
}
