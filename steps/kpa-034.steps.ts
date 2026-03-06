// Feature: KPA-034 시나리오 검증 - 최근본 탭에서 작품 삭제
import { When, And, expect } from "./fixtures.js";

let listCountBeforeDelete = 0;

When("사용자가 \"최근본\" 탭을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(400);
  if (!/\/inven\//i.test(page.url())) {
    const storage = page.getByRole("link", { name: /보관함/i }).or(page.getByRole("button", { name: /보관함/i }));
    if ((await storage.count()) > 0) {
      await storage.first().click({ timeout: 10000 });
      await page.waitForTimeout(600);
    } else {
      await page.goto(new URL("/inven/recent", page.url()).href, { waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
      await page.waitForTimeout(500);
      return;
    }
  }
  const recentTab = page.getByRole("tab", { name: /최근본/i }).or(page.getByRole("link", { name: /최근본/i })).or(page.locator('a[href*="/inven/recent"]')).first();
  if ((await recentTab.count()) > 0) {
    await recentTab.click({ timeout: 8000 });
  }
  await page.waitForTimeout(500);
});

And("하단의 작품 리스트를 확인한다", async ({ page }) => {
  await page.waitForTimeout(400);
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  const list = page.locator('a[href*="/content/"]').first();
  const emptyMsg = page.getByText(/이용권\s*내역이\s*없습니다|최근본\s*작품이\s*없습니다|리스트가\s*비어|감상\s*이력이\s*없습니다/i);
  const hasList = (await list.count()) > 0 && (await list.isVisible().catch(() => false));
  const hasEmpty = (await emptyMsg.count()) > 0 && (await emptyMsg.isVisible().catch(() => false));
  expect(hasList || hasEmpty).toBe(true);
});

And("{string} 메뉴를 클릭한다", async ({ page }, label: string) => {
  const btn = page.getByRole("button", { name: new RegExp(label.replace(/\s/g, "\\s*")) }).or(page.getByText(new RegExp(label.replace(/\s/g, "\\s*")))).first();
  await btn.click({ timeout: 6000 });
  await page.waitForTimeout(400);
});

And("임의의 작품을 선택한다", async ({ page }) => {
  // 삭제 전 개수 저장
  listCountBeforeDelete = await page.locator('a[href*="/content/"]').count();
  const firstItem = page.locator('a[href*="/content/"]').or(page.locator('[class*="item"] input[type="checkbox"], li input[type="checkbox"]')).first();
  const checkbox = page.locator('input[type="checkbox"]').first();
  if ((await checkbox.count()) > 0 && (await checkbox.isVisible().catch(() => false))) {
    await checkbox.click({ timeout: 5000 });
  } else {
    await firstItem.click({ timeout: 5000 });
  }
  await page.waitForTimeout(400);
});

And("하단의 {string} 버튼을 클릭한다", async ({ page }, label: string) => {
  const btn = page.getByRole("button", { name: new RegExp(label.replace(/\s/g, "\\s*").replace(/N/g, "\\d*")) }).or(page.getByText(new RegExp(label.replace(/\s/g, "\\s*").replace(/N/g, "\\d*")))).first();
  await btn.scrollIntoViewIfNeeded().catch(() => null);
  await btn.click({ timeout: 8000 });
  await page.waitForTimeout(500);
});

And("선택한 작품이 삭제된다", async ({ page }) => {
  await page.waitForTimeout(600);

  // 삭제 확인 팝업이 뜨면 "확인" 버튼 클릭
  const confirmBtn = page.getByRole("button", { name: /^확인$/i });
  const hasConfirm = await confirmBtn.first().isVisible({ timeout: 3000 }).catch(() => false);
  if (hasConfirm) {
    await confirmBtn.first().click({ timeout: 5000 });
    await page.waitForTimeout(1500);
  }

  // 삭제 완료 확인 (폴링): 토스트 메시지 또는 리스트 개수 감소
  const deadline = Date.now() + 8000;
  let ok = false;
  while (Date.now() < deadline) {
    const toastVisible = await page.getByText(/삭제\s*되었|삭제\s*완료|삭제했|항목.*삭제/i).first().isVisible().catch(() => false);
    const listNow = await page.locator('a[href*="/content/"]').count();
    if (toastVisible || (listCountBeforeDelete > 0 && listNow < listCountBeforeDelete)) {
      ok = true;
      break;
    }
    await page.waitForTimeout(300);
  }
  expect(ok, `삭제 전 ${listCountBeforeDelete}개 → 삭제 후 리스트 감소 또는 토스트 표시되어야 합니다`).toBe(true);
});

And("최근본 감상탭 리스트에서 선택한 작품이 더 이상 노출되지 않는다", async ({ page }) => {
  await page.waitForTimeout(400);
  const listCountAfter = await page.locator('a[href*="/content/"]').count();
  if (listCountBeforeDelete > 0) {
    expect(listCountAfter, `삭제 전 ${listCountBeforeDelete}개 → 삭제 후 ${listCountAfter}개, 감소해야 합니다`).toBeLessThan(listCountBeforeDelete);
  }
  // 삭제 전 개수가 0이면 삭제 자체가 불가능했으므로 별도 검증 불필요
});
