# 오늘 목표 방향: 로그인 시나리오 확장 + 테스트 결과 확인 방법

코드 반영 없이 방향성만 정리한 문서입니다.

---

## 1. 로그인이 포함된 시나리오로 확장

### 현재 구조 요약

- **비로그인 시나리오 (현재 15개):**  
  `fixtures.ts`의 `skipAuthByFile`/`skipAuthByTitle`에 등록된 feature는 **저장된 로그인 상태 없이** 새 context로 실행됩니다. (예: KPA-008, 009, …, 103)
- **로그인 시나리오 (1개):**  
  `login.feature`는 **로그인 시나리오 전용**으로 인식됩니다. 실행 시 새 context를 쓰고, 시나리오 종료 후 **`.auth/storageState.json`에 로그인 상태를 저장**합니다.
- **그 외:**  
  위 두 경우가 아닌 feature는 **이미 저장된 `storageState.json`이 있어야** 실행됩니다. 없으면 "저장된 로그인 상태가 없습니다" 에러로 실패합니다.

### 로그인 포함 시나리오를 넣는 두 가지 방향

#### 방향 A: “로그인된 상태에서만 검증하는 시나리오” 추가

- **의미:** 시나리오 자체에서는 로그인 동작을 하지 않고, **이미 로그인된 상태(storage state)**를 전제로 동작을 검증합니다.
- **절차:**
  1. 새 feature 파일 추가 (예: `features/kpa-XXX-logged-in.feature`).
  2. **`playwright.config.ts`**의 `features` 배열에 해당 feature 경로 추가.
  3. **`fixtures.ts`의 `skipAuthByFile` / `skipAuthByTitle`에는 넣지 않습니다.**  
     → 이 feature는 “로그인 필요”로 간주되어, **저장된 `storageState.json`을 쓰는 context**로 실행됩니다.
  4. **사전 조건:** 최소 한 번은 `login.feature`를 실행해 `.auth/storageState.json`을 만들어 둡니다.
- **주의:**  
  로그인 만료·계정 변경 시 storage state를 다시 만들어야 합니다. 주기적으로 `login.feature`만 다시 실행하는 흐름을 두는 것이 좋습니다.

#### 성인 인증 / 성인 미인증 계정 분리

로그인 시나리오를 **성인 인증 계정**과 **성인 미인증 계정** 두 가지로 나누어 검증할 수 있도록 하는 방향입니다.

- **목적**
  - **성인 인증 계정:** 연령 제한 콘텐츠·성인 인증 플로우·인증 후 노출 UI 등을 검증할 때 사용.
  - **성인 미인증 계정:** 미인증 시 노출되는 안내·제한 화면, 인증 유도 플로우 등을 검증할 때 사용.
  - 두 계정 유형을 구분해 두어야, “성인 인증 필요 시나리오”와 “미인증 상태 시나리오”를 각각 안정적으로 돌릴 수 있습니다.

- **저장 상태 분리**
  - **저장 파일을 둘로 나눕니다.**  
    예: `.auth/storageState-adult.json`(성인 인증 계정), `.auth/storageState-nonAdult.json`(성인 미인증 계정).  
    (현재 단일 파일 `storageState.json`을 유지할지, 처음부터 두 파일로 나눌지는 구현 단계에서 결정.)
  - **로그인 시나리오도 둘로 나눕니다.**  
    - 성인 인증 계정: 한 번 실행 후 위 “성인”용 storage state 저장.  
    - 성인 미인증 계정: 한 번 실행 후 “미성인”용 storage state 저장.  
    구현 방식은 예를 들어 `login.feature` 안에 시나리오 2개(성인/미성인)를 두거나, `login-adult.feature` / `login-nonAdult.feature` 처럼 feature를 분리할 수 있습니다. 공통 로그인 스텝은 재사용하고, **어떤 계정(env 또는 파라미터)으로 로그인한 뒤 어떤 파일로 저장할지**만 구분하면 됩니다.

- **로그인 필요 시나리오에서 선택**
  - “로그인된 상태에서만 검증”하는 feature/시나리오가 **성인 인증이 필요한지, 미인증 상태가 필요한지**를 구분할 수 있어야 합니다.
  - **선택지 예시:**  
    - **태그:** `@성인인증` / `@성인미인증` 처럼 태그를 두고, fixture 또는 config에서 태그에 따라 위 두 storage state 중 하나를 로드.  
    - **feature/파일명 규칙:** 예) `kpa-XXX-logged-in-adult.feature` vs `kpa-XXX-logged-in-nonAdult.feature` 로 나누고, fixture에서 파일 경로 또는 project 이름으로 어떤 storage state를 쓸지 결정.  
    - **project 분리:** Playwright project를 두 개 두고(예: `logged-in-adult`, `logged-in-nonAdult`), 각 project가 서로 다른 storage state 파일을 쓰도록 설정.
  - 구현 시에는 위 중 한 가지 방식으로 “이 시나리오는 성인 인증 상태 / 미인증 상태”를 지정하고, 그에 맞는 storage state만 로드하면 됩니다.

