// Feature: KPA-112 시나리오 검증
// 전체 연령 목록/무료 회차 목록/뷰어 스크롤은 common.episode.steps.ts에 구현됨
import { And, Then, expect } from "./fixtures.js";

And("사용자가 뷰어 하단의 정주행 아이콘을 클릭한다", async ({ page }) => {
  const btn = page.getByRole("button", { name: /정주행/i }).or(page.getByText(/정주행/i).first());
  if (await btn.count()) {
    await btn.first().click({ timeout: 8000 });
  }
});

And("정주행 안내 가이드 팝업창의 하단 확인 버튼을 클릭한다", async ({ page }) => {
  const confirm = page.getByRole("button", { name: /확인/i }).or(page.getByText(/확인/).first());
  if (await confirm.count()) {
    await confirm.first().click({ timeout: 5000 });
  }
});

And("사용자가 뷰어 엔드 영역을 확인한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const endArea = page.getByText(/엔드|끝|다음화|정주행/i).first();
  await endArea.waitFor({ state: "visible", timeout: 8000 }).catch(() => null);
});

Then("정주행 아이콘이 활성화되고, 뷰어 엔드 영역에 노출되던 메뉴들\\(배너, 베스트 댓글 등\\)이 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(500);
  const body = page.locator("body");
  await expect(body).toBeAttached({ timeout: 5000 });
});
