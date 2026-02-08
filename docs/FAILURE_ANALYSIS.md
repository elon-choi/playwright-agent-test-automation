# 실패 로그 분석 요약 (DOM 변경 시 성공/실패율 변동)

`dom_logs/` 및 `dom_dumps/` 기반 실패 원인 정리. DOM 구조 변경 시 아래 유형별로 대응하면 안정성이 올라갑니다.

---

## 1. 실패 유형별 원인

### A. 누락 스텝 (Missing step)

| 시나리오 | 로그 메시지 | 원인 |
|----------|-------------|------|
| KPA-092 | `Missing step: And 회차가 최신 회차부터 순서대로 정렬되어 화면에 노출된다` | BDD 시나리오에만 있고 `steps`에 구현된 스텝이 없음. 재생성된 스펙이 "최신 순" 시나리오를 참조하는데, "첫화부터"용 스텝만 존재. |

**조치:** `Then("회차가 최신 회차부터 순서대로 정렬되어 화면에 노출된다", ...)` 스텝을 `kpa-092.steps.ts`에 추가 (최신→오래된 순서 검증).

---

### B. 포인터 가로채기 (element intercepts pointer events)

| 시나리오 | 로그 메시지 | 원인 |
|----------|-------------|------|
| KPA-061 | `getByRole('link', { name: /추천/i }).first()` 클릭 시 `<div class="ml-42pxr flex-1 items-center space-x-32pxr">…</div> intercepts pointer events` | 링크는 보이지만 상단/겹침 레이어(네비 등)가 클릭을 가로챔. DOM/레이아웃 변경 시 자주 발생. |

**조치:**  
- `click({ force: true })`로 가리던 요소 무시 후 클릭.  
- 또는 스크롤/대기 후 클릭, 더 구체적인 scope(예: GNB 컨테이너 내부)로 로케이터 좁히기.

---

### C. 로케이터 미매칭 (Timeout / 찾지 못함)

| 시나리오 | 로그 메시지 | 원인 |
|----------|-------------|------|
| KPA-048 | `locator('[data-t-obj*=\"stop_b_\"] a[href]').first().locator('xpath=ancestor::*[contains(@class,\"swiper-slide\")][1]').locator('a[href*=\"/landing/series/list/page/landing/16260\"]')` 타임아웃 | 배너 링크를 `data-t-obj`, `swiper-slide`, **특정 href**로 고정해 두어 URL/구조 변경 시 매칭 실패. |
| KPA-092 | `Error: 정렬 메뉴를 찾지 못했습니다.` | 정렬 트리거 텍스트/역할 변경 (예: "최신순" → "최신 순" 또는 마크업 변경). |
| KPA-011 | `Error: 회차 버튼을 찾지 못했습니다.` | 회차 탭/유료·무료 버튼 텍스트·구조 변경. |

**조치:**  
- **KPA-048:** 배너는 "현재 활성 슬라이드의 링크" 기준으로 클릭하고, href는 저장만 하고 선택 조건에서는 제거하거나 유연하게.  
- **공통:** 역할/텍스트 기반(`getByRole`, `getByText`) 우선, 보조로 여러 후보 셀렉터·폴백 순서 유지. `withAiFallback`으로 실패 시 AI 재시도 활용.

---

## 2. 로그 파일명 규칙

- `_` 접두사: 일반 테스트 실패.
- `_UI_`: UI 모드 실행 시 실패.
- `_BM_`: BM(비로그인 등) 시나리오 실패.

동일 시나리오가 여러 번 실패하면 타임스탬프별로 여러 로그가 쌓이므로, 최신 로그와 해당 `dom_dumps/*.html`을 함께 보면 DOM 상태 확인에 유리합니다.

---

## 3. DOM 변경 시 권장 대응 순서

1. **스텝 구현 여부:** 해당 시나리오의 모든 Gherkin 스텝이 `steps/*.ts`에 있는지 확인.  
2. **pointer intercept:** 클릭 실패 시 `click({ force: true })` 또는 스크롤/대기 후 재시도.  
3. **과도한 셀렉터 완화:** URL/ID/클래스에 과의존하지 않고, 역할·가시 텍스트·일관된 data 속성 위주로.  
4. **폴백 체인:** `withAiFallback` + 여러 후보 로케이터로 DOM 변경 흡수.  
5. **실패 시:** `dom_logs/*.json`의 `error`/`errorStack`과 `dom_dumps/*.html`로 당시 DOM 확인 후 셀렉터/스텝 수정.

이 문서는 `dom_logs/` 샘플 분석 결과를 바탕으로 작성되었습니다.
