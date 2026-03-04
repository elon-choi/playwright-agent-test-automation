# 설계 및 지침 정리 (클로드 전달용)

카카오페이지 Playwright BDD 테스트 자동화 프로젝트에서의 설계 결정, 지침, 작업 이력을 정리한 문서입니다. 다른 AI(클로드 등)와 업무 연계 시 참고용입니다.

---

## 1. 프로젝트 개요

- **목적**: 카카오페이지(PCW) 웹 E2E 테스트 자동화
- **스타일**: BDD(Gherkin feature) + playwright-bdd → `.feature` + `steps/kpa-*.steps.ts`
- **실행**: Chromium 단일, workers=1, fullyParallel=false (시나리오 순차)
- **실행 방식**: 사용자 규칙에 따라 **테스트는 Playwright UI가 노출되는 방식으로 실행** (예: `npm run test:ui`)

---

## 2. 최상위 지침 (테스트 성공 판정)

`.cursor/rules/test-success-criteria.mdc`에 정의된 내용이 최우선입니다.

- **시나리오대로 동작하지 않으면 성공으로 처리하지 않는다.**
- exit code 0이어도, 시나리오와 다르게 동작했다면 성공이 아니다.
- 예: 특정 작품/회차로 가야 하는데 다른 작품·회차로 이동·클릭되었다면 **실패로 간주**하고 원인 수정 후 재검증.
- 접속/선택 스텝에는 **의도한 대상(URL, contentId, 회차)이 실제로 선택·이동되었는지** 검증(assert, waitForURL 등)을 반드시 포함.
- "첫 번째" 요소만 클릭해 다른 작품·회차로 갈 수 있는 패턴은 사용하지 않고, **현재 시나리오/페이지에 해당하는 요소만** 선택하도록 한다.

---

## 3. 사용자 규칙 (작업 시 준수)

- **언어**: 대답은 항상 한글로.
- **레퍼런스**: 최신 JavaScript 문서를 레퍼런스로 사용.
- **코드 제공**: 스크립트 수정 시 **전체 수정된 코드**를 제공.
- **주석**: 주석/comment에는 **아이콘(이모지)을 넣지 않는다.**
- **반박**: 사용자 의견에 무조건 동의하지 않고, 실 적용 사례·예시를 근거로 잘못된 요청이면 반박한다.
- **테스트 실행**: 테스트 스크립트 실행은 **Playwright UI가 노출되면서** 실행한다.

---

## 4. 아키텍처 요약

