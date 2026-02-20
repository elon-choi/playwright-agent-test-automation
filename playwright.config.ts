import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { pcwPaths, mwPaths } = require("./scripts/generated-feature-paths.json");

// BDD 설정: feature 경로는 pcw/mw 기능별 폴더 구조 기준 (00-login 선두 유지)
const testDir = defineBddConfig({
  features: [...pcwPaths, ...mwPaths],
  steps: [
    "steps/fixtures.ts",
    "steps/common.navigation.steps.ts",
    "steps/common.auth.steps.ts",
    "steps/login.steps.ts",
    "steps/common.episode.steps.ts",
    "steps/kpa-002.steps.ts",
    "steps/kpa-003.steps.ts",
    "steps/kpa-004.steps.ts",
    "steps/kpa-005.steps.ts",
    "steps/kpa-016.steps.ts",
    "steps/kpa-018.steps.ts",
    "steps/kpa-019.steps.ts",
    "steps/kpa-020.steps.ts",
    "steps/kpa-021.steps.ts",
    "steps/kpa-022.steps.ts",
    "steps/kpa-008.steps.ts",
    "steps/kpa-009.steps.ts",
    "steps/kpa-010.steps.ts",
    "steps/kpa-011.steps.ts",
    "steps/kpa-012.steps.ts",
    "steps/kpa-013.steps.ts",
    "steps/kpa-048.steps.ts",
    "steps/kpa-059.steps.ts",
    "steps/kpa-061.steps.ts",
    "steps/kpa-065.steps.ts",
    "steps/kpa-091.steps.ts",
    "steps/kpa-092.steps.ts",
    "steps/kpa-099.steps.ts",
    "steps/kpa-101.steps.ts",
    "steps/kpa-103.steps.ts",
    "steps/kpa-026.steps.ts",
    "steps/kpa-027.steps.ts",
    "steps/kpa-028.steps.ts",
    "steps/kpa-029.steps.ts",
    "steps/kpa-030.steps.ts",
    "steps/kpa-031.steps.ts",
    "steps/kpa-032.steps.ts",
    "steps/kpa-033.steps.ts",
    "steps/kpa-034.steps.ts",
    "steps/kpa-035.steps.ts",
    "steps/kpa-036.steps.ts",
    "steps/kpa-037.steps.ts",
    "steps/kpa-038.steps.ts",
    "steps/kpa-039.steps.ts",
    "steps/kpa-040.steps.ts",
    "steps/kpa-041.steps.ts",
    "steps/kpa-042.steps.ts",
    "steps/kpa-043.steps.ts",
    "steps/kpa-044.steps.ts",
    "steps/kpa-044-1.steps.ts",
    "steps/kpa-045.steps.ts",
    "steps/kpa-046.steps.ts",
    "steps/kpa-049.steps.ts",
    "steps/kpa-051.steps.ts",
    "steps/kpa-052.steps.ts",
    "steps/kpa-054.steps.ts",
    "steps/kpa-055.steps.ts",
    "steps/kpa-057.steps.ts",
    "steps/kpa-058.steps.ts",
    "steps/kpa-060.steps.ts",
    "steps/kpa-062.steps.ts",
    "steps/kpa-063.steps.ts",
    "steps/kpa-064.steps.ts",
    "steps/kpa-066.steps.ts",
    "steps/kpa-067.steps.ts",
    "steps/kpa-068.steps.ts",
    "steps/kpa-069.steps.ts",
    "steps/kpa-070.steps.ts",
    "steps/kpa-071.steps.ts",
    "steps/kpa-072.steps.ts",
    "steps/kpa-073.steps.ts",
    "steps/kpa-074.steps.ts",
    "steps/kpa-075.steps.ts",
    "steps/kpa-076.steps.ts",
    "steps/kpa-077.steps.ts",
    "steps/kpa-078.steps.ts",
    "steps/kpa-079.steps.ts",
    "steps/kpa-081.steps.ts",
    "steps/kpa-082.steps.ts",
    "steps/kpa-085.steps.ts",
    "steps/kpa-085-1.steps.ts",
    "steps/kpa-086.steps.ts",
    "steps/kpa-087.steps.ts",
    "steps/kpa-088.steps.ts",
    "steps/kpa-089.steps.ts",
    "steps/kpa-090.steps.ts",
    "steps/kpa-093.steps.ts",
    "steps/kpa-097.steps.ts",
    "steps/kpa-098.steps.ts",
    "steps/kpa-100.steps.ts",
    "steps/kpa-102.steps.ts",
    "steps/kpa-104.steps.ts",
    "steps/kpa-105.steps.ts",
    "steps/kpa-106.steps.ts",
    "steps/kpa-107.steps.ts",
    "steps/kpa-108.steps.ts",
    "steps/kpa-109.steps.ts",
    "steps/kpa-111.steps.ts",
    "steps/kpa-112.steps.ts",
    "steps/kpa-113.steps.ts",
    "steps/kpa-114.steps.ts",
    "steps/kpa-115.steps.ts",
    "steps/kpa-116.steps.ts",
    "steps/kpa-117.steps.ts",
    "steps/kpa-118.steps.ts",
    "steps/kpa-119.steps.ts",
    "steps/kpa-120.steps.ts",
    "steps/kpa-121.steps.ts",
    "steps/kpa-122.steps.ts",
    "steps/kpa-123.steps.ts",
    "steps/kpa-124.steps.ts",
    "steps/kpa-125.steps.ts",
    "steps/kpa-126.steps.ts",
    "steps/kpa-127.steps.ts",
    "steps/kpa-128.steps.ts",
    "steps/kpa-130.steps.ts",
    "steps/kpa-131.steps.ts",
    "steps/kpa-132.steps.ts",
    "steps/kpa-133.steps.ts",
    "steps/kpa-134.steps.ts",
    "steps/kpa-135.steps.ts",
    "steps/kpa-136.steps.ts",
    "steps/kpa-137.steps.ts"
  ]
});

