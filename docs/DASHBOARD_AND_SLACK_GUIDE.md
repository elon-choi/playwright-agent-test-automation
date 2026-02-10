# 테스트 결과 대시보드 + 슬랙 알림 구성 가이드

구성 방향과 선택지만 정리한 문서입니다. 실제 구현 시 이 순서로 적용하면 됩니다.

---

## 1. 테스트 결과 확인용 대시보드

### 옵션 A: Playwright HTML 리포트 (가장 단순)

- **이미 사용 중:** `playwright.config.ts`에 `reporter: "html"` 이 있으므로, `npm run test` 실행 후 `playwright-report/` 가 생성됩니다.
- **로컬에서 보기:** `npx playwright show-report` 로 브라우저에서 열기.
- **대시보드처럼 쓰려면:**
  - **로컬:** 실행 후 `show-report` 를 스크립트에 넣어 두고, 리포트 폴더를 브라우저로 열어두면 “간이 대시보드”처럼 사용 가능.
  - **팀 공유:** CI(GitHub Actions 등)에서 테스트 실행 후 `playwright-report/` 를 **아티팩트로 업로드**하고, “Workflow 실행 → Artifacts에서 HTML 리포트 다운로드 → 로컬에서 show-report” 로 확인. 또는 **정적 호스팅**(Netlify, GitHub Pages, S3 등)에 매 빌드마다 리포트를 올려서 “항상 최신 결과” URL 하나로 공유하는 방식.

**구성 요약:**  
테스트 실행 → `playwright-report` 생성 → 아티팩트 업로드 또는 정적 호스팅 배포 → 해당 URL을 “테스트 결과 대시보드”로 사용.

---

### 옵션 B: Allure 리포트 (대시보드 느낌)

- **역할:** Allure는 테스트 결과를 수집해 트렌드·통과율·실패 목록을 보기 좋게 보여주는 대시보드형 리포트입니다.
- **구성 흐름:**
  1. `@playwright/test` 에서 **Allure 리포터** 추가 (예: `allure-playwright` 또는 Playwright 공식/커뮤니티 연동).
  2. 테스트 실행 시 Allure 결과 디렉터리(`allure-results/` 등)에 JSON/XML 생성.
  3. `allure generate` / `allure open` 으로 로컬 대시보드 확인.
  4. **상시 대시보드:** CI에서 `allure-results` 를 아티팩트로 보관하고, 별도 서버에서 `allure serve` 또는 Allure Report 서버를 돌려 URL로 공개.

**구성 요약:**  
Playwright reporter에 Allure 추가 → CI에서 결과 수집 → Allure 서버/정적 리포트 배포 → 하나의 URL로 “테스트 대시보드” 제공.

---

### 옵션 C: GitHub Actions + 리포트 아티팩트 (CI 기준)

- **역할:** “대시보드”라기보다 “매 실행 결과를 한 곳에서 다운로드해 볼 수 있게” 하는 방식입니다.
- **구성 흐름:**
  1. GitHub Actions 워크플로에서 `npm run test` (또는 `npx playwright test`) 실행.
  2. `playwright-report/` (및 필요 시 `test-results/`) 를 `actions/upload-artifact` 로 업로드.
  3. 실패 시에만 리포트 업로드하도록 조건 걸기 (선택).
  4. 팀원은 Actions 탭 → 해당 Run → Artifacts에서 “Playwright report” 다운로드 후 `npx playwright show-report <path>` 로 확인.

**구성 요약:**  
CI에서 테스트 실행 → HTML(또는 Allure) 리포트를 아티팩트로 업로드 → “테스트 결과 확인”을 Run별 아티팩트로 제공. “대시보드”가 필요하면 여기에 옵션 B(Allure)를 붙여 상시 URL을 두는 식으로 확장 가능.

---

### 추천 (우선순위)

1. **당장:** 옵션 A 유지 + CI에서 HTML 리포트 아티팩트 업로드(옵션 C). `show-report` 로 “결과 확인 가능한 대시보드” 역할을 로컬/다운로드 기반으로 수행.
2. **대시보드 URL 하나로 보고 싶을 때:** 옵션 B(Allure) 도입 후 CI에서 Allure 결과 수집·배포해 상시 URL 제공.
3. **외부 서비스:** ReportPortal, Zephyr 등 외부 대시보드 서비스를 쓰는 방법도 있으나, 설정·비용이 들므로 필요 시 검토.