| 구분 | 설명 |
|------|------|
| **features/** | `pcw/`, `mw/` 하위에 기능별 폴더. `00-login`이 선두. |
| **steps/** | `fixtures.ts`(공통 픽스처·헬퍼), `common.*.steps.ts`, `login.steps.ts`, `kpa-XXX.steps.ts` |
| **pages/** | `BasePage`, `LoginPage` 등. ZeroStep AI는 Chromium에서만 사용. |
| **playwright.config.ts** | BDD testDir, steps 배열, projects(chromium, login, chromium-085 등), launchOptions |

- **Context/인증**: `fixtures.ts`의 `browser` 픽스처에서 시나리오별로 `skipAuth`/`isLoginScenario`/저장된 로그인 상태에 따라 context 생성. skipAuth 시나리오(예: kpa-013, kpa-002 등)는 `newContext({ permissions: ["local-network-access"] })` 사용.

---

## 5. 권한 팝업 (로컬 네트워크 액세스)

- **현상**: accounts.kakao.com 로그인 페이지에서만 "로컬 네트워크 액세스" **시스템 권한 창**이 뜸. page.kakao.com 메인에서는 해당 권한 요청이 없어 팝업이 안 뜸.
- **원인**: 해당 도메인에서만 비공개 주소(로컬/VPN 등)로 요청이 나가 Chrome LNA(Local Network Access) 프롬프트가 뜸. DOM이 아니라 **브라우저 네이티브 UI**라 개발자 도구로 요소를 볼 수 없고, DOM 기반으로는 닫을 수 없음.
- **대응**:
  - **playwright.config.ts**: 모든 Chromium 프로젝트에 `launchOptions: { args: ["--disable-features=LocalNetworkAccess"] }` 적용.
  - **steps/fixtures.ts**: context 생성 시 `permissions: ["local-network-access"]` 부여(skipAuth, 로그인 시나리오, 저장된 로그인 상태용 모두).
  - **dismissPermissionPopup**: DOM에 있는 권한/다이얼로그만 처리. 시스템 LNA 창은 여기서 닫을 수 없으며, 위 설정으로 창이 뜨지 않도록 하는 것이 목표.
- **이동성**: 위 설정은 코드/설정 파일에만 있어, PC나 브라우저가 바뀌어도 별도 재설정 없이 동일하게 적용됨.

---

## 6. 로그인·KPA-002

- **KPA-002**: 비로그인 → 프로필 아이콘 클릭 → 로그인 페이지 → 아이디/비밀번호 입력 → 추천홈 진입.
- **00-login과의 차이**: 00-login은 Given에서 `dismissPermissionPopup(page)` 호출하고, 002는 그렇지 않아 팝업·폼 로드 타이밍 이슈가 있었음.
- **적용한 수정**:
  - 002의 "아이디와 비밀번호를 입력한다" When에서 **dismissPermissionPopup(page)** 선 호출 후 fillCredentials.
  - **LoginPage.fillCredentials**: 로그인 페이지 URL일 때 아이디 입력란 visible 최대 15초 대기. locator에 `input[placeholder*="Account"]`, `input[type="password"]` 추가. visible 확인 후 fill.
- **Zerostep "No valid target found"**: BasePage.safeAi에서 해당 에러(및 zerostep.error)를 catch해 null 반환. LoginPage에서는 null일 때 "아이디 입력칸을 찾지 못했습니다" 등 한글 메시지로 실패 처리.

---

## 7. KPA-089 (구매회차 목록)

- **조건**: 구매회차 체크박스 옵션이 **체크된 상태**에서, **구매 회차가 없는 경우**에도 성공 처리.
- **Then 검증**: "구매한 회차가 없습니다." 메시지가 노출되면 즉시 성공. 그렇지 않으면 구매 회차 목록/섹션 노출 여부로 검증. 실패 메시지는 "구매회차 체크박스 옵션 체크 상태에서 구매 회차 목록 또는 '구매한 회차가 없습니다.' 메시지가 노출되어야 합니다"로 통일.

---

## 8. KPA-085 (이용권 내역·구매 취소)

- **문제**: "이용권 내역 상세 팝업창에서 스크롤 다운 후 구매 취소하기 버튼을 클릭한다" 단계에서, 목록 화면에 머문 채로 실패하는 경우.
- **대응 1**: 목록에 머물러 있을 때 **한 번 더 상세 진입 시도**. `tryClickCancellable소장권Type` / `tryClickCancellable대여권Type` 호출 후 2초 대기, 상세 노출 여부 재확인. 그래도 목록이면 기존과 동일한 에러 메시지 throw.
- **대응 2**: 이용권 내역 **목록**에서 취소 가능한 대여권/소장권 행이 **`<span class="font-small1">1장</span>`** 구조인 점 반영.
  - **tryClickCancellable대여권Type / tryClickCancellable소장권Type**:  
    - Locator: 대여권/소장권 행 내부의 **`span.font-small1`** 중 "n장" 텍스트가 있는 것을 **우선** 클릭.  
    - evaluate: `span.font-small1`을 찾고, 그 span이 속한 행(대여권/소장권 텍스트 포함, 취소완료 제외)의 클릭 가능 영역(또는 행) 클릭.

---

## 9. 공통 패턴·유틸

- **회차 스코프**: 다른 작품 카드를 누르지 않도록, **현재 작품(contentId)에 해당하는 회차 리스트 영역만** 사용. `common.episode.steps.ts`의 `getEpisodeListScope`, `getCurrentContentId`, `isLinkSameWork`, `clickEpisodeTabOfCurrentWork` 등 export 활용.
- **withAiFallback**: locator 실패 시 ZeroStep AI로 대체 시도. fixtures에 정의.
- **dismissPermissionPopup**: DOM 기반 권한/다이얼로그만 처리. 한/영 문구, 차단/허용/X, Escape 순으로 시도.
- **고정 URL 시나리오**: 예) KPA-013은 테스트 대상 작품 URL을 고정(`KPA013_TEST_WORK_URL`)하고, "웹툰 탭 첫 카드" 대신 해당 URL로 직접 이동.

---

## 10. 설정·타임아웃

- **actionTimeout**: 40000 (스크린샷 대기 등 완화)
- **navigationTimeout**: 35000
- **timeout**: 90000 (프로젝트 기본)
- **chromium-085**: timeout 300000

---

## 11. 주요 파일 참조

| 파일 | 역할 |
|------|------|
| steps/fixtures.ts | browser/page/context, dismissPermissionPopup, withAiFallback, getBaseUrl 등 |
| steps/common.episode.steps.ts | 회차 리스트 스코프, contentId, 유료 회차 등 공통 로직 |
| steps/login.steps.ts | 00-login 시나리오 (로그인 화면 열기, 성인/미인증 계정 로그인) |
| pages/LoginPage.ts | openLogin, fillCredentials, submitLogin, verifyRecommendationHome, safeAi 사용 |
| pages/BasePage.ts | safeAi (Zerostep 에러 시 null 반환), smartClick |
| playwright.config.ts | BDD testDir, steps 목록, projects, launchOptions(LocalNetworkAccess 비활성화) |

---

## 12. 문서·규칙 위치

- **테스트 성공 판정**: `.cursor/rules/test-success-criteria.mdc`
- **프레임워크 개요**: `docs/FRAMEWORK_OVERVIEW.md`
- **슬랙/대시보드**: `docs/DASHBOARD_AND_SLACK_GUIDE.md`
- **본 설계·지침**: `docs/HANDOFF_DESIGN_AND_GUIDELINES.md`

이 문서는 작업 전반의 설계와 지침을 요약한 것이며, 구체적인 수정은 각 파일 히스토리와 feature/steps 코드를 함께 보는 것이 좋습니다.
