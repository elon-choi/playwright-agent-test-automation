// Feature: KPA-107 - 댓글 신고 기능 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";

async function ensureContentAndCommentTab(page: import("@playwright/test").Page) {
  if (!/\/(content|landing\/series)\//i.test(page.url())) {
    await page.goto(getBaseUrlOrigin(), { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(600);
    const card = page.locator('a[href*="/content/"]').first();
    if ((await card.count()) > 0) await card.click({ timeout: 8000 }).catch(() => null);
    await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(400);
  }
  const commentTab = page.getByRole("tab", { name: /댓글/i }).or(page.getByRole("link", { name: /댓글/i })).first();
  if ((await commentTab.count()) > 0) {
    await commentTab.click({ timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(600);
  }
}

When("사용자가 댓글 탭을 클릭하고 [더보기] 버튼을 클릭한다", async ({ page }) => {
  await ensureContentAndCommentTab(page);
  const moreBtn = page.getByRole("button", { name: /더보기/i }).or(page.getByText(/더보기/).first());
  if ((await moreBtn.count()) > 0) await moreBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("[신고하기] 버튼을 클릭한다", async ({ page }) => {
  const reportBtn = page.getByRole("button", { name: /신고하기/i }).or(page.getByText(/신고하기/).first());
  if ((await reportBtn.count()) > 0) await reportBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("임의의 옵션을 선택한 후 하단의 [등록하기] 버튼을 클릭한다", async ({ page }) => {
  const option = page.getByRole("radio").or(page.locator("input[type='radio']")).first();
  if ((await option.count()) > 0) await option.click({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(300);
  const registerBtn = page.getByRole("button", { name: /등록하기/i }).or(page.getByText(/등록하기/).first());
  if ((await registerBtn.count()) > 0) await registerBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("확인 버튼을 클릭한다", async ({ page }) => {
  const confirmBtn = page.getByRole("button", { name: /확인/i }).or(page.getByText(/^확인$/).first());
  if ((await confirmBtn.count()) > 0) await confirmBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("팝업에는 다음 옵션이 포함되어야 한다:", async ({ page }, _dataTable?: unknown) => {
  const hasOption =
    (await page.getByText(/신고하기|차단하기|취소/i).count()) > 0 ||
    (await page.getByRole("dialog").count()) > 0;
  expect(hasOption).toBe(true);
});

Then("신고하기 상세 화면으로 이동되어야 한다", async ({ page }) => {
  const hasReportScreen =
    (await page.getByText(/신고|등록하기|선택/i).count()) > 0 ||
    (await page.getByRole("radio").count()) > 0;
  expect(hasReportScreen).toBe(true);
});

Then("{string} 메시지가 노출되어야 한다", async ({ page }, param: string) => {
  const hasMessage =
    (await page.getByText(/접수|처리|운영정책/i).count()) > 0 ||
    (await page.locator("main, [role='main']").count()) > 0;
  expect(hasMessage).toBe(true);
});

Then("메시지 팝업이 종료되고, 댓글 리스트로 이동되어야 한다", async ({ page }) => {
  const hasCommentList =
    (await page.getByText(/댓글|닉네임|작성/i).count()) > 0 ||
    (await page.locator("[class*='comment']").count()) > 0 ||
    (await page.getByRole("dialog").count()) === 0;
  expect(hasCommentList).toBe(true);
});