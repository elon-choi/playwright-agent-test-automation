import { test as base, createBdd } from "playwright-bdd";
import { expect, test as pwTest } from "@playwright/test";
import dotenv from "dotenv";
import { ai as zerostepAi } from "@zerostep/playwright";
import { LoginPage } from "../pages/LoginPage.js";
import { mkdir, access, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

dotenv.config();

const BASE_URL = process.env.BASE_URL || "https://page.kakao.com";
export const getBaseUrl = () => BASE_URL;
export const getBaseUrlOrigin = () => {
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return BASE_URL;
  }
};

export const dismissPermissionPopup = async (page: any) => {
  if (!page || page.isClosed()) return;
  const closeSelectors = [
    "button:has-text('닫기')",
    "button:has-text('취소')",
    "button:has-text('거절')",
    "[aria-label='닫기']",
    ".permission-dialog button",
    "[class*='permission'] button"
  ];
  for (const sel of closeSelectors) {
    const btn = page.locator(sel).first();
    if ((await btn.count()) > 0 && (await btn.isVisible().catch(() => false))) {
      await btn.click({ timeout: 2000 }).catch(() => null);
      await page.waitForTimeout(300);
      return;
    }
  }
};

const STORAGE_STATE_PATH = path.resolve(process.cwd(), ".auth", "storageState.json");
const DOM_DUMP_DIR = path.resolve(process.cwd(), "dom_dumps");
const DOM_LOG_DIR = path.resolve(process.cwd(), "dom_logs");
const SELF_HEAL_DIR = path.resolve(process.cwd(), "self_heal");
const SELF_HEAL_MAP_PATH = path.resolve(SELF_HEAL_DIR, "selector-map.json");

const sanitizeFileName = (value: string) =>
  value.replace(/[^a-zA-Z0-9-_]+/g, "_").slice(0, 120);

type HealRoleCandidate = {
  role: "button" | "link" | "tab" | "textbox" | "img" | "heading";
  name: string | RegExp;
  exact?: boolean;
};

type HealOptions = {
  key: string;
  selectors?: string[];
  roles?: HealRoleCandidate[];
  texts?: Array<string | RegExp>;
  scope?: any;
  allowHidden?: boolean;
};

