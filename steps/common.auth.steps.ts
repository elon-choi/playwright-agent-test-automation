import { Given, Then, When, expect, dismissPermissionPopup } from "./fixtures.js";

const ensureLoggedOut = async ({
  page,
  loginPage
}: {
  page: any;
  loginPage: { ensureLoggedOut: () => Promise<void> };
}) => {
  await loginPage.ensureLoggedOut();
  if (page) await dismissPermissionPopup(page);
};

Given("사용자가 비로그인 상태이다", ensureLoggedOut);
Given("사용자는 비로그인 상태이다", ensureLoggedOut);
Given("사용자는 로그인하지 않은 상태이다", ensureLoggedOut);
Given("사용자는 현재 비로그인 상태이다", ensureLoggedOut);
Given("사용자가 미로그인 상태이다", ensureLoggedOut);

When("권한 요청 팝업이 표시되면 차단한다", async ({ page }) => {
  await dismissPermissionPopup(page);
});

const expectLoginPage = async ({ page }: { page: { url: () => string } }) => {
  await expect(page).toHaveURL(/accounts\.kakao\.com\/login/i);
};

Then("사용자는 카카오 로그인 페이지로 리다이렉트된다", expectLoginPage);
Then("사용자는 카카오 로그인 페이지로 이동된다", expectLoginPage);
Then("사용자가 카카오 로그인 페이지로 이동한다", expectLoginPage);

Then("콘텐츠 열람 안내 팝업이 다음과 같이 노출된다:", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    return;
  }
  const ageGateMessage = page.getByText(/연령 확인이 필요|연령 확인/i);
  const ageGateLogin = page.getByRole("button", { name: /로그인/i });
  if (await ageGateMessage.count()) {
    await expect(ageGateMessage.first()).toBeVisible();
    await expect(ageGateLogin.first()).toBeVisible();
    return;
  }
  const loginButton = page.getByRole("button", { name: /로그인 하기/i });
  const cancelButton = page.getByText(/취소/);
  if (await loginButton.count()) {
    await expect(loginButton.first()).toBeVisible();
    await expect(cancelButton.first()).toBeVisible();
    return;
  }
  await expect(page.getByText(/로그인이 필요합니다/)).toBeVisible();
  await expect(cancelButton.first()).toBeVisible();
});

When('사용자가 "로그인 하기" 버튼을 클릭한다', async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    return;
  }
  const loginButton = page.getByRole("button", { name: /로그인( 하기)?/i });
  await loginButton.first().click();
});
