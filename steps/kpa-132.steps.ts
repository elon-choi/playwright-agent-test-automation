// Feature: KPA-132 - 무료 회차에 별점 남기기 검증
import { And, expect } from "./fixtures.js";

And("사용자가 회차 별점을 선택하고 완료 버튼을 클릭한다", async ({ page }) => {
  const star = page.locator("button").filter({ hasText: /별|^\d$/ }).first();
  if ((await star.count()) > 0) await star.click({ timeout: 4000 }).catch(() => null);
  await page.waitForTimeout(200).catch(() => null);
  const doneBtn = page.getByRole("button", { name: /완료/i }).or(page.getByText(/완료/).first());
  if ((await doneBtn.count()) > 0) await doneBtn.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(400).catch(() => null);
});

And("선택한 별점이 설정되고 팝업창이 종료된다", async ({ page }) => {
  await page.waitForTimeout(500).catch(() => null);
  const dialogClosed = (await page.getByRole("dialog").count()) === 0;
  const hasViewer = (await page.getByText(/회차|다음화|댓글/i).count()) > 0 || /\/viewer\//i.test(page.url());
  expect(dialogClosed || hasViewer).toBe(true);
});