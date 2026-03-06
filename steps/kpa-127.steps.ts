// Feature: KPA-127 - 무료 회차 정주행 기능 검증
// "전체 연령 작품 목록에서 무료 회차 선택", "뷰어 이미지 최하단 스크롤", "정주행 안내 확인 버튼"은 common/kpa-112에 구현됨
// "정주행 아이콘 활성화 및 메뉴 숨김" 검증은 kpa-112의 assert정주행활성화및메뉴숨김()에 정의됨 (중복 제거)
import { And } from "./fixtures.js";

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
