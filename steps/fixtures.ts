import { test as base, createBdd } from "playwright-bdd";
import { expect, test as pwTest } from "@playwright/test";
import dotenv from "dotenv";
import { ai as zerostepAi } from "@zerostep/playwright";
import { LoginPage } from "../pages/LoginPage.js";
import { mkdir, access, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

dotenv.config({ quiet: true });

const DEFAULT_BASE_URL = "https://page.kakao.com/";

export const getBaseUrl = (): string => {
  const u = (process.env.BASE_URL || DEFAULT_BASE_URL).trim();
  return u.replace(/\/+$/, "") + "/";
};

export const getBaseUrlOrigin = (): string => {
  return new URL(getBaseUrl()).origin;
};

const AUTH_DIR = path.resolve(process.cwd(), ".auth");
const STORAGE_STATE_NON_ADULT_PATH = path.join(AUTH_DIR, "storageState-nonAdult.json");
const STORAGE_STATE_ADULT_PATH = path.join(AUTH_DIR, "storageState-adult.json");

const DOM_READY_WAIT_MS = 400;
const SCENARIO_INTERVAL_MS = 1500;

export const ensurePageReady = async (page: any): Promise<void> => {
  if (!page || page.isClosed?.()) return;
  try {
    await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
    await page.waitForLoadState("load", { timeout: 15000 });
    await page.waitForTimeout(DOM_READY_WAIT_MS);
  } catch {
    // 페이지 종료/이동 중이면 무시
  }
};
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
      await ai(aiPrompt);
      return;
    }
    throw err;
  }
};

/**
 * 권한 요청 팝업(로컬 네트워크 등)이 떴을 때 "차단" 또는 닫기로 처리한다.
 * page.kakao.com / accounts.kakao.com 등에서 노출되는 브라우저 권한 팝업 대응용.
 * @returns 팝업을 닫았으면 true, 없었거나 실패하면 false
 */
export const dismissPermissionPopup = async (page: any): Promise<boolean> => {
  if (!page) return false;
  await page.waitForTimeout(500);
  const closedByEvaluate = await page
    .evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, [role='button'], a"));
      const deny = buttons.find(
        (el) => el.textContent?.trim() === "차단" || el.innerText?.trim() === "차단"
      );
      if (deny) {
        (deny as HTMLElement).click();
        return true;
      }
      const byText = document.evaluate(
        "//*[contains(text(),'차단') and (self::button or self::a or @role='button')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      if (byText) {
        (byText as HTMLElement).click();
        return true;
      }
      return false;
    })
    .catch(() => false);
  if (closedByEvaluate) {
    await page.waitForTimeout(300);
    return true;
  }
  const denyBtn = page
    .getByRole("button", { name: /차단/i })
    .or(page.locator("button, [role='button']").filter({ hasText: /차단/i }));
  if (await denyBtn.first().isVisible().catch(() => false)) {
    await denyBtn.first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
    return true;
  }
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(200);
  return false;
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
      testInfo.title.includes("KPA-002") ||
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
      (testInfo.file.includes("kpa-002") ||
        testInfo.file.includes("kpa-061") ||
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
      try {
        await context.grantPermissions(["local-network-access"], {
          origin: getBaseUrlOrigin()
        });
        await context.grantPermissions(["local-network-access"], {
          origin: "https://accounts.kakao.com"
        });
      } catch {
        // 브라우저/버전에 따라 미지원 시 무시
      }
      await use(context);
      await context.close();
      return;
    }

    if (isLoginScenario) {
      const context = await browser.newContext();
      try {
        await context.grantPermissions(["local-network-access"], {
          origin: getBaseUrlOrigin()
        });
        await context.grantPermissions(["local-network-access"], {
          origin: "https://accounts.kakao.com"
        });
      } catch {
        // 브라우저/버전에 따라 미지원 시 무시
      }
      await use(context);
      const isAdultLogin = /성인\s*인증/.test(testInfo.title);
      const savePath = isAdultLogin ? STORAGE_STATE_ADULT_PATH : STORAGE_STATE_NON_ADULT_PATH;
      await mkdir(AUTH_DIR, { recursive: true });
      await context.storageState({ path: savePath });
      await context.close();
      return;
    }

    const isAdultProject = testInfo.project.name === "chromium-adult";
    const storagePath = isAdultProject ? STORAGE_STATE_ADULT_PATH : STORAGE_STATE_NON_ADULT_PATH;
    let hasStorageState = true;
    try {
      await access(storagePath);
    } catch {
      hasStorageState = false;
    }

    if (!hasStorageState) {
      const hint = isAdultProject
        ? "login.feature에서 '성인 인증 계정으로 로그인 성공' 시나리오를 실행해 주세요."
        : "login.feature에서 '미인증 계정으로 로그인 성공' 시나리오를 실행해 주세요.";
      throw new Error(`저장된 로그인 상태가 없습니다. 먼저 ${hint}`);
    }

    const context = await browser.newContext({ storageState: storagePath });
    try {
      await context.grantPermissions(["local-network-access"], {
        origin: getBaseUrlOrigin()
      });
      await context.grantPermissions(["local-network-access"], {
        origin: "https://accounts.kakao.com"
      });
    } catch {
      // 브라우저/버전에 따라 미지원 시 무시
    }
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

try {
  test.beforeEach(async ({ page }) => {
    await ensurePageReady(page);
  });
  test.afterEach(async () => {
    await new Promise((r) => setTimeout(r, SCENARIO_INTERVAL_MS));
  });
} catch {
  // bddgen 등 스텝 로드 전용 실행 시 beforeEach/afterEach 미지원
}

const bdd = createBdd(test);
const wrapStepHandler = (fn: (deps: any, ...args: any[]) => any) =>
  async ({ page, ai, loginPage }: any, ...args: any[]) => {
    if (page) await ensurePageReady(page);
    return fn({ page, ai, loginPage }, ...args);
  };
export const Given = (text: string, fn: (deps: any, ...args: any[]) => any) =>
  bdd.Given(text, wrapStepHandler(fn));
export const When = (text: string, fn: (deps: any, ...args: any[]) => any) =>
  bdd.When(text, wrapStepHandler(fn));
export const Then = (text: string, fn: (deps: any, ...args: any[]) => any) =>
  bdd.Then(text, wrapStepHandler(fn));
export const And = (text: string, fn: (deps: any, ...args: any[]) => any) =>
  bdd.Given(text, wrapStepHandler(fn));
export { expect };
