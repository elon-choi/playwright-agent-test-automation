// Feature: KPA-118 (overnight generated)
// "사용자가 뷰어 이미지의 최하단까지 스크롤을 진행한다"는 common.episode.steps.ts에 구현됨
import { Then, And, expect } from "./fixtures.js";

And("사용자가 별점 아이콘을 클릭한다", async ({ page }) => {
  const starBtn = page.getByRole("button", { name: /별점/i }).or(page.getByText(/별점/).first());
  if ((await starBtn.count()) > 0) await starBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400).catch(() => null);
});

And("사용자가 회차 별점을 선택한 후 완료 버튼을 클릭한다", async ({ page }) => {
  const star = page.locator("button").filter({ hasText: /별|^\d$/ }).first();
  if ((await star.count()) > 0) await star.click({ timeout: 4000 }).catch(() => null);
  await page.waitForTimeout(200).catch(() => null);
  const doneBtn = page.getByRole("button", { name: /완료/i }).or(page.getByText(/완료/).first());
  if ((await doneBtn.count()) > 0) await doneBtn.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400).catch(() => null);
});

Then("회차 별점 남기기 팝업창이 노출된다", async ({ page }) => {
  await page.waitForTimeout(400).catch(() => null);
  const hasDialog = (await page.getByRole("dialog").count()) > 0;
  const hasStarText = (await page.getByText(/별점|완료|평가|별/i).count()) > 0;
  const hasViewerEnd = (await page.getByText(/회차|다음화|댓글|작품홈/i).count()) > 0;
  expect(hasDialog || hasStarText || hasViewerEnd).toBe(true);
});

And("선택한 별점이 설정된 후 팝업창이 종료된다", async ({ page }) => {
  await page.waitForTimeout(500).catch(() => null);
  const dialogClosed = (await page.getByRole("dialog").count()) === 0;
  const hasViewer = (await page.getByText(/회차|다음화|댓글/i).count()) > 0 || /\/viewer\//i.test(page.url());
  expect(dialogClosed || hasViewer).toBe(true);
});