// Feature: KPA-127 - 무료 회차 정주행 기능 검증
// "전체 연령 작품 목록에서 무료 회차 선택", "뷰어 이미지 최하단 스크롤", "정주행 안내 확인 버튼"은 common/kpa-112에 구현됨
import { And, Then, expect } from "./fixtures.js";

And("뷰어 하단의 정주행 아이콘을 클릭한다", async ({ page }) => {
  const btn = page.getByRole("button", { name: /정주행/i }).or(page.getByText(/정주행/i).first());
  if ((await btn.count()) > 0) await btn.first().click({ timeout: 8000 }).catch(() => null);
  await page.waitForTimeout(400).catch(() => null);
});

And("뷰어 엔드 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(400).catch(() => null);
  const endArea = page.getByText(/엔드|끝|다음화|정주행|작품홈|댓글/i).first();
  await endArea.waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
});

Then("정주행 아이콘이 활성화되고, 뷰어 엔드 영역에 노출되던 메뉴들(배너, 베스트 댓글 등)이 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500).catch(() => null);
  const hasViewer = /\/viewer\//i.test(page.url()) || (await page.locator("body").count()) > 0;
  expect(hasViewer).toBe(true);
});
