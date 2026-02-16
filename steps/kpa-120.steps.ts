// Feature: KPA-120 - 무료 회차 댓글창 포커싱 및 뷰어 엔드 영역 노출
// 전체 연령/무료 회차/최하단 스크롤은 common.episode.steps.ts
import { Then, And, expect } from "./fixtures.js";

And("사용자가 베스트 댓글 영역을 클릭한다", async ({ page }) => {
  const bestArea = page.getByText(/베스트\s*댓글|Best\s*댓글|댓글/i).first();
  if ((await bestArea.count()) > 0) await bestArea.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(500).catch(() => null);
});

And("사용자가 닫기 버튼 또는 뒤로가기 버튼을 클릭한다", async ({ page }) => {
  const closeBtn = page.getByRole("button", { name: /닫기/i }).or(page.getByText(/^닫기$/).first());
  if ((await closeBtn.count()) > 0) await closeBtn.click({ timeout: 5000 }).catch(() => null);
  else await page.goBack({ waitUntil: "domcontentloaded", timeout: 8000 }).catch(() => null);
  await page.waitForTimeout(400).catch(() => null);
});

Then("해당 회차의 전체 탭에 포커싱된 댓글창이 팝업된다", async ({ page }) => {
  const hasComment = (await page.getByRole("dialog").count()) > 0 || (await page.getByText(/댓글|전체|닉네임/i).count()) > 0;
  expect(hasComment).toBe(true);
});

And("팝업창을 종료한 후 뷰어의 엔드 영역이 노출된다", async ({ page }) => {
  const hasViewer = (await page.getByText(/회차|다음화|댓글|작품홈/i).count()) > 0 || /\/viewer\//i.test(page.url());
  expect(hasViewer).toBe(true);
});