# 회사/개인 맥북 두 환경에서 작업할 때

같은 저장소를 평일엔 회사 맥북, 주말엔 개인 맥북에서 쓸 때 충돌을 막고 환경을 맞추기 위한 루틴이다.

---

## 1. 작업 시작 전 (매번 필수)

다른 쪽에서 push 한 내용이 있으면 먼저 받아야 한다.

1. **코드 동기화**
   ```bash
   git pull
   ```
2. **의존성 동기화**  
   `package.json` / `package-lock.json`이 바뀌었을 수 있으므로:
   ```bash
   npm ci
   ```
   (`npm install` 대신 `npm ci`를 쓰면 lock 파일 기준으로 두 환경이 동일하게 맞춰진다.)
3. **환경 변수 확인**  
   `.env`는 Git에 포함되지 않는다.  
   다른 PC에서 새 키(예: ZEROSTEP_TOKEN, 계정 정보)를 추가했다면 이 PC의 `.env`도 수동으로 동일하게 맞춰 둔다.

---

## 2. 작업 종료 후

1. **커밋 후 푸시**
   ```bash
   git add .
   git commit -m "작업 내용 요약"
   git push origin main
   ```
2. **선택**  
   GitHub 웹에서 push가 반영됐는지 한 번 확인해 두면, 네트워크 오류로 미반영된 경우를 줄일 수 있다.

---

## 3. Pull 깜빡하고 작업한 경우

이미 로컬에서 수정한 뒤에야 pull이 필요하다는 걸 알았을 때.

- **하지 말 것:** `git push --force`
- **할 것:**
  1. `git stash` (작업 내용 임시 저장)
  2. `git pull` (원격 코드 받기)
  3. `git stash pop` (작업 내용 다시 적용)
  4. 충돌이 나면 해당 파일을 열어 해결한 뒤 `git add` → `git commit` → `git push`

---

## 4. Git 말고 환경 때문에 생기는 차이

코드는 Git으로 맞지만, 아래는 각 PC에서 따로 맞춰 줘야 한다.

| 항목 | 설명 | 대응 |
|------|------|------|
| `.env` | Git에 없음. API 키, 계정 등 | 다른 PC에서 바꾼 값이 있으면 이 PC `.env`도 수동 동기화 |
| `node_modules` | `git pull`만으로는 갱신 안 됨 | pull 후 `npm ci` 실행 |
| Playwright 브라우저 | 패키지 업데이트 시 엔진 버전이 달라질 수 있음 | 브라우저 실행 오류 시 `npx playwright install` 실행 |
| `.auth/` (로그인 세션) | Git에 없음. 로그인 상태 저장 | **새 PC·처음 쓸 때** `00-login.feature`에서 "미인증 계정으로 로그인 성공" 시나리오를 UI 모드로 한 번 실행해 두면 `.auth/`가 생성됨. 세션 만료 시 같은 방법으로 다시 실행 |

---

## 5. 요약 체크리스트

**이 PC에서 처음 프로젝트 쓸 때 (또는 로그인 필요 시나리오가 실패할 때)**

- [ ] `.env` 설정 (회사와 동일한 키/계정)
- [ ] `npm ci`
- [ ] `npm run test:ui` 로 실행 후, **00-login.feature**에서 "미인증 계정으로 로그인 성공" 시나리오 한 번 실행 → `.auth/` 생성됨

**시작할 때**

- [ ] `git pull`
- [ ] `npm ci`
- [ ] `.env` 변경 여부 확인

**끝낼 때**

- [ ] `git add .` → `git commit -m "..."` → `git push origin main`
- [ ] (권장) GitHub에서 push 반영 확인

이 순서만 지키면 두 환경에서 파일 꼬임과 환경 차이는 거의 막을 수 있다.
