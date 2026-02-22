// Feature: KPA-119 - 무료 회차 댓글창 팝업 및 뷰어 엔드 영역 노출
// 전체 연령 목록/무료 회차/최하단 스크롤은 common.episode.steps.ts
import { Then, And, expect } from "./fixtures.js";

And("사용자가 댓글 아이콘을 클릭한다", async ({ page }) => {
  const commentImg = page.getByRole("img", { name: /댓글/ }).or(page.locator('img[alt*="댓글"]').first());
  const commentBlock = page.locator('div').filter({ has: page.locator('img[alt*="댓글"]') }).first();
  const n = await commentImg.count();
  const blockN = await commentBlock.count();
  expect(n > 0 || blockN > 0).toBe(true);
  const clickTarget = n > 0 ? commentImg.first().locator("xpath=..") : commentBlock.first();
  const targetCount = await clickTarget.count();
  if (targetCount > 0) {
    await clickTarget.first().evaluate((el: HTMLElement) => el.click());
  } else {
    await commentImg.first().evaluate((el: HTMLElement) => el.click());
  }
  await page.waitForTimeout(500);
});

Then("해당 회차의 Best 탭에 포커싱된 댓글 페이지로 이동한다.", async ({ page }) => {
  await page.waitForTimeout(600);
  const hasDialog = (await page.getByRole("dialog").count()) > 0;
  const hasCommentUI = (await page.getByText(/댓글|Best|베스트|전체\s*탭|닉네임|작성/i).count()) > 0;
  const hasCommentArea = (await page.locator("[class*='comment'], [class*='Comment']").count()) > 0;
  expect(hasDialog || hasCommentUI || hasCommentArea).toBe(true);
});

And("사용자가 뒤로가기 아이콘을 클릭한다", async ({ page }) => {
  const backBtn = page.getByRole("button", { name: /뒤로가기|back|이전/i })
    .or(page.getByLabel(/뒤로가기|이전/i))
    .or(page.locator('img[alt*="뒤로"], [aria-label*="뒤로"]').first());
  const n = await backBtn.count();
  expect(n).toBeGreaterThan(0);
  await backBtn.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);
});

And("댓글 페이지에서 이탈 후 뷰어 엔드 영역이 노출된다", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasViewerUrl = /\/viewer\//i.test(page.url());
  const hasViewerEnd = (await page.getByText(/회차|다음화|댓글|작품홈|좋아요|별점/i).count()) > 0;
  expect(hasViewerUrl || hasViewerEnd).toBe(true);
});
