import { Given, Then, When, expect, dismissPermissionPopup, getBaseUrlOrigin } from "./fixtures.js";

Given("사용자가 로그인 상태이다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    throw new Error("로그인 상태가 필요하나 현재 로그인 페이지에 있습니다. 먼저 login.feature로 로그인 상태를 저장해 주세요.");
  }
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin());
});

Given("사용자는 로그인 상태이다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    throw new Error("로그인 상태가 필요하나 현재 로그인 페이지에 있습니다. 먼저 login.feature로 로그인 상태를 저장해 주세요.");
  }
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin());
});

Given("사용자가 로그인되어 있다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    throw new Error("로그인 상태가 필요하나 현재 로그인 페이지에 있습니다. 먼저 login.feature로 로그인 상태를 저장해 주세요.");
  }
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin());
});

Given("로그인 상태이다", async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    throw new Error("로그인 상태가 필요하나 현재 로그인 페이지에 있습니다. 먼저 login.feature로 로그인 상태를 저장해 주세요.");
  }
  await expect(page).toHaveURL((u: URL) => u.origin === getBaseUrlOrigin());
});

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

When("사용자가 우측 상단의 프로필 아이콘을 클릭한다", async ({ loginPage }) => {
  await loginPage.clickProfileIcon();
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
  const popupMessage = page.getByText(/로그인이 필요합니다|해당 콘텐츠를 열람하시려면 로그인이 필요합니다/i);
  const loginButton = page.getByRole("button", { name: /로그인 하기/i });
  const cancelButton = page.getByText(/취소/);
  try {
    await popupMessage.first().waitFor({ state: "visible", timeout: 12000 });
  } catch {
    await loginButton.first().waitFor({ state: "visible", timeout: 5000 });
  }

  const ageGateMessage = page.getByText(/연령 확인이 필요|연령 확인/i);
  const ageGateLogin = page.getByRole("button", { name: /로그인/i });
  if (await ageGateMessage.count()) {
    await expect(ageGateMessage.first()).toBeVisible();
    await expect(ageGateLogin.first()).toBeVisible();
    return;
  }
  if (await loginButton.count()) {
    await expect(loginButton.first()).toBeVisible();
    await expect(cancelButton.first()).toBeVisible();
    return;
  }
  await expect(page.getByText(/로그인이 필요합니다|해당 콘텐츠를 열람하시려면 로그인이 필요합니다/i)).toBeVisible();
  await expect(cancelButton.first()).toBeVisible();
});

When('사용자가 "로그인 하기" 버튼을 클릭한다', async ({ page }) => {
  if (/accounts\.kakao\.com\/login/i.test(page.url())) {
    return;
  }
  const loginButton = page.getByRole("button", { name: /로그인( 하기)?/i });
  await loginButton.first().click();
});
