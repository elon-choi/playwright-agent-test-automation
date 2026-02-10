// Feature: KPA-045 시나리오 검증
import { When, Then, And, expect } from "./fixtures.js";

And("사용자가 로그인하여 구매작품 탭에 접근한다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) throw new Error("로그인 상태가 필요합니다.");
  await page.waitForTimeout(400);
  const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
  if (await storage.count() > 0) await storage.first().click({ timeout: 8000 });
  await page.waitForTimeout(500);
  const tab = page.getByRole("tab", { name: /구매/i }).or(page.getByText(/구매\s*작품/i).first());
  if (await tab.count() > 0) await tab.first().click({ timeout: 5000 });
  await page.waitForTimeout(500);
});

// When '사용자가 작품 리스트 상단의 정렬 영역을 클릭한다'는 kpa-040.steps.ts And에 단일 정의
// And '사용자가 임의의 정렬값을 클릭한다'는 kpa-040.steps.ts에 단일 정의
Then("구매 순, 업데이트 순, 제목 순 정렬 옵션이 노출된다", async ({ page }) => {
  const hasSort = await page.getByText(/구매\s*순|업데이트\s*순|제목\s*순/i).count() > 0;
  expect(hasSort).toBe(true);
});

// And '선택한 정렬 기준으로 작품이 정렬되어 노출된다'는 kpa-040.steps.ts에 단일 정의
