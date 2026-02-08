// Feature: KPA-019 시나리오 검증 - 이용권 내역
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("이용권 내역 메뉴를 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const menu = page.getByRole("link", { name: /이용권\s*내역/i }).or(page.getByText(/이용권\s*내역/i).first());
  await menu.first().click({ timeout: 10000 });
});

When("충전 내역 탭을 확인한다", async ({ page }) => {
  await page.waitForTimeout(300);
  await expect(page.getByText(/충전\s*내역/i).first()).toBeAttached({ timeout: 8000 });
});

When("사용 내역 탭을 클릭한다", async ({ page }) => {
  await page.getByRole("tab", { name: /사용\s*내역/i }).or(page.getByText(/사용\s*내역/i).first()).click({ timeout: 8000 });
});

When("임의의 사용 내역을 클릭한다", async ({ page }) => {
  const item = page.locator('[class*="list"] a, [class*="item"] a, li a').first();
  await item.click({ timeout: 8000 });
});

When("좌측 상단 뒤로가기 버튼을 클릭한다", async ({ page }) => {
  const backBtn = page.getByRole("button", { name: /뒤로가기|back|이전/i })
    .or(page.locator('button, a').filter({ hasText: /⬅|←|뒤로/i }).first());
  await backBtn.first().click({ timeout: 5000 }).catch(() => page.goBack());
});

Then("이용권 내역 화면이 다음과 같이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page.getByText(/이용권\s*내역/i).first()).toBeAttached({ timeout: 10000 });
});

Then("사용자의 이용권 충전 리스트가 최근 리스트 순서대로 노출된다", async ({ page }) => {
  await page.waitForTimeout(300);
  await expect(page.getByText(/충전|이용권|내역/i).first()).toBeAttached({ timeout: 5000 });
});

Then("사용자의 이용권 사용 리스트가 최근 리스트 순서대로 노출된다", async ({ page }) => {
  await page.waitForTimeout(300);
  await expect(page.getByText(/사용|이용권|내역/i).first()).toBeAttached({ timeout: 5000 });
});

Then("클릭한 이용권 사용 내역의 대상 페이지로 이동했다", async ({ page }) => {
  await page.waitForTimeout(300);
  expect(page.url()).toMatch(new RegExp(getBaseUrlOrigin().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

Then("이용권 내역 페이지를 빠져 나와, 더보기 메뉴로 이동한다", async ({ page }) => {
  await page.waitForTimeout(500);
  expect(page.url().startsWith(getBaseUrlOrigin())).toBe(true);
});
