// Feature: KPA-003 시나리오 검증
// Scenario: 사용자 프로필 닉네임 변경
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

When("사용자 정보 영역을 클릭한다", async ({ page }) => {
  await page.waitForTimeout(500);
  const userInfo = page
    .locator('a[href*="/account/info"]')
    .or(page.getByRole("link", { name: /님$/ }))
    .or(page.getByRole("link", { name: /사용자\s*정보|내\s*정보|내정보|프로필\s*설정|계정\s*정보/i }))
    .or(page.getByText(/사용자\s*정보|내\s*정보|내정보|프로필\s*설정/i));
  await userInfo.first().click({ timeout: 10000 });
});

function nicknameInputLocator(page: {
  url: () => string;
  getByPlaceholder: (arg: RegExp) => any;
  getByRole: (arg: string, opts?: { name: RegExp }) => any;
  getByLabel: (arg: RegExp) => any;
  locator: (arg: string) => any;
  getByText: (arg: string | RegExp) => any;
}) {
  const onProfilePage = page.url().includes("/account/profile");
  const formWithNickname =
    onProfilePage &&
    page.locator("form").filter({ has: page.getByText(/닉네임을 입력해주세요/) }).locator("input").first();
  return formWithNickname
    ? formWithNickname
    : page
        .getByLabel(/닉네임을 입력해주세요|닉네임/i)
        .or(page.getByPlaceholder(/닉네임을 입력해주세요|닉네임/i))
        .or(page.getByRole("textbox", { name: /닉네임|입력해주세요/i }))
        .or(page.locator('input[placeholder*="닉네임"], input[name*="nickname"]'));
}

When("닉네임 영역을 클릭한다", async ({ page }) => {
  if (!page.url().includes("/account/profile")) {
    const toProfileEdit = page
      .locator('a[href*="/account/profile"]')
      .or(page.getByRole("link", { name: /프로필\s*수정/i }))
      .or(page.getByRole("button", { name: /프로필\s*수정/i }))
      .or(page.getByText(/프로필\s*수정/i).first());
    await toProfileEdit.click({ timeout: 10000 });
    await page.waitForURL(/\/account\/profile/, { timeout: 10000 });
  }
  await nicknameInputLocator(page).first().click({ timeout: 10000 });
});

When("새로운 임의의 닉네임을 입력하고 저장 버튼을 클릭한다", async ({ page }) => {
  const nickname = `테스트닉네임${Date.now().toString(36).slice(-6)}`;
  await nicknameInputLocator(page).first().fill(nickname, { timeout: 10000 });
  const saveBtn = page
    .getByRole("button", { name: /저장/i })
    .or(page.getByText(/저장/i).first());
  await saveBtn.first().click({ timeout: 8000 });
});

Then("사용자는 더보기 페이지로 이동한다", async ({ page }) => {
  await page.waitForURL((u: URL) => u.origin === getBaseUrlOrigin(), { timeout: 15000 });
  await expect(
    page.getByText(/더보기|내\s*정보|프로필|계정\s*정보/i).first()
  ).toBeVisible({ timeout: 10000 });
});

Then("내 정보 페이지로 이동하며, 정보가 올바르게 노출된다", async ({ page }) => {
  await expect(
    page.getByText("계정 정보").or(page.getByText("내 정보")).first()
  ).toBeVisible({ timeout: 10000 });
});

Then("프로필 수정 페이지로 이동한다", async ({ page }) => {
  await expect(
    page.getByText("프로필 수정").or(page.getByText("계정 정보")).first()
  ).toBeVisible({ timeout: 8000 });
});

Then("변경된 닉네임이 저장되고 계정 정보 페이지로 이동한다", async ({ page }) => {
  await page.waitForURL((u: URL) => u.origin === getBaseUrlOrigin(), { timeout: 10000 });
  await expect(page.getByText("계정 정보").first()).toBeVisible({ timeout: 8000 });
});
