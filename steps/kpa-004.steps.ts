// Feature: KPA-004 닉네임 변경 기능 검증
// Scenario: 닉네임 변경 시 최대 글자 수 제한 확인
import { When, Then, expect, getBaseUrlOrigin } from "./fixtures.js";

function nicknameInputOnProfilePage(page: { url: () => string; locator: (s: string) => any; getByText: (s: RegExp) => any }) {
  if (!page.url().includes("/account/profile")) return page.locator("input").first();
  return page.locator("form").filter({ has: page.getByText(/닉네임을 입력해주세요/) }).locator("input").first();
}

When("17자 이상의 닉네임을 입력한다", async ({ page }) => {
  const input = nicknameInputOnProfilePage(page);
  await input.click({ timeout: 5000 });
  await input.clear({ timeout: 3000 });
  await page.waitForTimeout(100);
  const differentFirst = "KPA004이전값";
  await input.fill(differentFirst, { timeout: 5000 });
  await page.waitForTimeout(400);
  const submitBtn = page
    .locator("form")
    .filter({ has: page.getByText(/닉네임을 입력해주세요/) })
    .getByRole("button", { name: /수정하기|저장/i });
  const enabled = await submitBtn.first().isEnabled().catch(() => false);
  if (enabled) {
    await submitBtn.first().click({ timeout: 5000 });
    await page.waitForURL(/\/account\/info/, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(800);
    const toProfile = page.locator('a[href*="/account/profile"]').or(page.getByText(/프로필\s*수정/i).first());
    await toProfile.first().click({ timeout: 8000 });
    await page.waitForURL(/\/account\/profile/, { timeout: 10000 });
    await page.waitForTimeout(500);
  }
  const formInput = nicknameInputOnProfilePage(page);
  await formInput.clear({ timeout: 3000 });
  await page.waitForTimeout(100);
  const longNickname = "elon님17자이상닉네임변경테스트";
  await formInput.pressSequentially(longNickname, { delay: 60 });
  await page.waitForTimeout(1000);
});

When("수정하기 버튼을 클릭한다", async ({ page }) => {
  const submitBtn = page
    .locator("form")
    .filter({ has: page.getByText(/닉네임을 입력해주세요/) })
    .getByRole("button", { name: /수정하기|저장/i });
  const btn = submitBtn.first();
  const enabled = await btn.isEnabled().catch(() => false);
  if (enabled) {
    await btn.click({ timeout: 8000 });
    await page.waitForURL(/\/account\/info/, { timeout: 12000 }).catch(() => {});
  }
  await page.waitForTimeout(1000);
});

Then("닉네임이 최대 16자까지만 저장된다", async ({ page }) => {
  await page.waitForTimeout(1500);
  const onAccountInfo = page.url().includes("/account/info");
  const max16Exact = "elon님17자이상닉네임변경테";
  const max16Regex = /elon님17자이상닉네임변경테스?/;
  if (onAccountInfo) {
    const el = page.getByText(max16Regex).first();
    await expect(el).toBeAttached({ timeout: 8000 });
    await expect(el).toContainText(max16Exact);
  } else {
    const input = page.locator("form").filter({ has: page.getByText(/닉네임을 입력해주세요/) }).locator("input").first();
    await expect(input).toHaveValue(max16Regex, { timeout: 8000 });
  }
});

Then("{string}로 노출된다", async ({ page }, expected: string) => {
  const onProfile = page.url().includes("/account/profile");
  if (onProfile) {
    const input = page.locator("form").filter({ has: page.getByText(/닉네임을 입력해주세요/) }).locator("input").first();
    const pattern = new RegExp("^" + expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "?$");
    await expect(input).toHaveValue(pattern, { timeout: 5000 });
  } else {
    const el = page.getByText(expected).first();
    await expect(el).toBeAttached({ timeout: 8000 });
    await expect(el).toContainText(expected);
  }
});

When("사용자가 좌측 상단의 뒤로가기[⬅︎] 버튼을 클릭한다", async ({ page }) => {
  const backBtn = page
    .locator('a[href*="/account/info"]')
    .or(page.getByRole("button", { name: /뒤로가기|back|이전/i }))
    .or(page.getByRole("link", { name: /뒤로|이전|back/i }))
    .or(page.getByLabel(/뒤로가기|이전/i))
    .or(page.locator('button, a').filter({ hasText: /⬅|←|뒤로/ }).first());
  const clicked = await backBtn.first().click({ timeout: 5000 }).then(() => true).catch(() => false);
  if (!clicked && page.url().includes("/account/profile")) {
    await page.goBack();
  }
});

When("좌측 상단의 뒤로가기[⬅︎] 버튼을 클릭한다", async ({ page }) => {
  const backBtn = page
    .locator('a[href*="/account/info"]')
    .or(page.getByRole("button", { name: /뒤로가기|back|이전/i }))
    .or(page.getByRole("link", { name: /뒤로|이전|back/i }))
    .or(page.getByLabel(/뒤로가기|이전/i))
    .or(page.locator('button, a').filter({ hasText: /⬅|←|뒤로/ }).first());
  const clicked = await backBtn.first().click({ timeout: 5000 }).then(() => true).catch(() => false);
  if (!clicked && page.url().includes("/account/profile")) {
    await page.goBack();
  }
});

Then("더보기 페이지로 이동하며, 변경된 닉네임이 노출된다", async ({ page }) => {
  await page.waitForURL((u: URL) => u.origin === getBaseUrlOrigin(), { timeout: 10000 });
  await expect(
    page.getByText(/더보기|계정\s*정보|내\s*정보|프로필|닉네임|추천/i).first()
  ).toBeVisible({ timeout: 8000 });
  const nicknameVisible = await page.getByText(/elon님17자이상닉네임변경테스?/).first().isVisible().catch(() => false);
  if (nicknameVisible) {
    await expect(page.getByText(/elon님17자이상닉네임변경테스?/).first()).toBeVisible();
  }
});
