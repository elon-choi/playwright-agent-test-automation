# Pages 준비 후 다음 단계 (상세 가이드)

GitHub Pages가 켜졌다면, 아래 순서대로 사용하면 됩니다.

---

## 1. 일상적인 사용 흐름 (한 번에 보기)

| 순서 | 할 일 | 어디서 |
|------|--------|--------|
| 1 | 테스트 실행 트리거 | main에 push **또는** Actions에서 Run workflow |
| 2 | 실행 끝날 때까지 대기 | Actions 탭에서 Run 클릭 → test / deploy-report-history 상태 확인 |
| 3 | 이력 페이지에서 결과 확인 | https://elon-choi.github.io/playwright-agent-test-automation/ 접속 → 표에서 Run 클릭 |

---

## 2. 이력이 쌓이게 하기 (최초 1회 또는 필요할 때)

**deploy-report-history** job이 성공해야 Pages에 Run이 한 줄씩 추가됩니다.

### 2-1. 테스트 실행 트리거

**방법 A: main에 push**

- 로컬에서 커밋 후 `git push origin main` 하면 워크플로가 자동 실행됩니다.
- 기능/버그 수정 후 push할 때마다 한 Run이 추가됩니다.

**방법 B: 수동 실행 (코드 변경 없이)**

1. 저장소 **Actions** 탭 이동.
2. 왼쪽에서 **Playwright Tests** 선택.
3. 오른쪽 상단 **Run workflow** → Branch **main** 확인 → **Run workflow** 클릭.
4. 목록 맨 위에 새 Run이 생기면 실행된 것입니다.

### 2-2. Run 상태 확인

1. **Actions** 탭에서 맨 위 **Run** 클릭.
2. **test**: 실패(빨간 X)여도 **deploy-report-history**는 실행됩니다. (아티팩트는 `if: always()` 로 업로드됨)
3. **deploy-report-history**가 **초록 체크**면 해당 Run의 리포트가 Pages에 반영된 것입니다.
4. 1~2분 뒤 **이력 페이지**를 새로고침하면 새 Run이 표에 보입니다.

### 2-3. 이력 페이지에서 확인

1. **https://elon-choi.github.io/playwright-agent-test-automation/** 접속.
2. 표에서 **날짜**, **시각**, **Run** 링크, **총계/통과/실패/스킵**, **소요** 확인.
3. **Run** 열(또는 Run ID) 클릭 → 해당 시점의 Playwright 상세 리포트(스크린샷·트레이스 등)로 이동.

---

## 3. 주기적으로 할 수 있는 것

### 3-1. 오전/오후 등 정해진 시간에 이력 남기기

- **main에 push**가 트리거이므로, 예를 들어:
  - 매일 오전에 빈 커밋으로 push하거나,
  - **Actions** → **Run workflow**를 수동으로 실행하면,
  같은 날 여러 Run이 쌓여서 **요일별·오전/오후** 구분이 됩니다.
- 슬랙 알림이 설정돼 있으면 `test:ci` 결과와 함께 Run URL을 공유할 수도 있습니다.

### 3-2. 팀과 공유

- **이력 페이지 URL** 하나만 알려 주면 됩니다.  
  `https://elon-choi.github.io/playwright-agent-test-automation/`
- 새로 고침하면 최신 Run 목록이 보이고, 원하는 Run을 클릭해 상세 결과를 볼 수 있습니다.
- (선택) 슬랙 알림 메시지에 이 URL을 넣어 두면, 실패 시 “상세는 여기서 확인” 안내가 가능합니다.

### 3-3. 실패 Run만 골라서 보기

- 이력 페이지 표에서 **실패** 열 숫자가 1 이상인 Run을 클릭하면, 해당 시점의 실패 케이스·스크린샷을 바로 확인할 수 있습니다.
- **Actions** Artifacts에서 `playwright-report` / `allure-report` 를 받아 볼 수도 있습니다.

---

## 4. test job이 실패(빨간 X)일 때 (선택)

- **전체 워크플로**는 test가 실패하면 빨간 X로 끝나지만, **deploy-report-history**는 그대로 돌아가서 **실패한 Run의 리포트도** Pages에 올라갑니다.
- **빨간 X를 없애고 싶다면**: Actions에서 해당 Run → **test** job → **Run Playwright tests** 단계 로그를 열어, 어떤 시나리오/에러로 실패했는지 확인한 뒤 수정하면 됩니다.
- 자세한 확인 방법은 `docs/ACTIONS_TROUBLESHOOTING.md` 참고.

---

## 5. 선택적으로 해 볼 만한 것

| 항목 | 내용 |
|------|------|
| **슬랙에 이력 URL 넣기** | `scripts/notify-slack.ts` 등에서 메시지에 `https://elon-choi.github.io/playwright-agent-test-automation/` 링크를 추가하면, 실패/성공 알림과 함께 “이력 보기” 링크를 줄 수 있음. |
| **이력 보관 개수** | 현재는 Run이 계속 쌓입니다. 나중에 오래된 Run만 정리하고 싶다면, deploy 단계에서 `report-site/reports` 의 오래된 폴더를 삭제하는 스크립트를 넣을 수 있음. |
| **로컬에서 이력 표 미리보기** | `report-site` 디렉터리에 Run 폴더를 넣고 `REPORT_SITE=report-site node scripts/generate-report-index.mjs` 실행 후 `report-site/index.html` 을 브라우저로 열면, Pages와 같은 형태로 미리 볼 수 있음. |

---

## 6. 체크리스트 요약

- [ ] **한 번** main에 push 또는 Run workflow로 워크플로 실행.
- [ ] **deploy-report-history** 가 초록 체크인지 확인.
- [ ] **이력 페이지** 접속 후 표에 Run이 보이는지 확인.
- [ ] Run 한 개 클릭해서 상세 Playwright 리포트가 열리는지 확인.
- (선택) 팀에 이력 페이지 URL 공유.
- (선택) test 실패 원인 확인 후 수정해 워크플로를 녹색으로 유지.

이후에는 **main에 push하거나 Run workflow를 돌릴 때마다** 자동으로 이력이 쌓이므로, 위 URL만 북마크해 두고 필요할 때 열어 보면 됩니다.
