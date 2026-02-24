# 로컬/UI 모드 실행 결과를 리포트 페이지에 반영하는 방법

[실행 이력 페이지](https://elon-choi.github.io/playwright-agent-test-automation/)는 **기본적으로 CI(GitHub Actions)가 실행·배포할 때만** 갱신됩니다.  
로컬에서 테스트만 돌리거나 UI 모드로 특정 섹션만 돌려도, 그 결과는 자동으로 페이지에 올라가지 않습니다.

아래 두 가지 중 하나를 선택하면 됩니다.

---

## 방법 1: CI로 실행해서 이력에 남기기

**리포트 페이지에 기록이 쌓이게 하려면, 테스트를 GitHub Actions에서 한 번 실행**하면 됩니다.

1. GitHub 저장소 → **Actions** 탭
2. 왼쪽에서 **"Playwright Tests"** 워크플로 선택
3. **"Run workflow"** → 브랜치 `main` 선택 후 **"Run workflow"** 실행
4. 워크플로가 끝나면(테스트 + 배포까지) 리포트 페이지가 갱신되고, 새 Run이 표에 추가됨

- **main에 push**해도 같은 워크플로가 돌면서 이력이 갱신됨  
- 특정 시나리오만 돌리고 싶다면, 워크플로에서 `npm run test` 대신  
  `npx playwright test --grep "콘텐츠홈"` 처럼 옵션을 바꾸는 식으로 조정할 수 있음

---

## 방법 2: 로컬(또는 UI 모드) 실행 후, 결과만 페이지에 올리기

로컬에서 이미 테스트를 돌렸다면, **그 결과를 그대로 사용해서** 리포트 페이지에 Run 하나를 추가할 수 있습니다.

### 전제 조건

- 방금 로컬(또는 UI 모드)로 테스트를 실행한 상태
- 아래 중 **최소 하나**가 존재해야 함  
  - `playwright-report/`  
  - `test-results/results.json`  
  - `allure-results/*-result.json`
- **gh-pages 브랜치에 push할 수 있는 권한** (본인 저장소거나 push 권한이 있어야 함)

### 순서

1. **테스트 실행**  
   - UI 모드: `npm run test:ui` 후 원하는 섹션/시나리오만 실행  
   - 또는 터미널: `npm run test` 또는 `npx playwright test --grep "콘텐츠홈"` 등
2. 실행이 끝난 뒤, **로컬 결과를 페이지에 반영**  
   ```bash
   npm run publish:local-report
   ```
3. 스크립트가 하는 일  
   - 현재 시각으로 Run ID 생성  
   - `playwright-report` → report-site에 복사  
   - `allure-results` 또는 `test-results`로 총계/통과/실패 등 요약 생성  
   - 이력용 index.html 갱신  
   - **gh-pages 브랜치**에 커밋 후 push
4. 1–2분 후 **리포트 페이지 새로고침**  
   - https://elon-choi.github.io/playwright-agent-test-automation/  
   - 맨 위에 방금 올린 Run이 보이면 성공

### 주의사항

- `publish:local-report`는 **현재 브랜치를 잠시 벗어나 gh-pages만 푸시**한 뒤, 다시 원래 브랜치로 돌아옵니다.
- **로컬에만 있는 변경(커밋 안 된 코드)**이 있다면, 스크립트 실행 전에 stash 하거나 브랜치를 정리해 두는 편이 안전합니다.
- push 권한이 없으면 `git push origin gh-pages` 단계에서 실패합니다.  
  본인 저장소가 아니면 **방법 1(CI 실행)**을 사용하는 것이 좋습니다.

---

## 요약

| 목적 | 사용할 방법 |
|------|-------------|
| CI로 돌린 결과만 이력에 남기면 됨 | **방법 1**: Actions에서 "Playwright Tests" Run workflow 또는 main에 push |
| 로컬/UI 모드로 돌린 결과를 이력 페이지에 올리고 싶음 | **방법 2**: 테스트 실행 후 `npm run publish:local-report` |

두 방법 모두 **같은 이력 페이지**에 Run이 추가되며, 표에서 Run을 클릭하면 해당 Run의 상세 리포트(Playwright HTML 리포트)를 볼 수 있습니다.