- **사전 실행 순서**
  1. **성인 인증 계정**으로 로그인 시나리오 1회 실행 → 성인용 storage state 저장.
  2. **성인 미인증 계정**으로 로그인 시나리오 1회 실행 → 미인증용 storage state 저장.
  3. 이후 “로그인 필요” 시나리오 실행 시, 시나리오/태그/파일/project에 따라 위 둘 중 해당하는 state를 사용.

- **정리**
  - 계정을 **성인 인증 / 성인 미인증** 두 종류로 분리하고,
  - **저장 상태도 두 파일**로 나누며,
  - **로그인 시나리오는 각 계정 유형별로 1회씩** 실행해 두 상태를 만들어 두고,
  - **로그인 필요 시나리오**는 “성인 인증 필요” vs “미인증 상태 필요”에 따라 둘 중 어떤 state를 쓸지 선택하는 방향으로 정리하면 됩니다.

#### 방향 B: “시나리오 안에서 로그인까지 수행하는 시나리오” 추가

- **의미:** 한 시나리오 안에서 **로그인 단계(Given/When)** 를 거친 뒤, 로그인된 상태로 나머지 단계를 검증합니다.
- **절차:**
  1. feature에 **Background** 또는 시나리오 상단에 로그인 스텝을 넣습니다.  
     (예: `Given 사용자가 카카오페이지 로그인 화면을 연다` → `When 사용자가 유효한 계정으로 로그인한다` → 이후 When/Then)
  2. 이 feature는 **로그인 시나리오로만 쓰이지 않도록** 구분해야 합니다.  
     - `fixtures.ts`에서 “로그인 시나리오”는 **`login.feature`만** `isLoginScenario`로 두고,  
       “로그인 후 저장”은 하지 않는 것이 안전합니다.  
     - 즉, “시나리오 내 로그인”은 **해당 시나리오가 쓰는 context에서만** 로그인하고, **storage state 저장은 하지 않는** 방식이 좋습니다.
  3. 그러려면 이 feature는 **`skipAuthByFile`에 넣어서** “비로그인용 새 context”로 시작하게 하거나,  
     **별도 project/옵션**으로 “저장된 로그인 없이 시작 + 시나리오 내에서 로그인” 전용으로 돌리는 식으로 정리할 수 있습니다.
- **정리:**  
  “시나리오 내 로그인”을 쓰려면, (1) 해당 feature를 비로그인 context로 시작하게 두고, (2) 공통 로그인 스텝(예: `common.auth.steps.ts` 등)을 재사용해 시나리오 안에서 로그인한 뒤, (3) 그 다음 스텝부터는 이미 로그인된 페이지를 전제로 작성하면 됩니다.  
  **저장된 storage state를 쓰는 시나리오(방향 A)** 와 **시나리오 내 로그인(방향 B)** 는 목적에 따라 나누어 설계하는 것이 좋습니다.

### 추천 정리

- **빠르게 추가:**  
  “로그인된 상태에서만 할 수 있는 동작” 검증 → **방향 A**로 새 feature 추가하고, config에만 등록하고 fixtures의 skipAuth 목록에는 넣지 않음.  
  단, `login.feature` 선행 실행으로 storage state 유지.
- **한 시나리오에서 로그인부터 검증:**  
  **방향 B**로 feature 설계 후, 비로그인 context로 시작 + 공통 로그인 스텝 재사용.  
  필요하면 “로그인 포함 전용” project나 태그를 두어서, 나중에 “비로그인만 / 로그인 포함만” 선택 실행할 수 있게 하는 방향을 고려할 수 있습니다.

---

## 2. 테스트 결과를 UI 모드 외에 확인하는 방법 (방향성)

### 현재 상태

- **UI 모드:** `npm run test:ui` 로 실행 시, Playwright UI에서 시나리오별 통과/실패를 바로 볼 수 있습니다.
- **설정:** `playwright.config.ts`에 이미 `reporter: "html"` 이 있으므로, **헤드리스(또는 UI가 아닌 일반) 실행**을 하면 HTML 리포트가 생성됩니다.  
  다만 “테스트 결과 확인을 UI 모드에만 의존하고 있다”면, **실제로 헤드리스 실행 후 리포트를 여는 흐름**이 없거나 익숙하지 않을 수 있습니다.

