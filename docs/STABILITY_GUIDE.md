# 안정적·효과적 사용 가이드

현재 구조를 유지한 채로 실패를 줄이고, 신규 시나리오를 빠르게 붙이기 위한 절차와 권장 사항만 정리했다. 기존 시나리오 코드는 수정하지 않아도 된다.

---

## 1. 실패 후 빠른 분석

- 실패 시 `dom_dumps/`, `dom_logs/`에 자동 저장된다.
- **마지막 실패 한 건**만 보고 싶을 때:
  - `npm run last-failure`  
    → 마지막 실패 로그 경로 + 대응 DOM 덤프 경로 + 테스트명·에러·URL 출력.
  - `npm run last-failure -- --open`  
    → 위 정보 출력 후, 해당 HTML 덤프를 기본 브라우저로 연다.
- **최근 실패 여러 건**을 보고 싶을 때:
  - `npm run last-failure -- --list`  
    → 최근 실패 10건의 테스트명·에러 요약·로그 경로 출력.
- 상세 유형별 대응은 `docs/FAILURE_ANALYSIS.md` 참고.

---

## 2. 신규 시나리오 추가 절차 (빠르게 코드로 설계)

1. **Feature 작성**  
   `features/` 아래에 `kpa-XXX.feature` 추가. Gherkin 시나리오만 작성.
2. **BDD 재생성**  
   `playwright.config.ts`의 `features` 배열에 새 feature 경로 추가 후,  
   `npm run test:ui:regen` 한 번 실행해 `.features-gen/` 갱신.
3. **스텝 구현**  
   `steps/kpa-XXX.steps.ts` 생성(또는 기존 파일에 추가).  
   - `Given/When/Then` 문구는 feature와 **완전 일치**시킨다.  
   - 한 스텝에서 여러 후보 로케이터를 시도하는 패턴(기존 kpa-011, kpa-012 등)을 그대로 따라가면 DOM 변경에 덜 깨진다.
4. **Config 반영**  
   `playwright.config.ts`의 `features`와 `steps` 배열에 새 feature·steps 파일 경로 추가.
5. **실행**  
   `npm run test:ui` 로 해당 시나리오만 골라서 실행해 보며 안정화.

---

## 3. 실패 시 대응 체크리스트

실패가 났을 때, 아래 순서로 보면 원인 파악과 수정이 빠르다.

| 순서 | 확인 내용 |
|------|-----------|
| 1 | `npm run last-failure`로 마지막 실패 로그·덤프 경로 확인. 필요 시 `--open`으로 HTML 덤프 열기. |
| 2 | 해당 스텝이 실제로 구현돼 있는지 확인. (Missing step 인지) |
| 3 | 에러가 "intercepts pointer" 계열이면 → 해당 스텝에서 `click({ force: true })` 또는 스크롤/대기 후 클릭 검토. |
| 4 | 타임아웃/요소 못 찾음이면 → `dom_dumps/*.html`로 DOM 확인 후, **역할·텍스트 우선**으로 로케이터 수정. (getByRole, getByText, 필요 시 보조 셀렉터) |
| 5 | 수정 후 같은 시나리오만 다시 실행해 재현 여부 확인. |

자주 나오는 실패 유형과 구체 수정 예시는 `FAILURE_ANALYSIS.md`에 있다.

---

## 4. 셀렉터 작성 시 권장 (신규 스텝만 적용)

- **우선:** `getByRole('button'|'link'|'tab', { name: /.../ })`, `getByText(...)`  
  → DOM 구조가 바어도 텍스트/역할이 유지되면 깨지지 않는다.
- **보조:** `data-testid`, 의미 있는 `aria-*`  
  → 팀에서 testid를 관리한다면 활용.
- **피할 것:** 특정 URL/숫자 ID, 난독화된 class명만으로 된 셀렉터.  
  → 한 번 바뀌면 바로 실패하고, 원인 추적도 어렵다.
- 한 스텝에서 **여러 후보 로케이터를 순서대로 시도**하는 방식은 기존 kpa-011, kpa-012 등과 동일하게 유지하면 안정적이다.

---

## 5. ZEROSTEP / selfHeal 선택 사항

- **ZEROSTEP_TOKEN**  
  - `.env`에 설정하면, `withAiFallback`을 쓰는 스텝은 **로케이터 실패 시 한 번만** 자연어로 ZeroStep AI 재시도를 한다.  
  - 없으면: 기존처럼 실패 시 예외 그대로 전파. (동작만 없을 뿐, 코드 변경 불필요.)
- **selfHealLocator + selector-map**  
  - “후보 목록 중 하나라도 보이면 그걸 쓰고, 성공한 걸 `self_heal/selector-map.json`에 저장”하는 방식.  
  - 지금은 KPA-048 배너 다음 화살표 한 군데만 사용 중.  
  - **새 시나리오에서** “이 요소만 자주 깨진다”면, 해당 스텝에서만 `selfHealLocator`에 키·후보를 넘기는 식으로 추가하면 된다. 기존 15개 시나리오는 그대로 둬도 된다.

---

## 6. 요약

- **실패 분석:** `npm run last-failure`(필요 시 `--open`) + `FAILURE_ANALYSIS.md`.
- **신규 시나리오:** feature 추가 → config에 등록 → bddgen → steps 구현(역할/텍스트 우선, 후보 체인) → UI로 검증.
- **안정성:** 기존 코드 구조 유지, 수동 수정 + 문서화 중심. ZEROSTEP/selfHeal은 선택적으로만 확장.

이 가이드는 기존 15개 시나리오를 수정하지 않고, 추가·운영만으로 프로젝트를 안정적이고 효과적으로 쓰기 위한 것이다.