// CTO 시연용: 스텁만 있는 시나리오 제외. 정상 구현된 시나리오만 UI 모드에서 실행되도록 함
// 스텁(waitForTimeout 위주) 시나리오만 포함. 062,063,071,081,082,085,097,112 등 실제 구현 있는 번호는 제외
const STUB_KPA_NUMBERS: number[] = [];
const STUB_TEST_IGNORE = STUB_KPA_NUMBERS.map((n) =>
  `**/kpa-${String(n).padStart(3, "0")}.feature.spec.js`
);
// 헤드리스(CI) 시 시스템 Chrome 사용 시 macOS에서 _RegisterApplication abort 크래시 발생 가능
const useChannelChrome = process.env.CI !== "true";
// CI 시 headless-shell(x64) 대신 번들 전체 Chromium(arm64) 사용 (executablePath로 우선)
const fs = require("node:fs");
const projectRoot = process.cwd();
const bundledChromiumPathByDir = path.join(
  __dirname,
  ".playwright-browsers",
  "chromium-1208",
  "chrome-mac-arm64",
  "Google Chrome for Testing.app",
  "Contents",
  "MacOS",
  "Google Chrome for Testing"
);
const bundledChromiumPathByCwd = path.join(
  projectRoot,
  ".playwright-browsers",
  "chromium-1208",
  "chrome-mac-arm64",
  "Google Chrome for Testing.app",
  "Contents",
  "MacOS",
  "Google Chrome for Testing"
);
const bundledChromiumPath = fs.existsSync(bundledChromiumPathByDir)
  ? bundledChromiumPathByDir
  : bundledChromiumPathByCwd;
const useBundledChromiumPath =
  process.env.CI === "true" && fs.existsSync(bundledChromiumPath);

export default defineConfig({
  // BDD 설정을 테스트 디렉터리로 연결
  testDir,
  // 시나리오를 순차 실행
  workers: 1,
  fullyParallel: false,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
    [
      "allure-playwright",
      {
        resultsDir: "allure-results",
        detail: true,
        suiteTitle: true
      }
    ]
  ],
  timeout: 90000,
  expect: { timeout: 10000 },
  use: {
    headless: process.env.CI === "true",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    actionTimeout: 25000,
    navigationTimeout: 35000
  },
  projects: [
    {
      name: "chromium",
      testMatch: ["**/pcw/**/*.feature.spec.js"],
      testIgnore: ["**/adult/**", ...STUB_TEST_IGNORE],
      use: {
        ...devices["Desktop Chrome"],
        ...(useChannelChrome ? { channel: "chrome" as const } : {}),
        ...(useBundledChromiumPath ? { executablePath: bundledChromiumPath } : {}),
        launchOptions: {
          args: ["--disable-features=LocalNetworkAccess"]
        }
      }
    },
    {
      name: "chromium-remaining",
      testMatch: STUB_KPA_NUMBERS.map((n) => `**/kpa-${String(n).padStart(3, "0")}.feature.spec.js`),
      use: {
        ...devices["Desktop Chrome"],
        ...(useChannelChrome ? { channel: "chrome" as const } : {}),
        ...(useBundledChromiumPath ? { executablePath: bundledChromiumPath } : {}),
        launchOptions: {
          args: ["--disable-features=LocalNetworkAccess"]
        }
      }
    },
    {
      name: "chromium-mw",
      testMatch: ["**/mw/**/*.feature.spec.js"],
      use: {
        ...devices["Desktop Chrome"],
        ...(useChannelChrome ? { channel: "chrome" as const } : {}),
        ...(useBundledChromiumPath ? { executablePath: bundledChromiumPath } : {}),
        launchOptions: {
          args: ["--disable-features=LocalNetworkAccess"]
        }
      }
    },
    {
      name: "chromium-085",
      testMatch: ["**/pcw/콘텐츠홈/kpa-085-1.feature.spec.js", "**/pcw/콘텐츠홈/kpa-085-2.feature.spec.js"],
      timeout: 300000,
      use: {
        ...devices["Desktop Chrome"],
        ...(useChannelChrome ? { channel: "chrome" as const } : {}),
        ...(useBundledChromiumPath ? { executablePath: bundledChromiumPath } : {}),
        launchOptions: {
          args: ["--disable-features=LocalNetworkAccess"]
        }
      }
    }
  ]
});