---

## 2. 테스트 결과를 슬랙으로 전송

### 공통 전제

- **Slack Incoming Webhook** 또는 **Slack Bot Token** 이 필요합니다.
- Webhook: 슬랙 채널에 “Incoming Webhooks” 앱 추가 후 Webhook URL 발급.
- Bot: Slack App 생성 후 `chat:write` 등 권한 부여 후 Bot Token 사용.

---

### 방식 1: Playwright 커스텀 리포터에서 슬랙 전송

- **역할:** 테스트가 끝날 때마다 Playwright 리포터가 결과를 모아서 슬랙에 한 번 전송.
- **구성:**
  1. `playwright.config.ts` 의 `reporter` 배열에 커스텀 리포터 추가 (예: `[["html"], ["./reporters/slack-reporter.js"]]`).
  2. 커스텀 리포터에서 `onEnd(testConfig, result)` (또는 동일한 시그니처) 를 구현하고, `result` 에서 성공/실패 개수·실패한 테스트 목록 등을 추출.
  3. 해당 내용을 Slack Block Kit 또는 간단한 텍스트로 포맷한 뒤, `fetch(SLACK_WEBHOOK_URL, { method: "POST", body: JSON.stringify({ text: "..." }) })` 로 전송.
- **환경 변수:** `SLACK_WEBHOOK_URL` (또는 `SLACK_BOT_TOKEN` + 채널 ID) 를 `.env` 에 두고, 리포터에서만 사용.

**장점:** 테스트 러너와 한 번에 묶여 있어, 로컬/CI 구분 없이 “테스트 끝나면 슬랙”으로 통일 가능.  
**단점:** 리포터 코드를 직접 작성·유지보수해야 함.

---

### 방식 2: 테스트 종료 후 스크립트에서 슬랙 전송

- **역할:** `npm run test` 뒤에 “결과 요약 스크립트”를 실행하고, 그 스크립트가 슬랙에 POST.
- **구성:**
  1. Playwright에서 **JSON 리포터** 추가 (예: `reporter: [["html"], ["json", { outputFile: "test-results/summary.json" }]]`). 또는 JUnit XML 등 결과 파일을 출력하도록 설정.
  2. `scripts/notify-slack.ts` (또는 .js) 같은 스크립트를 만들어, 위 결과 파일을 읽어서 성공/실패 수·실패한 시나리오 이름 등을 파싱.
  3. 그 내용을 Slack 메시지로 포맷한 뒤 Webhook(또는 Bot API)으로 전송.
  4. `package.json` 에서 `"test:ci": "playwright test && node scripts/notify-slack.js"` 처럼 “테스트 → 슬랙 알림” 한 번에 실행되도록 연결.
- **CI:** 동일 스크립트를 CI 마지막 단계에서 실행. `SLACK_WEBHOOK_URL` 은 CI 환경 변수(Secrets)에 등록.

**장점:** Playwright 리포터를 건드리지 않고, 기존 리포트(HTML/JSON/JUnit)만 활용해 슬랙 전송 로직을 분리할 수 있음.  
**단점:** 결과 파일 경로·포맷이 바뀌면 스크립트 수정 필요.

---

### 방식 3: GitHub Actions에서만 슬랙 전송

- **역할:** “CI에서 돌린 테스트 결과만” 슬랙으로 보냄. 로컬 실행에는 슬랙 전송 없음.
- **구성:**
  1. 워크플로에서 `playwright test` 실행.
  2. JUnit XML(또는 JSON) 리포터로 결과 파일 생성.
  3. “Slack notification” 액션(예: `slackapi/slack-github-action`) 또는 `curl`/`fetch` 로 Webhook에 결과 요약 전송. (성공/실패 수, 실패한 테스트 이름, 워크플로 URL 등)
  4. `SLACK_WEBHOOK_URL` (또는 Bot Token) 은 GitHub Secrets에 등록.