### 결과 확인 방향 (코드 변경 없이 적용 가능한 것들)

1. **HTML 리포트 활용**
   - `npm run test`(또는 `npx playwright test`)로 실행하면, 실행이 끝난 뒤 **HTML 리포트**가 생성됩니다 (기본 경로: `playwright-report/`).
   - 결과를 보려면:  
     `npx playwright show-report`  
     를 실행해 브라우저에서 리포트를 엽니다.  
   - **방향:**  
     “테스트 실행 후, 결과 확인은 `playwright show-report`로 한다”를 기본 습관으로 두고, 필요하면 `package.json`에 `"report": "playwright show-report"` 같은 스크립트를 두어 한 번에 열 수 있게 할 수 있습니다 (문서화만 할 경우, “실행 후 `npx playwright show-report` 실행”이라고만 적어도 됨).

2. **리포터 추가 (선택)**
   - 지금은 `reporter: "html"` 하나만 있지만, 나중에 다음을 추가하는 방향을 고려할 수 있습니다.
     - **`list`:** 터미널에 시나리오별 통과/실패를 한 줄씩 출력. 로그/CI 로그에서 바로 확인할 때 유용.
     - **`json`:** 결과를 JSON 파일로 저장. 다른 도구나 스크립트로 통과율·실패 목록 등을 가공할 때 유용.
     - **`junit`:** JUnit XML 출력. Jenkins, GitLab CI, GitHub Actions 등에서 테스트 결과를 탭으로 보여주는 데 많이 씁니다.
   - **방향:**  
     “CI 또는 자동화 스크립트에서 결과를 수집하고 싶다”가 생기면, `playwright.config.ts`의 `reporter`를 `[["html"], ["list"]]` 또는 `[["html"], ["junit", { outputFile: "..." }]]` 처럼 배열로 늘리는 방향을 문서에 적어두면 됩니다.

3. **실패 시 보조 자료와의 연결**
   - 이미 **실패 시** `dom_dumps/`, `dom_logs/` 저장과 `npm run last-failure`(및 `--list`, `--open`)로 “어떤 시나리오가 왜 실패했는지” 확인하는 흐름이 있습니다.
   - **방향:**  
     “테스트 결과 확인” 문서에,  
     - **전체 결과:** UI 모드 또는 `playwright test` + `playwright show-report`  
     - **실패 상세:** `last-failure` / `last-failure --list` / `last-failure -- --open` + `FAILURE_ANALYSIS.md`  
     를 한 줄로 정리해 두면, UI 모드만 쓰지 않고도 결과를 확인하는 경로가 명확해집니다.

4. **CI에서 결과 보기 (향후)**
   - GitHub Actions, GitLab CI 등에서 `playwright test`를 돌릴 때:
     - **HTML 리포트:** `playwright show-report`는 로컬용이므로, CI에서는 **리포트 디렉터리(playwright-report/)를 아티팩트로 업로드**하고, 해당 HTML을 브라우저로 열어서 확인하는 방향이 일반적입니다.
     - **JUnit:** `reporter`에 junit을 넣어 두면, CI가 그 XML을 읽어 “Tests” 탭에 성공/실패를 표시해 줍니다.
   - **방향:**  
     “CI 파이프라인을 붙일 때는, (1) HTML 리포트 업로드, (2) 필요 시 JUnit 리포터 추가”를 목표로 두면 됩니다.

### 문서에 넣어둘 요약 문장 예시

- **전체 결과 확인:**  
  - UI 모드: `npm run test:ui`  
  - UI 없이 실행 후: `npm run test` → `npx playwright show-report` 로 HTML 리포트 확인.
- **실패만 빠르게:**  
  `npm run last-failure` / `npm run last-failure -- --list` / `npm run last-failure -- --open`.
- **나중에 CI/스크립트에서 결과 수집이 필요하면:**  
  reporter에 `list`, `json`, `junit` 중 필요한 것을 추가하는 방향을 따른다.

---

이 문서는 코드 수정 없이, **로그인 시나리오 확장**과 **테스트 결과 확인 방법**에 대한 방향만 정리한 것입니다. 실제 구현 시에는 `STABILITY_GUIDE.md`, `PROJECT_OVERVIEW.md`, `FAILURE_ANALYSIS.md`와 함께 참고하면 됩니다.
