# PC Web(pcw) / Mobile Web(mw) 시나리오 분리

플랫폼별로 UI·플로우가 다를 때 시나리오를 pcw/mw로 나누는 방식과 실행 규칙입니다.

---

## 1. 분리 방식 (권장: 디렉터리)

| 방식 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **A. 디렉터리** | `features/mw/`, `features/pcw/` 하위에 플랫폼 전용 feature 배치 | 경로만 보면 플랫폼 구분 가능. `testMatch`/`testIgnore`로 실행 단위 분리 용이 | feature 목록에 경로 추가 필요 |
| B. 파일명 접미사 | `kpa-070-mw.feature`, `kpa-070-pcw.feature` | 한 KPA의 pcw/mw가 나란히 보임 | 파일 수 증가, bddgen 경로 일괄 관리 필요 |
| C. 태그 | 시나리오에 `@mw` / `@pcw` 부여 후 `--grep`으로 필터 | 한 feature에 두 플랫폼 시나리오 공존 가능 | 태그 누락 시 잘못된 플랫폼에서 실행될 수 있음 |

**권장: A(디렉터리).**  
- 생성 스펙 경로가 `.features-gen/features/mw/...`, `.features-gen/features/pcw/...` 로 나뉘어 `testIgnore: ["**/mw/**"]` 등으로 제어하기 쉽습니다.
- 공통(둘 다 동일) 시나리오는 기존처럼 `features/` 루트에 두면 됩니다.

---

## 2. 디렉터리 구조

```
features/
  00-login.feature
  kpa-002.feature
  ...                    # 공통 (PC/MW 동일 시 루트 유지)
  mw/
    kpa-070.feature      # MW 전용 (더보기 레이어 등)
    kpa-073.feature      # 모바일 웹 첫 화 보기 및 뷰어 진입
    kpa-074.feature      # 모바일 웹 첫 화 보기 및 다음 화 보기
    kpa-075.feature      # 모바일 웹 첫 화 감상(이펍 뷰어)
    kpa-076.feature      # 모바일 웹 첫 화 보고 다음 화로 이동
    kpa-079.feature      # 모바일 웹 회차 이력 있는 작품 이어보기
  pcw/
    kpa-070.feature      # PCW 전용 (해당 기능이 PC에 있을 때만; 없으면 스킵 시나리오)
```

- **공통**: 플랫폼 구분 없이 동일한 시나리오 → `features/*.feature` 유지.
- **MW 전용**: 해당 기능이 모바일 웹에서만 존재하거나, MW에서만 검증하는 경우 → `features/mw/`.
- **PCW 전용**: 해당 기능이 PC 웹에서만 존재하거나, PC에서만 검증하는 경우 → `features/pcw/`.
- **동일 KPA인데 플랫폼별로 다른 플로우**: `features/mw/kpa-NNN.feature`, `features/pcw/kpa-NNN.feature` 둘 다 두고, PCW에서 미지원이면 pcw 버전은 스킵 시나리오로 둠.

---

## 3. playwright.config 반영

- **features 배열**: `features/kpa-070.feature` 대신 `features/mw/kpa-070.feature`, `features/pcw/kpa-070.feature` 등 플랫폼별 경로 등록.
- **chromium (PC 기본)**  
  - `testIgnore`에 `"**/mw/**"` 추가 → MW 전용 스펙은 PC 실행에서 제외.
- **chromium-mw (선택)**  
  - `testMatch: ["**/mw/**"]` 로 MW 전용만 실행하는 프로젝트 추가 가능 (뷰포트는 이후 모바일로 조정 가능).

---

## 4. 스텝 정의

- 플랫폼 공통 스텝: 기존처럼 `steps/kpa-NNN.steps.ts` 등에서 그대로 사용.
- 플랫폼별로 셀렉터/플로우가 다르면:
  - **같은 스텝 문구, 내부에서 분기**: fixture에 플랫폼(또는 viewport) 주입 후 스텝 안에서 `if (platform === 'mw') ... else ...`.
  - **스텝 문구 자체를 분리**: `steps/mw/kpa-070.steps.ts`, `steps/pcw/kpa-070.steps.ts` 처럼 플랫폼별 파일로 나누고, config의 `steps` 배열에 둘 다 등록.

---

## 5. KPA-070 적용 예

- **070 더보기 레이어**: MW 전용으로 확인되는 케이스.
  - **MW**: `features/mw/kpa-070.feature` — 기존 시나리오 그대로 (더보기 버튼 → 이용권 내역·취소 등).
  - **PCW**: `features/pcw/kpa-070.feature` — 동일 KPA이지만 PC에서는 미지원이면 시나리오 하나 두고 `test.skip(true, "PC Web에서는 더보기 레이어 검증 미지원")` 으로 스킵 처리.

이렇게 하면 한 번에 “PC만” / “MW만” 실행할 수 있고, 070은 PC 실행 시 자동으로 제외되거나 스킵됩니다.
