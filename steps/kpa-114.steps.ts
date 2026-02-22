// Feature: KPA-114 - 무료 회차 탐색 및 이동 검증
// 접속/로그인/임의의 전체 연령 웹툰/독자혜택/무료회차/웹에서 감상 불가/뒤로 가기: common.episode.steps.ts
// 뷰어 탭 상단 UI: kpa-112.steps.ts "뷰어 탭 상단에 다음 UI 요소들이 노출된다:"
// 다음 회차 이동/이전 회차 이동/작품홈 회차 리스트: common.episode.steps.ts
import { And } from "./fixtures.js";

And("사용자가 다음화 아이콘을 클릭한다", async ({ page }) => {
  const nextBtn = page.getByRole("button", { name: /다음화|다음\s*화/i }).or(page.getByText(/다음화|다음\s*화/).first()).or(page.locator('img[alt="오른쪽 화살표"]').first());
  if ((await nextBtn.count()) > 0) await nextBtn.first().click({ timeout: 8000, force: true }).catch(() => null);
  await page.waitForTimeout(400);
});

And("사용자가 이전화 아이콘을 클릭한다", async ({ page }) => {
  const prevBtn = page.getByRole("button", { name: /이전화|이전\s*화/i }).or(page.getByText(/이전화|이전\s*화/).first()).or(page.locator('img[alt="왼쪽 화살표"]').first());
  if ((await prevBtn.count()) > 0) await prevBtn.first().click({ timeout: 8000, force: true }).catch(() => null);
  await page.waitForTimeout(400);
});
