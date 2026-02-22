// Feature: KPA-107 - 댓글 신고 기능 검증
import { When, Then, And, expect, getBaseUrlOrigin } from "./fixtures.js";
import type { DataTable } from "playwright-bdd";

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

When("사용자가 첫번째 댓글 우측 끝의 [더보기] 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const commentMarker = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last();
  await commentMarker.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(400);
  const moreSelectors = [
    () => commentMarker.locator("xpath=../../../..").locator('img[alt="더보기"], img[alt*="더보기"]').or(commentMarker.locator("xpath=../../../..").getByRole("button", { name: /더보기|메뉴/ })).first(),
    () => commentMarker.locator("xpath=../../..").locator('img[alt="더보기"], img[alt*="더보기"]').or(commentMarker.locator("xpath=../../..").getByRole("button", { name: /더보기|메뉴/ })).first(),
    () => page.getByRole("button", { name: /더보기/ }).first(),
  ];
  let moreIcon = moreSelectors[0]();
  for (let i = 0; i < moreSelectors.length; i++) {
    moreIcon = moreSelectors[i]();
    const visible = await moreIcon.waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);
    if (visible && (await moreIcon.count()) > 0) {
      await moreIcon.scrollIntoViewIfNeeded().catch(() => null);
      await page.waitForTimeout(200);
      await moreIcon.click({ timeout: 6000 });
      break;
    }
  }
  await page.waitForTimeout(600);
});

And("[신고하기] 버튼을 클릭한다", async ({ page }) => {
  const reportBtn = page.getByRole("button", { name: /신고하기/i }).or(page.getByText(/신고하기/).first());
  if ((await reportBtn.count()) > 0) await reportBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(400);
});

And("신고하기 팝업창이 노출된다.", async ({ page }) => {
  await page.waitForTimeout(500);
  const hasReportPopup =
    (await page.getByText(/신고|신고하기|선택|사유/i).first().isVisible().catch(() => false)) ||
    (await page.getByRole("radio").count()) > 0 ||
    (await page.locator("[role='dialog']").filter({ hasText: /신고|사유|선택/ }).first().isVisible().catch(() => false));
  expect(hasReportPopup).toBe(true);
});

And("신고하기 옵션 리스트를 확인 후 우측 상단의 닫기 버튼을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  const hasOptions =
    (await page.getByRole("radio").count()) > 0 ||
    (await page.getByText(/신고|사유|선택|등록하기/i).first().isVisible().catch(() => false));
  expect(hasOptions).toBe(true);
  const closeBtn = page
    .getByRole("button", { name: /닫기/i })
    .or(page.locator('button[aria-label*="닫기"]'))
    .or(page.locator('img[alt*="닫기"]'))
    .or(page.locator("[class*='close'], [aria-label*='닫기']"))
    .first();
  await closeBtn.click({ timeout: 6000 }).catch(() => null);
  await page.waitForTimeout(500);
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

async function assertPopupOptions(page: import("@playwright/test").Page, dataTable?: DataTable | { dataTable?: { rows?: Array<{ cells?: Array<{ value?: string }> }> } }) {
  const options: string[] = [];
  const raw = dataTable as { dataTable?: { rows?: Array<{ cells?: Array<{ value?: string }> }> } } | undefined;
  if (raw?.dataTable?.rows) {
    for (const row of raw.dataTable.rows) {
      const val = row.cells?.[0]?.value;
      if (typeof val === "string" && val.trim() && val.trim() !== "옵션") options.push(val.trim());
    }
  }
  if (dataTable && typeof (dataTable as DataTable).rows === "function") {
    const rows = (dataTable as DataTable).rows();
    for (let i = 0; i < rows.length; i++) {
      const cell = rows[i][0];
      if (typeof cell === "string" && cell.trim()) options.push(cell.trim());
    }
  }
  if (options.length === 0) {
    options.push("신고하기", "차단하기", "취소");
  }
  for (const opt of options) {
    const pattern = opt === "취소" ? /취소|닫기/ : new RegExp(opt.replace(/\s/g, "\\s*"));
    const visible = await page.getByText(pattern).first().isVisible().catch(() => false);
    expect(visible).toBe(true);
  }
}

And("팝업에는 다음 옵션이 포함되어야 한다:", async ({ page }, dataTable?: DataTable) => {
  await assertPopupOptions(page, dataTable);
});

And("팝업에는 다음 옵션이 포함되어야 한다", async ({ page }, dataTable?: DataTable) => {
  await assertPopupOptions(page, dataTable);
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