**장점:** 로컬에는 영향 없고, CI 결과만 슬랙으로 받을 수 있음.  
**단점:** 로컬에서 테스트만 돌릴 때는 슬랙 알림이 가지 않음.

---

### 슬랙 메시지 내용 예시

- **제목:** `[Playwright] 카카오페이지 테스트 결과`
- **본문:**  
  - 통과 수 / 실패 수 / 스킵 수  
  - 실패한 시나리오 이름 목록 (최대 N개)  
  - (CI인 경우) 워크플로 Run URL, 리포트 아티팩트 링크  
- **실패 시만 보내기:** exit code가 0이 아니거나 실패 수 > 0 일 때만 Webhook 호출하도록 조건 처리하면 채널이 덜 시끄러움.

---

### 추천 (우선순위)

1. **빠르게:** 방식 2 또는 3. JSON/JUnit 리포터 추가 + “테스트 후 한 번” 슬랙 전송 스크립트(또는 CI 단계). Webhook URL만 준비하면 됨.
2. **모든 실행(로컬+CI)에 동일하게:** 방식 1. 커스텀 리포터에서 `onEnd` 시 슬랙 전송. `SLACK_WEBHOOK_URL` 이 없으면 스킵하도록 하면 로컬에서도 안전하게 사용 가능.

---

## 3. 한 번에 적용하는 순서 제안

1. **리포터 보강**  
   - `playwright.config.ts` 에서 `reporter: [["html"], ["list"], ["json", { outputFile: "test-results/results.json" }]]` 처럼 list·json 추가. (대시보드/슬랙 모두 결과 파일 활용)
2. **대시보드**  
   - CI에서 `playwright-report` 아티팩트 업로드. 필요하면 Allure 도입 후 상시 URL 구성.
3. **슬랙**  
   - `SLACK_WEBHOOK_URL` 발급 후, “테스트 종료 후 스크립트” 또는 “커스텀 리포터” 중 하나로 결과 요약 전송. CI만 알림이면 GitHub Actions 단계에서 전송.

이 문서는 코드 수정 없이 **구성 방향**만 정리한 것입니다. 실제 reporter 코드·스크립트·CI YAML 예시가 필요하면 그다음 단계에서 파일 단위로 작성하면 됩니다.

---

## 4. 슬랙 결과가 안 올 때 확인 사항

현재 구현은 **방식 2(테스트 종료 후 스크립트)** + **CI에서 notify-slack 단계** 로 동작합니다.

### 1) 실행 방법

- **로컬에서 전체 시나리오 실행 후 슬랙에 보내려면** 반드시 아래를 사용해야 합니다.
  ```bash
  npm run test:ci
  ```
- `npm run test` 또는 `npx playwright test`만 실행하면 **notify-slack이 호출되지 않아** 슬랙으로 결과가 가지 않습니다.
- `test:ci`는 테스트 실행 → 종료 코드 저장 → `notify-slack` 실행 순서로 동작합니다.

### 2) 환경 변수

- **로컬:** 프로젝트 루트 `.env` 에 다음이 있어야 합니다.
  ```bash
  SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
  ```
- 비어 있거나 없으면 `notify-slack` 실행 시 콘솔에  
  `"SLACK_WEBHOOK_URL이 비어 있어 슬랙 전송을 건너뜁니다."` 만 출력하고 전송하지 않습니다.
- **CI(GitHub Actions):** 리포지토리 **Settings → Secrets and variables → Actions** 에 `SLACK_WEBHOOK_URL` 시크릿이 등록되어 있어야 워크플로의 "Notify Slack" 단계에서 전송됩니다.

### 3) 결과 파일

- 슬랙 메시지는 `test-results/results.json` (Playwright JSON 리포터 출력)을 읽어 만듭니다.
- `playwright.config.ts` 에 이미 `["json", { outputFile: "test-results/results.json" }]` 가 있으므로, `npm run test` 또는 `test:ci` 실행 후에는 해당 파일이 생성됩니다. 이 파일이 없으면 실패/통과 수가 0으로 요약될 수 있습니다.