const loadSelfHealMap = async () => {
  try {
    const raw = await readFile(SELF_HEAL_MAP_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const saveSelfHealMap = async (map: any) => {
  await mkdir(SELF_HEAL_DIR, { recursive: true });
  await writeFile(SELF_HEAL_MAP_PATH, JSON.stringify(map, null, 2), "utf-8");
};

export const selfHealLocator = async (page: any, options: HealOptions) => {
  const {
    key,
    selectors = [],
    roles = [],
    texts = [],
    scope = null,
    allowHidden = false
  } = options;
  const base = scope ?? page;
  const map = await loadSelfHealMap();
  const storedSelectors = Array.isArray(map[key]?.selectors) ? map[key].selectors : [];
  const candidateSelectors = Array.from(new Set([...storedSelectors, ...selectors].filter(Boolean)));

  const resolveVisible = async (locator: any) => {
    if (!(await locator.count())) {
      return null;
    }
    const first = locator.first();
    if (allowHidden) {
      return first;
    }
    return (await first.isVisible()) ? first : null;
  };

  for (const selector of candidateSelectors) {
    const locator = base.locator(selector);
    const resolved = await resolveVisible(locator);
    if (resolved) {
      map[key] = { selectors: [selector], updatedAt: new Date().toISOString() };
      await saveSelfHealMap(map);
      return resolved;
    }
  }

  for (const role of roles) {
    const locator = base.getByRole(role.role, { name: role.name, exact: role.exact });
    const resolved = await resolveVisible(locator);
    if (resolved) {
      map[key] = { roles: [role], updatedAt: new Date().toISOString() };
      await saveSelfHealMap(map);
      return resolved;
    }
  }

  for (const text of texts) {
    const locator = base.getByText(text);
    const resolved = await resolveVisible(locator);
    if (resolved) {
      map[key] = { texts: [text], updatedAt: new Date().toISOString() };
      await saveSelfHealMap(map);
      return resolved;
    }
  }

  return null;
};

const hasZerostepToken = () =>
  Boolean(typeof process !== "undefined" && process.env?.ZEROSTEP_TOKEN);

/**
 * 로케이터 기반 액션을 먼저 실행하고, 실패 시 ZEROSTEP_TOKEN이 있으면
 * 동일 의도를 자연어로 ZeroStep AI에 넘겨 재시도한다.
 * 토큰이 없으면 기존처럼 예외를 그대로 전파한다.
 * (시나리오별로 동일 로직 추가 금지. 이 함수만 사용한다.)
 */
export const withAiFallback = async <T>(
  locatorAction: () => Promise<T>,
  aiPrompt: string,
  ai: (prompt: string, options?: any) => Promise<any>
): Promise<T | void> => {
  try {
    return await locatorAction();
  } catch (err) {
    if (hasZerostepToken() && ai) {
      console.warn("[ZeroStep fallback] 로케이터 실패, AI 재시도:", aiPrompt);
      await ai(aiPrompt);
      return;
    }
    throw err;
  }
};

// BDD Step에서 사용할 Fixture 타입 정의
type MyFixtures = {
  loginPage: LoginPage;
  ai: any;
  dumpOnFailure: void;
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
  loginPage: async (
    { page, ai }: { page: any; ai: any },
    use: any,
    testInfo: any
  ) => {
    const browserName =
      testInfo.project.use?.defaultBrowserType ||
      testInfo.project.use?.browserName ||
      testInfo.project.name;
    await use(new LoginPage(page, ai, browserName));
  },
  // ZeroStep AI 주입 (KPA-048은 배너/클릭 단계가 많아 타임아웃 90초 적용)
  ai: async ({ page }: { page: any }, use: any, testInfo: any) => {
    if (testInfo?.file && String(testInfo.file).includes("kpa-048")) {
      testInfo.setTimeout(90000);
    }
    const aiRunner = zerostepAi as any;
    await use((prompt: string, options: any) => aiRunner(prompt, { ...options, page, test: pwTest }));
  },
  dumpOnFailure: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status === testInfo.expectedStatus) {
        return;
      }
      if (!page || page.isClosed()) {
        return;
      }

      await mkdir(DOM_DUMP_DIR, { recursive: true });
      await mkdir(DOM_LOG_DIR, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const baseName = sanitizeFileName(`${testInfo.title}-${timestamp}`);
      const dumpPath = path.join(DOM_DUMP_DIR, `${baseName}.html`);
      const logPath = path.join(DOM_LOG_DIR, `${baseName}.json`);

      const html = await page.evaluate(() => {
        const root = document.documentElement.cloneNode(true) as any;
        root.querySelectorAll("script, style, svg, noscript, template").forEach((el: any) => {
          el.remove();
        });
        return root.innerHTML;
      });

      await writeFile(dumpPath, html, "utf-8");
      const errorMessage =
        testInfo.error?.message ?? (testInfo.error ? String(testInfo.error) : undefined);
      const errorStack = testInfo.error?.stack;

      await writeFile(
        logPath,
        JSON.stringify(
          {
            title: testInfo.title,
            file: testInfo.file ?? "",
            status: testInfo.status,
            expectedStatus: testInfo.expectedStatus,
            url: page.url(),
            dumpPath,
            timestamp,
            error: errorMessage,
            errorStack: errorStack
          },
          null,
          2
        ),
        "utf-8"
      );
    },
    { auto: true }
  ]
});

// BDD Step 함수 바인딩 (And는 Given과 동일한 스텝 등록자)
export const { Given, When, Then } = createBdd(test);
export const And = Given;
export { expect };
