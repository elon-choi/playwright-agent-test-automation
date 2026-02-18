# Actions 워크플로 실패 시 확인 방법

빨간 X가 뜨는 이유는 **test** job 실패 또는 **deploy-report-history** job 실패 둘 중 하나일 수 있습니다.

---

## 1. 어디서 실패했는지 확인하기

1. **Actions** 탭에서 빨간 X가 있는 **Run** 하나를 클릭합니다.
2. 아래에 **test**, **deploy-report-history** 두 개의 job이 보입니다.
3. **빨간 X가 붙은 job**을 클릭합니다.
4. 왼쪽 **Steps**에서 어떤 단계가 빨간 X인지 확인합니다.
5. 해당 단계를 클릭하면 **로그**가 나옵니다. 맨 아래 에러 메시지를 봅니다.

---

## 2. 원인별 대응

### (1) test job에서 실패

- **증상**: "Run Playwright tests" 단계가 빨간 X.
- **의미**: Playwright 테스트 실행 결과가 하나라도 실패했거나, 타임아웃/환경 오류로 실패한 경우입니다. **CI가 실패하는 것은 정상**입니다.
- **대응**:
  - 로그에서 실패한 시나리오/에러 메시지를 확인합니다.
  - 로컬에서 `npm run test` 로 재현 여부를 확인합니다.
  - 네트워크·타임아웃이면 재실행만 해 보거나, 실패한 테스트를 수정합니다.
- **참고**: test가 실패해도 **deploy-report-history**는 실행되며, 실패한 Run의 리포트도 gh-pages에 올라갑니다. (아티팩트는 `if: always()` 로 업로드됨)

### (2) deploy-report-history job에서 실패

- **증상**: "Deploy to GitHub Pages" 단계가 빨간 X. 로그에 `refusing to allow a Personal Access Token to create or update workflow` 또는 `Permission denied`, `403` 등이 보일 수 있습니다.
- **의미**: `GITHUB_TOKEN` 이 저장소에 쓰기 권한이 없어 gh-pages 브랜치에 push하지 못한 경우입니다.
- **대응**:
  1. 저장소 **Settings** → **Actions** → **General** 로 이동합니다.
  2. 아래로 내려 **Workflow permissions** 를 찾습니다.
  3. **"Read and write permissions"** 를 선택하고 **Save** 합니다.
  4. **Actions** 탭에서 해당 워크플로를 **Re-run all jobs** 또는 **Run workflow** 로 다시 실행합니다.

### (3) Download Playwright report / Download test results 에서 실패

- **증상**: "Download Playwright report" 또는 "Download test results" 단계가 빨간 X.
- **의미**: test job이 아티팩트를 올리기 전에 중단됐거나(예: npm ci, pw:install 실패), 아티팩트 이름이 맞지 않는 경우입니다.
- **대응**: 먼저 **test** job을 열어 **Run Playwright tests** 이전 단계에서 실패했는지 확인합니다. test job 초반이 실패했으면 그 원인(의존성, 브라우저 설치 등)을 해결해야 합니다.

---

## 3. 요약

| 빨간 X 위치 | 의미 | 할 일 |
|-------------|------|--------|
| **test** | 테스트 실패 또는 환경 오류 | 로그로 실패한 단계·테스트 확인 후 수정 또는 재실행 |
| **deploy-report-history** | gh-pages push 권한 부족 등 | Settings → Actions → Workflow permissions → Read and write 후 재실행 |

위 순서대로 **실패한 Run → 실패한 job → 실패한 step → 로그**를 보면 원인을 정확히 알 수 있습니다.
