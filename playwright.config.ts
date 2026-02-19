import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import dotenv from "dotenv";

dotenv.config();

// BDD 설정: feature/step 파일 경로 지정
const testDir = defineBddConfig({
  features: [
    "features/kpa-008.feature",
    "features/kpa-009.feature",
    "features/kpa-010.feature",
    "features/kpa-011.feature",
    "features/kpa-012.feature",
    "features/kpa-013.feature",
    "features/kpa-048.feature",
    "features/kpa-059.feature",
    "features/kpa-061.feature",
    "features/kpa-065.feature",
    "features/kpa-091.feature",
    "features/kpa-092.feature",
    "features/kpa-099.feature",
    "features/kpa-101.feature",
    "features/kpa-103.feature"
  ],
  steps: [
    "steps/fixtures.ts",
    "steps/common.navigation.steps.ts",
    "steps/common.auth.steps.ts",
    "steps/common.episode.steps.ts",
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
    "steps/kpa-103.steps.ts"
  ]
});

export default defineConfig({
  // BDD 설정을 테스트 디렉터리로 연결
  testDir,
  // 시나리오를 순차 실행
  workers: 1,
  fullyParallel: false,
  // 기본 리포터는 HTML
  reporter: "html",
  timeout: 60000,
  use: {
    headless: false,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    actionTimeout: 20000,
    navigationTimeout: 30000
  },
  // Playwright 번들 Chromium 사용 (.playwright-browsers). 시스템 Chrome은 정책/권한 이슈로 UI 실행 실패함
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--disable-features=LocalNetworkAccess"]
        }
      }
    }
  ]
});
