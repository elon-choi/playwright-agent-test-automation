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
  steps: "steps/*.ts"
});

// CTO 시연용: 스텁만 있는 시나리오 제외. 정상 구현된 시나리오만 UI 모드에서 실행되도록 함
// 스텁(waitForTimeout 위주) 시나리오만 포함. 062,063,071,081,082,085,097,112 등 실제 구현 있는 번호는 제외
const STUB_KPA_NUMBERS: number[] = [];
const STUB_TEST_IGNORE = STUB_KPA_NUMBERS.map((n) =>
  `**/kpa-${String(n).padStart(3, "0")}.feature.spec.js`
);
// Cursor/IDE에서 시스템 Chrome 사용 시 macOS에서 _RegisterApplication abort 크래시 발생
// 로컬에서 시스템 Chrome 쓰려면 PLAYWRIGHT_USE_SYSTEM_CHROME=1 로 실행
const useChannelChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "1";
// 프로젝트에 chrome-mac-arm64만 설치된 경우 Node가 x64로 동작하면 Playwright가 x64 경로를 찾음.
// Apple Silicon에서 프로젝트 브라우저만 사용할 때는 PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=mac15-arm64 권장.
const fs = require("node:fs");
const browsersDir = process.env.PLAYWRIGHT_BROWSERS_PATH
  ? path.resolve(process.cwd(), process.env.PLAYWRIGHT_BROWSERS_PATH)
  : path.join(__dirname, ".playwright-browsers");

function findBundledChromium(baseDir: string): string | null {
  if (!fs.existsSync(baseDir)) return null;
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  const chromiumDir = entries.find((d) => d.isDirectory() && d.name.startsWith("chromium-"));
  if (!chromiumDir) return null;
  const subdir = path.join(baseDir, chromiumDir.name);
  const candidates = [
    path.join(subdir, "chrome-mac-arm64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing"),
    path.join(subdir, "chrome-mac", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing")
  ];
  for (const exe of candidates) {
    if (fs.existsSync(exe)) return exe;
  }
  return null;
}

const bundledChromiumPath = findBundledChromium(browsersDir);
const useBundledChromiumPath = !!bundledChromiumPath;

// 모든 프로젝트에서 공유하는 Chrome 설정
const chromeUse = {
  ...devices["Desktop Chrome"],
  ...(useChannelChrome ? { channel: "chrome" as const } : {}),
  ...(useBundledChromiumPath ? { executablePath: bundledChromiumPath } : {}),
  launchOptions: {
    args: ["--disable-features=LocalNetworkAccess"]
  }
};

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
    actionTimeout: 40000,
    navigationTimeout: 35000,
    ...(useBundledChromiumPath ? { executablePath: bundledChromiumPath } : {})
  },
  testIgnore: [],
  projects: [
    {
      name: "chromium",
      testMatch: ["**/pcw/**/*.feature.spec.js"],
      testIgnore: ["**/adult/**", "**/00-login.feature.spec.js", ...STUB_TEST_IGNORE],
      dependencies: ["login"],
      use: chromeUse
    },
    {
      name: "chromium-ci",
      // CI 스모크 테스트: 각 영역 대표 시나리오 10건 (비로그인/회원/검색/GNB/콘텐츠홈/뷰어)
      testMatch: [
        "**/kpa-008.feature.spec.js",  // 비로그인 - 프로필 → 로그인 이동
        "**/kpa-002.feature.spec.js",  // 회원 - 로그인 성공 확인
        "**/kpa-027.feature.spec.js",  // 검색 - 검색 → 작품 상세 이동
        "**/kpa-029.feature.spec.js",  // 검색 - 검색 결과 없음
        "**/kpa-048.feature.spec.js",  // GNB - 배너 UI/동작
        "**/kpa-059.feature.spec.js",  // GNB - 요일연재 메뉴
        "**/kpa-061.feature.spec.js",  // GNB - 오늘신작 이동
        "**/kpa-088.feature.spec.js",  // 콘텐츠홈 - 기다무 팝업
        "**/kpa-099.feature.spec.js",  // 콘텐츠홈 - 정보 탭 UI
        "**/kpa-111.feature.spec.js",  // 뷰어 - 여백 옵션
      ],
      dependencies: ["login"],
      use: chromeUse
    },
    {
      name: "login",
      testMatch: ["**/00-login.feature.spec.js"],
      use: chromeUse
    },
    {
      name: "chromium-remaining",
      testMatch: STUB_KPA_NUMBERS.map((n) => `**/kpa-${String(n).padStart(3, "0")}.feature.spec.js`),
      use: chromeUse
    },
    {
      name: "chromium-mw",
      testMatch: ["**/mw/**/*.feature.spec.js"],
      use: chromeUse
    },
    {
      name: "chromium-085",
      testMatch: ["**/pcw/06-콘텐츠홈/kpa-085.feature.spec.js"],
      timeout: 300000,
      dependencies: ["login"],
      use: chromeUse
    }
  ]
});
