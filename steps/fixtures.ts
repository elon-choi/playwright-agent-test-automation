import { test as base, createBdd } from "playwright-bdd";
import { expect, test as pwTest } from "@playwright/test";
import dotenv from "dotenv";
import { ai } from "@zerostep/playwright";
import { LoginPage } from "../pages/LoginPage";
import { mkdir, access } from "node:fs/promises";
import path from "node:path";

dotenv.config();

const STORAGE_STATE_PATH = path.resolve(process.cwd(), ".auth", "storageState.json");

// BDD Step에서 사용할 Fixture 타입 정의
type MyFixtures = {
  loginPage: LoginPage;
  ai: typeof ai;
};

export const test = base.extend<MyFixtures>({
  context: async ({ browser }, use, testInfo) => {
    const isLoginScenario =
      testInfo.title.includes("공통 로그인 시나리오") ||
      (testInfo.file && testInfo.file.includes("login.feature"));
    const skipAuthByTitle =
      testInfo.title.includes("KPA-061") ||
      testInfo.title.includes("KPA-008") ||
      testInfo.title.includes("KPA-009") ||
      testInfo.title.includes("KPA-010") ||
      testInfo.title.includes("KPA-011") ||
      testInfo.title.includes("KPA-012") ||
      testInfo.title.includes("KPA-013") ||
      testInfo.title.includes("KPA-048") ||
      testInfo.title.includes("KPA-059") ||
      testInfo.title.includes("KPA-065") ||
      testInfo.title.includes("KPA-091") ||
      testInfo.title.includes("KPA-092") ||
      testInfo.title.includes("KPA-099") ||
      testInfo.title.includes("KPA-101") ||
      testInfo.title.includes("KPA-103");
    const skipAuthByFile =
      testInfo.file &&
      (testInfo.file.includes("kpa-061") ||
        testInfo.file.includes("kpa-008") ||
        testInfo.file.includes("kpa-009") ||
        testInfo.file.includes("kpa-010") ||
        testInfo.file.includes("kpa-011") ||
        testInfo.file.includes("kpa-012") ||
        testInfo.file.includes("kpa-013") ||
        testInfo.file.includes("kpa-048") ||
        testInfo.file.includes("kpa-059") ||
        testInfo.file.includes("kpa-065") ||
        testInfo.file.includes("kpa-091") ||
        testInfo.file.includes("kpa-092") ||
        testInfo.file.includes("kpa-099") ||
        testInfo.file.includes("kpa-101") ||
        testInfo.file.includes("kpa-103"));
    const skipAuth = (skipAuthByTitle || skipAuthByFile) && !isLoginScenario;
    if (skipAuth) {
      const context = await browser.newContext();
      await use(context);
      await context.close();
      return;
    }

    let hasStorageState = true;
    try {
      await access(STORAGE_STATE_PATH);
    } catch (error) {
      hasStorageState = false;
    }

    if (isLoginScenario) {
      const context = await browser.newContext();
      await use(context);
      await context.storageState({ path: STORAGE_STATE_PATH });
      await context.close();
      return;
    }

    if (!hasStorageState) {
      throw new Error(
        "저장된 로그인 상태가 없습니다. 먼저 login.feature를 실행해 로그인 상태를 생성해 주세요."
      );
    }

    const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
    await use(context);
    await context.close();
  },
  // Page Object 주입
  loginPage: async ({ page, ai }, use, testInfo) => {
    const browserName =
      testInfo.project.use?.defaultBrowserType ||
      testInfo.project.use?.browserName ||
      testInfo.project.name;
    await use(new LoginPage(page, ai, browserName));
  },
  // ZeroStep AI 주입
  ai: async ({ page }, use) => {
    await use((prompt, options) => ai(prompt, { page, test: pwTest, ...options }));
  }
});

// BDD Step 함수 바인딩
export const { Given, When, Then } = createBdd(test);
export { expect };
