# 브라우저 두 번 실행 원인 조사 보고

## 조사 요약

- **현상**: `npm run test:ui` 실행 시 브라우저가 두 번 뜸.
- **이미 시도한 조치**: `--project=chromium` 추가, `chromium-adult` 프로젝트 제거 → 여전히 두 번 뜸.

## 확인한 내용

### 1. 설정

- **testDir**: `defineBddConfig()` 반환값 = `.features-gen` (절대 경로). 테스트 루트는 하나뿐.
- **projects**: 현재 chromium 1개만 존재.
- **workers**: 1, **fullyParallel**: false.
- **test:ui 스크립트**: `playwright test --ui --project=chromium` (package.json 기준).

### 2. 테스트 수집

- `npx playwright test --list --project=chromium` 결과, 각 테스트가 **한 번씩만** 목록에 나타남.
- 경로는 `features/kpa-xxx.feature.spec.js` 형태로, testDir(`.features-gen`) 기준 상대 경로.
- **동일 스펙이 서로 다른 경로로 두 번 수집되는 흔적 없음.**

### 3. Fixture

- `steps/fixtures.ts`에서 **context**는 `browser.newContext()`만 사용. 별도 `chromium.launch()` 등 추가 브라우저 런치는 없음.
- **page**는 Playwright 기본 fixture. 브라우저를 하나 더 띄우는 코드 없음.

### 4. 가능한 원인 (우선순위)

1. **UI 창 + 테스트용 브라우저를 둘 다 “브라우저”로 인식**
   - `playwright test --ui`는 **Electron 기반 UI 창**을 띄움.
   - 테스트 실행 시 그와 별도로 **테스트용 Chrome**이 한 번 더 뜸.
   - 따라서 “창이 두 개” = UI 창 1개 + 테스트 브라우저 1개일 수 있음. (설계상 동작.)

2. **UI 모드에서 테스트가 두 번 실행되는 경우**
   - Playwright 이슈 [#23428](https://github.com/microsoft/playwright/issues/23428): 특정 디렉터리/glob 구조에서 같은 파일이 서로 다른 경로로 수집되어 한 번이 아니라 두 번 실행될 수 있음.
   - 현재 `--list`에서는 중복 수집이 없었으나, **실행 시**에만 두 번 돌 수 있는 경우는 `testMatch`로 스펙 경로를 엄격히 제한해 배제하는 것이 안전함.

3. **config 이중 로드**
   - `defineBddConfig()`는 메인 프로세스에서 `outputDir`(절대 경로) 반환, 워커에서는 env 기반으로 동일 경로 사용. **서로 다른 testDir이 섞여서 두 번 수집되는 구조는 아님.**

## 권장 조치

### A. “두 번”이 UI 창 + 테스트 브라우저인지 확인

- **한 개**: Playwright UI(테스트 목록/타임라인 있는 창)
- **한 개**: 실제로 페이지가 열리는 Chrome 창  
→ 이 조합이면 “브라우저 두 번”은 정상 동작입니다. 테스트용 브라우저만 1개인 상태입니다.

### B. 테스트가 실제로 두 번 실행되는지 확인

- 터미널에서:
  - `DEBUG=pw:api npm run test:ui`
- UI에서 **한 개의 테스트만** 선택해 실행.
- 로그에서 `browserType.launch` 또는 `browser.newContext`가 **몇 번** 나오는지 확인.
  - 1번이면: 브라우저는 1번만 뜨고, “두 번”은 UI 창을 포함한 것일 가능성이 큼.
  - 2번이면: 같은 테스트가 두 번 실행되거나, 프로젝트/워커가 두 번 돌고 있는 것일 수 있음.

### C. testMatch로 수집 범위 고정 (재현 방지)

- `playwright.config.ts`에서 **testMatch**를 명시해, 오직 `.features-gen` 아래 스펙만 돌리도록 제한.
- 다른 디렉터리/glob과 겹치지 않게 해, 이슈 #23428 유형의 이중 수집을 원천 차단.

### D. 추가로 알면 좋은 정보

- 두 창이 **동시에** 뜨는지, **테스트 실행 버튼을 누를 때만** 두 번째가 뜨는지.
- 두 창 중 하나가 **Playwright UI**(테스트 목록·타임라인 있는 창)인지 여부.

위 내용을 알려주시면, “실제로 테스트 런타임이 브라우저를 두 번 띄우는지”까지 더 정확히 좁힐 수 있습니다.
