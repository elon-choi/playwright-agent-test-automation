import { test as base, createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import dotenv from "dotenv";
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

const origin = () => getBaseUrlOrigin();

/** 테스트용 고정 작품 URL 1개. 설정 시 랜덤 클릭 대신 이 URL로 직접 이동 */
export const getTestWorkUrl = (): string | null => {
  const url = process.env.TEST_WORK_URL?.trim();
  if (!url) return null;
  if (!/\/content\/|\/landing\/series\//i.test(url)) return null;
  return url.startsWith("http") ? url : new URL(url, origin()).href;
};

/** 테스트용 고정 작품 URL 목록(쉼표 구분). 설정 시 이 중 하나를 랜덤 선택해 이동 */
export const getTestWorkUrls = (): string[] => {
  const raw = process.env.TEST_WORK_URLS?.trim();
  if (!raw) return [];
  const list = raw.split(",").map((u) => u.trim()).filter((u) => /\/content\/|\/landing\/series\//i.test(u));
  return list.map((u) => (u.startsWith("http") ? u : new URL(u, origin()).href));
};

/** 고정 작품 목록이 있으면 그중 랜덤 1개, 단일 URL이 있으면 그대로, 없으면 null */
export const getRandomTestWorkUrl = (): string | null => {
  const list = getTestWorkUrls();
  if (list.length > 0) return list[Math.floor(Math.random() * list.length)];
  return getTestWorkUrl();
};

/**
 * DOM에 있는 권한/다이얼로그만 닫음.
 * accounts.kakao.com에서만 뜨는 '로컬 네트워크 액세스' 창은 브라우저 시스템 UI라 DOM에 없어
 * 개발자 도구로 추출 불가하고 여기서도 닫을 수 없음. 대신 context 생성 시 permissions에
 * local-network-access 부여 및 playwright.config의 --disable-features=LocalNetworkAccess 로
 * 창이 뜨지 않도록 처리함.
 */
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
  if (/accounts\.kakao\.com/i.test(page.url())) {
    const permissionKorean = await page.getByText(/권한을\s*요청|다음\s*권한|로컬\s*네트워크|다른\s*기기에\s*액세스/i).first().isVisible().catch(() => false);
    const permissionEnglish = await page.getByText(/requesting|local\s*network|Access\s*other\s*devices/i).first().isVisible().catch(() => false);
    if (permissionKorean || permissionEnglish) {
      const permissionContainer = page.locator("div, section, [role='dialog']").filter({
        has: page.getByText(/권한을\s*요청|다음\s*권한|로컬\s*네트워크|requesting|local\s*network|Access\s*other/i)
      }).first();
      const hasContainer = await permissionContainer.count() > 0 && (await permissionContainer.isVisible().catch(() => false));
      if (hasContainer) {
        const closeX = permissionContainer.locator("[aria-label='닫기'], [aria-label='Close'], [title='닫기'], [title='Close'], button:has(svg)").first();
        if (await closeX.count() > 0 && (await closeX.isVisible().catch(() => false))) {
          await closeX.click({ timeout: 2000 }).catch(() => null);
          await page.waitForTimeout(300);
          return;
        }
      }
      const blockBtn = page.getByRole("button", { name: /^(차단|Block)$/i })
        .or(page.locator("button").filter({ hasText: /^(차단|Block)$/i }).first());
      if (await blockBtn.count() > 0 && (await blockBtn.first().isVisible().catch(() => false))) {
        await blockBtn.first().click({ timeout: 2000 }).catch(() => null);
        await page.waitForTimeout(300);
        return;
      }
      const allowBtn = page.getByRole("button", { name: /^(허용|Allow)$/i })
        .or(page.locator("button").filter({ hasText: /^(허용|Allow)$/i }).first());
      if (await allowBtn.count() > 0 && (await allowBtn.first().isVisible().catch(() => false))) {
        await allowBtn.first().click({ timeout: 2000 }).catch(() => null);
        await page.waitForTimeout(300);
        return;
      }
      const anyDialogButton = page.locator("button").filter({ hasText: /차단|허용|Block|Allow|닫기|취소/i });
      if (await anyDialogButton.count() > 0) {
        await anyDialogButton.first().click({ timeout: 2000 }).catch(() => null);
        await page.waitForTimeout(300);
        return;
      }
      if (hasContainer) {
        const btnInContainer = permissionContainer.locator("button").first();
        if (await btnInContainer.count() > 0 && (await btnInContainer.isVisible().catch(() => false))) {
          await btnInContainer.click({ timeout: 2000 }).catch(() => null);
          await page.waitForTimeout(300);
          return;
        }
      }
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
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


// BDD Step에서 사용할 Fixture 타입 정의
type MyFixtures = {
  loginPage: LoginPage;
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
      testInfo.title.includes("KPA-059");
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
        testInfo.file.includes("kpa-059"));
    const skipAuth = (skipAuthByTitle || skipAuthByFile) && !isLoginScenario;
    if (skipAuth) {
      const context = await browser.newContext({
        permissions: ["local-network-access"]
      });
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
      const context = await browser.newContext({
        permissions: ["local-network-access"]
      });
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

    const context = await browser.newContext({
      storageState: STORAGE_STATE_PATH,
      permissions: ["local-network-access"]
    });
    await use(context);
    await context.close();
  },
  // Page Object 주입
  loginPage: async (
    { page }: { page: any },
    use: any,
    testInfo: any
  ) => {
    const browserName =
      testInfo.project.use?.defaultBrowserType ||
      testInfo.project.use?.browserName ||
      testInfo.project.name;
    await use(new LoginPage(page, browserName));
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
