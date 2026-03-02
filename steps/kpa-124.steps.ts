// Feature: KPA-124 - 무료 회차 클릭 후 뒤로 가기, 뷰어 상단 UI 검증 및 작품홈 회차 리스트 이동
// 시나리오: (웹소설) 로드 오브 머니 작품 상세 접속 → 무료 회차 진입 → KPA-109 뷰어 상단 UI 검증 → 뒤로 가기 → 작품홈 회차 리스트
import { And } from "./fixtures.js";

const KPA_124_WORK_URL = "https://page.kakao.com/content/50171772";

And("사용자가 {string} 작품 상세 페이지에 접속한다", async ({ page }, _workName: string) => {
  await page.goto(KPA_124_WORK_URL, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForURL(/\/content\/50171772(\/|$|\?)/i, { timeout: 10000 });
  await page.waitForTimeout(500);
});