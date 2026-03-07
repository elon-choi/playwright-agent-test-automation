import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage.js";

const getBaseUrlFromEnv = (): string => {
  const u = (process.env.BASE_URL || "https://page.kakao.com/").trim();
  return u.replace(/\/+$/, "") + "/";
};

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  }

  async clickProfileIcon(openLoginFlow = false) {
    const header = this.page.getByRole("banner");
    const url = this.page.url();
    const onPageKakao = /page\.kakao\.com/i.test(url);
    const profileOnlyCandidates = [
      this.page.getByLabel(/내 정보/i),
      header.getByRole("button", { name: /프로필|계정|내 정보|내정보/i }),
      header.locator('button[aria-label*="프로필"], button[aria-label*="계정"], button[aria-label*="내 정보"]'),
      header.locator('[aria-label*="프로필"], [aria-label*="계정"]').filter({ hasNot: this.page.locator('a') }),
      header.locator('[data-testid*="profile"], [class*="profile"]').filter({ hasNot: this.page.locator('a[href*="login"], a[href*="accounts.kakao"]') })
    ];
    const loginCandidates = [
      header.getByRole("link", { name: /로그인/i }),
      header.getByRole("button", { name: /로그인/i }),
      header.locator('a[href*="login"], a[href*="accounts.kakao.com"]'),
      header.locator('[aria-label*="로그인"]'),
      this.page.getByRole("link", { name: /로그인/i }),
      this.page.getByRole("button", { name: /로그인/i })
    ];
    if (onPageKakao && !openLoginFlow) {
      for (const locator of profileOnlyCandidates) {
        const resolved = locator.first();
        if ((await locator.count()) > 0 && (await resolved.isVisible().catch(() => false))) {
          const href = await resolved.getAttribute("href").catch(() => null);
          if (href && /login|accounts\.kakao\.com/i.test(href)) continue;
          const tag = await resolved.evaluate((el) => el.tagName).catch(() => "");
          if (tag === "A") {
            const linkHref = await resolved.evaluate((el) => (el as HTMLAnchorElement).href).catch(() => "");
            if (/login|accounts\.kakao\.com/i.test(linkHref)) continue;
          }
          const hasLoginLinkInside = await resolved
            .evaluate(
              (el) =>
                !!el.querySelector('a[href*="login"], a[href*="accounts.kakao.com"]') ||
                (el.closest("a") && /login|accounts\.kakao\.com/i.test((el.closest("a") as HTMLAnchorElement).href))
            )
            .catch(() => true);
          if (hasLoginLinkInside) continue;
          await this.smartClick(resolved, "우측 상단 프로필 아이콘");
          await this.page.waitForTimeout(3500);
          if (/accounts\.kakao\.com\/login/i.test(this.page.url())) {
            throw new Error(
              "프로필 아이콘으로 클릭한 요소가 로그인 페이지로 이동시켰습니다. 00-login.feature 실행 후 다시 시도하세요."
            );
          }
          return;
        }
      }
      throw new Error(
        "page.kakao.com에서 프로필 아이콘(메뉴 열기)을 찾지 못했습니다. 로그인 상태에서 00-login.feature 실행 후 다시 시도하세요."
      );
    }
    for (const locator of [...profileOnlyCandidates, ...loginCandidates]) {
      const resolved = locator.first();
      if ((await locator.count()) > 0 && (await resolved.isVisible().catch(() => false))) {
        await this.smartClick(resolved, "우측 상단 프로필 아이콘");
        return;
      }
    }
    throw new Error("우측 상단 프로필 아이콘을 찾지 못했습니다. 지원되는 locator 후보를 확인해 주세요.");
  }

  async openLogin() {
    await this.clickProfileIcon(true);
    const loginForm = this.page.locator(
      [
        'input[name="loginId"]',
        "input#loginId--1",
        'input[placeholder*="카카오메일"]'
      ].join(", ")
    );
    try {
      await this.page.waitForURL(/accounts\.kakao\.com|login/i, { timeout: 5000 });
      return;
    } catch {
      if (await loginForm.count()) {
        return;
      }
    }
    const continueUrl = encodeURIComponent(getBaseUrlFromEnv());
    await this.page.goto(
      `https://accounts.kakao.com/login?continue=${continueUrl}`,
      { waitUntil: "domcontentloaded", timeout: 15000 }
    );
  }

  async ensureLoggedOut() {
    // 이미 로그인 페이지에 있으면 비로그인 상태
    if (/accounts\.kakao\.com\/login/i.test(this.page.url())) return;

    const loginForm = this.page.locator(
      ['input[name="loginId"]', "input#loginId--1", 'input[placeholder*="카카오메일"]'].join(", ")
    );
    if (await loginForm.count()) return;

    // 메인 페이지에서 로그인 CTA가 보이면 비로그인 상태
    const baseUrl = (process.env.BASE_URL || "https://page.kakao.com/").replace(/\/+$/, "") + "/";
    if (!/page\.kakao\.com/i.test(this.page.url())) {
      await this.page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
    }
    // 비로그인 상태: data-test="header-login-button" 속성이 프로필 버튼에 존재
    // 로그인 상태: 해당 속성 없이 프로필 이미지(img[alt="프로필"])가 표시됨
    const headerLoginBtn = this.page.locator('[data-test="header-login-button"]');
    if (await headerLoginBtn.count()) return;
    const loginCtas = [
      this.page.getByRole("link", { name: /로그인/i }),
      this.page.getByRole("button", { name: /로그인/i }),
      this.page.locator('a[href*="login"], a[href*="accounts.kakao.com"]')
    ];
    for (const locator of loginCtas) {
      if (await locator.count()) return;
    }
    // 프로필 이미지가 있으면 로그인된 상태
    const profileImg = this.page.locator('img[alt="프로필"]');
    if (await profileImg.count()) {
      throw new Error("현재 로그인 상태입니다. 비로그인 시나리오를 위해 로그아웃하거나 별도 storageState를 사용해 주세요.");
    }
  }

  async fillCredentials(username: string, password: string) {
    const idInput = this.page.locator(
      [
        'input[name="loginId"]',
        "input#loginId--1",
        'input[placeholder*="카카오메일"]',
        'input[placeholder*="Account"]',
        'input[aria-label*="계정정보"]'
      ].join(", ")
    );
    const pwInput = this.page.locator(
      [
        'input[name="password"]',
        "input#password--2",
        'input[placeholder="비밀번호"]',
        'input[type="password"]'
      ].join(", ")
    );

    if (/accounts\.kakao\.com|login/i.test(this.page.url())) {
      await idInput.first().waitFor({ state: "visible", timeout: 15000 }).catch(() => null);
    }

    if ((await idInput.count()) > 0 && (await idInput.first().isVisible().catch(() => false))) {
      await idInput.first().fill(username);
    } else {
      throw new Error("아이디 입력칸을 찾지 못했습니다.");
    }

    if ((await pwInput.count()) > 0 && (await pwInput.first().isVisible().catch(() => false))) {
      await pwInput.first().fill(password);
    } else {
      throw new Error("비밀번호 입력칸을 찾지 못했습니다.");
    }
  }

  async fillCredentialsFromEnv(accountType: "adult" | "nonAdult" = "nonAdult") {
    const username =
      accountType === "adult"
        ? (process.env.AUTH_ADULT_USERNAME || "")
        : (process.env.AUTH_NON_ADULT_USERNAME || process.env.AUTH_USERNAME || "");
    const password =
      accountType === "adult"
        ? (process.env.AUTH_ADULT_PASSWORD || "")
        : (process.env.AUTH_NON_ADULT_PASSWORD || process.env.AUTH_PASSWORD || "");
    await this.fillCredentials(username, password);
  }

  async submitLogin() {
    const submitCandidates = [
      this.page.locator('button[type="submit"].submit'),
      this.page.locator('button[type="submit"]'),
      this.page.getByRole("button", { name: /로그인/i })
    ];

    for (const locator of submitCandidates) {
      if (await locator.count()) {
        await this.smartClick(locator.first(), "로그인 버튼");
        return;
      }
    }
    throw new Error("로그인 버튼을 찾지 못했습니다.");
  }

  async verifyRecommendationHome() {
    const baseOrigin = new URL(getBaseUrlFromEnv()).origin;
    await this.page.waitForURL(
      (url) => {
        const u = new URL(url);
        return u.origin === baseOrigin && !/accounts\.kakao\.com/i.test(url);
      },
      { timeout: 45000 }
    );
    await this.page.waitForLoadState("domcontentloaded");

    const recommendTab = this.page.getByRole("link", { name: /추천/i });
    await recommendTab.first().waitFor({ state: "visible", timeout: 15000 });
  }
}
