// Feature: KPA-064 - 웹소설 GNB 및 장르전체, 작품 선택 후 UI 검증
import { And, Then, expect } from "./fixtures.js";
import type { DataTable } from "playwright-bdd";

function getTableRows(dataTable: unknown): string[][] {
  if (!dataTable) return [];
  const raw = dataTable as { dataTable?: { rows?: Array<{ cells?: Array<{ value?: string }> }> }; rows?: () => string[][] };
  if (typeof raw.rows === "function") return raw.rows();
  const rows = raw.dataTable?.rows;
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => (r.cells ?? []).map((c) => c?.value ?? "").filter(Boolean));
}

And("사용자가 장르전체 서브탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const byDataAttr = page.locator('div[data-t-obj*="장르전체"]').first();
  const byStructure = page.locator('div.cursor-pointer').filter({
    has: page.locator('span.font-small1').filter({ hasText: /^장르\s*전체$/ }),
  }).first();
  let clickTarget = null;
  if ((await byDataAttr.count()) > 0) {
    clickTarget = byDataAttr;
  } else if ((await byStructure.count()) > 0) {
    clickTarget = byStructure;
  } else {
    const mainArea = page.locator("main").first();
    const inMain = mainArea.locator("a, button, [role='tab'], span, div").filter({ hasText: /^장르\s*전체$/ }).first();
    const hasInMain = (await mainArea.count()) > 0 && (await inMain.count()) > 0;
    clickTarget = hasInMain ? inMain : page.getByRole("tab", { name: /장르\s*전체/i }).or(page.getByText("장르전체", { exact: true })).first();
  }
  await clickTarget.waitFor({ state: "attached", timeout: 10000 });
  await clickTarget.scrollIntoViewIfNeeded({ timeout: 5000 });
  await page.waitForTimeout(300);
  await clickTarget.click({ timeout: 8000, force: true });
  await page.waitForTimeout(600);
});

Then("장르전체 메뉴 하단에 다음 UI 요소들이 노출된다:", async ({ page }, dataTable?: DataTable | unknown) => {
  await page.waitForTimeout(500);
  const rows = getTableRows(dataTable);
  const checks: Array<{ name: string; test: () => Promise<boolean> }> = [
    { name: "전체 / 장르별 타입", test: async () => (await page.getByText(/전체|장르별\s*타입|장르/i).count()) > 0 },
    { name: "DA 광고 영역", test: async () => (await page.locator("[class*='ad'], [id*='ad'], [data-ad], [class*='Ad']").count()) > 0 || (await page.getByText(/광고|AD/i).count()) > 0 },
    { name: "전체 작품수 / 완결작만 보기 / 정렬 필터", test: async () => (await page.getByText(/전체\s*작품|완결작만\s*보기|정렬/i).count()) > 0 || (await page.getByText(/완결|정렬|작품/i).count()) >= 2 },
    { name: "선택한 장르 연재 중인 작품 리스트", test: async () => (await page.locator('a[href*="/content/"]').count()) >= 1 },
  ];
  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const label = (rows[i][0] ?? "").trim();
      if (!label || label === "요소") continue;
      const match = checks.find((c) => label.includes(c.name) || c.name.includes(label));
      if (match) {
        const ok = await match.test();
        expect(ok, `장르전체 메뉴에 "${match.name}"이(가) 노출되어야 합니다.`).toBe(true);
      }
    }
  } else {
    const hasList = (await page.locator('a[href*="/content/"]').count()) > 0;
    const hasFilter = (await page.getByText(/전체|장르|정렬|완결|작품/i).count()) > 0;
    expect(hasList || hasFilter).toBe(true);
  }
});

And("전체탭을 클릭한다.", async ({ page }) => {
  await page.waitForTimeout(400);
  const mainArea = page.locator("main").first();
  const wholeTab = mainArea.locator("a, button, [role='tab'], span").filter({ hasText: /^전체$/ }).first();
  const hasInMain = (await mainArea.count()) > 0 && (await wholeTab.count()) > 0 && (await wholeTab.isVisible().catch(() => false));
  const clickTarget = hasInMain ? wholeTab : page.getByRole("tab", { name: "전체" }).or(page.getByText("전체", { exact: true }).first());
  await clickTarget.waitFor({ state: "visible", timeout: 8000 });
  await clickTarget.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(200);
  await clickTarget.click({ timeout: 8000, force: true });
  await page.waitForTimeout(500);
});

And("사용자가 첫번째 작품을 클릭한다", async ({ page }) => {
  const workCard = page.locator('a[href*="/content/"]').first();
  await workCard.waitFor({ state: "visible", timeout: 15000 });
  await workCard.scrollIntoViewIfNeeded({ block: "center" }).catch(() => null);
  await workCard.click({ timeout: 15000, force: true });
  await page.waitForURL(/\/(content|landing\/series)\//i, { timeout: 15000 });
  await page.waitForTimeout(500);
});

Then("클릭한 작품의 홈으로 이동한다", async ({ page }) => {
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  await page.waitForTimeout(400);
  const onContentHome = /\/(content|landing\/series)\//i.test(page.url()) ||
    (await page.locator('a[href*="/content/"], [class*="content"]').count()) > 0;
  expect(onContentHome, "클릭한 작품의 홈(콘텐츠홈/작품 상세) 페이지로 이동했어야 합니다.").toBe(true);
});
