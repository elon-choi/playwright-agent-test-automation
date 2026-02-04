import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

type AiOptions = Record<string, unknown>;
type AiFn = (prompt: string, options?: AiOptions) => Promise<unknown>;

export class LoginPage extends BasePage {
  constructor(page: Page, ai: AiFn, browserName?: string) {
    super(page, ai, browserName);
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  }

  async openLogin() {
    const header = this.page.getByRole("banner");
    const candidates = [
      this.page.locator('[data-test="header-login-button"]'),
      header.locator('[data-test="header-login-button"]'),
      this.page.getByLabel(/내 정보/i),
      header.getByRole("link", { name: /로그인|프로필|계정|내 정보|내정보/i }),
      header.getByRole("button", { name: /로그인|프로필|계정|내 정보|내정보/i }),
      header.locator('a[href*="login"], a[href*="accounts.kakao.com"]'),
      header.locator('[aria-label*="프로필"], [aria-label*="로그인"], [aria-label*="계정"]'),
      header.locator('[data-testid*="profile"], [class*="profile"], [class*="account"]'),
      this.page.getByRole("link", { name: /로그인/i }),
      this.page.getByRole("button", { name: /로그인/i })
    ];

    for (const locator of candidates) {
      if (await locator.count()) {
        await this.smartClick(locator.first(), "우측 상단 프로필 아이콘");
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
        } catch (error) {
          if (await loginForm.count()) {
            return;
          }
        }
        await this.page.goto(
          "https://accounts.kakao.com/login?continue=https%3A%2F%2Fpage.kakao.com%2F",
          { waitUntil: "domcontentloaded", timeout: 15000 }
        );
        return;
      }
    }

    const result = await this.safeAi("우측 상단 프로필 아이콘을 클릭해줘");
    if (result === null) {
      throw new Error(
        "우측 상단 프로필 아이콘을 찾지 못했습니다. 지원되는 locator 후보를 확인해 주세요."
      );
    }

    await this.page.goto(
      "https://accounts.kakao.com/login?continue=https%3A%2F%2Fpage.kakao.com%2F",
      { waitUntil: "domcontentloaded", timeout: 15000 }
    );
  }

  async ensureLoggedOut() {
    const loginForm = this.page.locator(
      ['input[name="loginId"]', "input#loginId--1", 'input[placeholder*="카카오메일"]'].join(
        ", "
      )
    );
    if (await loginForm.count()) {
      return;
    }

    const loginCtas = [
      this.page.getByRole("link", { name: /로그인/i }),
      this.page.getByRole("button", { name: /로그인/i }),
      this.page.locator('a[href*="login"], a[href*="accounts.kakao.com"]')
    ];
    for (const locator of loginCtas) {
      if (await locator.count()) {
        return;
      }
    }
  }

  async fillCredentials(username: string, password: string) {
    const idInput = this.page.locator(
      [
        'input[name="loginId"]',
        "input#loginId--1",
        'input[placeholder*="카카오메일"]',
        'input[aria-label*="계정정보"]'
      ].join(", ")
    );
    const pwInput = this.page.locator(
      ['input[name="password"]', "input#password--2", 'input[placeholder="비밀번호"]'].join(
        ", "
      )
    );

    if (await idInput.count()) {
      await idInput.fill(username);
    } else {
      const result = await this.safeAi(`아이디 입력칸에 ${username} 를 입력해줘`);
      if (result === null) {
        throw new Error("아이디 입력칸을 찾지 못했습니다.");
      }
    }

    if (await pwInput.count()) {
      await pwInput.fill(password);
    } else {
      const result = await this.safeAi("비밀번호 입력칸에 비밀번호를 입력해줘");
      if (result === null) {
        throw new Error("비밀번호 입력칸을 찾지 못했습니다.");
      }
    }
  }

  async fillCredentialsFromEnv() {
    const username = process.env.AUTH_USERNAME || "";
    const password = process.env.AUTH_PASSWORD || "";
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

    const result = await this.safeAi("로그인 버튼을 클릭해줘");
    if (result === null) {
      throw new Error("로그인 버튼을 찾지 못했습니다.");
    }
  }

  async verifyRecommendationHome() {
    await this.page.waitForURL(
      (url) => /page\.kakao\.com/i.test(url.toString()) && !/accounts\.kakao\.com|login/i.test(url.toString()),
      { timeout: 30000 }
    );
    await this.page.waitForLoadState("domcontentloaded");

    const recommendTab = this.page.getByRole("link", { name: /추천/i });
    try {
      await recommendTab.first().waitFor({ state: "visible", timeout: 15000 });
      return;
    } catch (error) {
      // Fall through to AI check
    }

    const result = await this.safeAi("추천 홈이 화면에 노출되어 있는지 확인해줘");
    if (result === null) {
      throw new Error("추천 홈 탭을 확인하지 못했습니다.");
    }
  }
}
