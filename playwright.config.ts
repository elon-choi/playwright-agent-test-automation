import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import dotenv from "dotenv";

dotenv.config();

// BDD 설정: feature/step 파일 경로 지정
const testDir = defineBddConfig({
  features: "features/kpa-048.feature",
  steps: ["steps/fixtures.ts", "steps/kpa-048.steps.ts"]
});

export default defineConfig({
  // BDD 설정을 테스트 디렉터리로 연결
  testDir,
  // 기본 리포터는 HTML
  reporter: "html",
  use: {
    // UI 모드에서 헤드풀(창 표시) 강제
    headless: false,
    // 실패 시 스크린샷 저장
    screenshot: "only-on-failure",
    // 첫 재시도 시 트레이스 저장
    trace: "on-first-retry"
  },
  // 기본 실행 브라우저 설정
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    },
    {
      name: "chromium-ai",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
