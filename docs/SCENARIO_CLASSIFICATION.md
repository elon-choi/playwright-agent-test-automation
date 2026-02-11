# 시나리오 구분: 순수 시나리오 vs 스텁 시나리오

- **순수 시나리오**: 스텝에 실제 클릭·이동·expect 검증 등이 구현되어 있어, 시나리오가 **실제로 수행·검증**되며 통과/실패가 결정됨.
- **스텁 시나리오**: 스텝 본문이 `waitForTimeout` 위주라 **브라우저만 띄우고 대기 후 무조건 통과** 처리됨. 실제 검증 없음.

구분 기준은 `playwright.config.ts`의 `STUB_KPA_NUMBERS`와 동기화되어 있습니다.

---

## 1. 순수 시나리오 (실제 수행·검증 있음)

아래 KPA는 **chromium** 프로젝트에서 실행되며, UI 모드(`npm run test:ui`) 실행 시 **이 목록만** 실행됩니다.

| KPA | feature |
|-----|---------|
| 00-login | 00-login.feature |
| KPA-002 | kpa-002.feature |
| KPA-003 | kpa-003.feature |
| KPA-004 | kpa-004.feature |
| KPA-005 | kpa-005.feature |
| KPA-008 | kpa-008.feature |
| KPA-009 | kpa-009.feature |
| KPA-010 | kpa-010.feature |
| KPA-011 | kpa-011.feature |
| KPA-012 | kpa-012.feature |
| KPA-013 | kpa-013.feature |
| KPA-016 | kpa-016.feature |
| KPA-018 | kpa-018.feature |
| KPA-019 | kpa-019.feature |
| KPA-020 | kpa-020.feature |
| KPA-021 | kpa-021.feature |
| KPA-022 | kpa-022.feature |
| KPA-026 | kpa-026.feature |
| KPA-027 | kpa-027.feature |
| KPA-028 | kpa-028.feature |
| KPA-029 | kpa-029.feature |
| KPA-030 | kpa-030.feature |
| KPA-031 | kpa-031.feature |
| KPA-037 | kpa-037.feature |
| KPA-038 | kpa-038.feature |
| KPA-039 | kpa-039.feature |
| KPA-040 | kpa-040.feature |
| KPA-041 | kpa-041.feature |
| KPA-042 | kpa-042.feature |
| KPA-043 | kpa-043.feature |
| KPA-044 | kpa-044.feature |
| KPA-044-1 | kpa-044-1.feature |
| KPA-045 | kpa-045.feature |
| KPA-046 | kpa-046.feature |
| KPA-048 | kpa-048.feature |
| KPA-049 | kpa-049.feature |
| KPA-051 | kpa-051.feature |
| KPA-052 | kpa-052.feature |
| KPA-054 | kpa-054.feature |
| KPA-059 | kpa-059.feature |
| KPA-061 | kpa-061.feature |
| KPA-065 | kpa-065.feature |
| KPA-091 | kpa-091.feature |
| KPA-092 | kpa-092.feature |
| KPA-099 | kpa-099.feature |
| KPA-101 | kpa-101.feature |
| KPA-103 | kpa-103.feature |

**개수**: 00-login 포함 약 52개 feature (adult 제외).

---

## 2. 스텁 시나리오 (waitForTimeout 위주, 실제 검증 없음)

아래 KPA는 **chromium-remaining** 프로젝트에서만 실행됩니다.  
`npm run test:ui:remaining` 으로 실행하면 이 목록만 실행되며, 실제로는 브라우저만 띄우고 대기 후 통과 처리됩니다.

| KPA | feature |
|-----|---------|
| KPA-032 | kpa-032.feature |
| KPA-033 | kpa-033.feature |
| KPA-034 | kpa-034.feature |
| KPA-035 | kpa-035.feature |
| KPA-055 | kpa-055.feature |
| KPA-057 | kpa-057.feature |
| KPA-058 | kpa-058.feature |
| KPA-060 | kpa-060.feature |
| KPA-062 | kpa-062.feature |
| KPA-063 | kpa-063.feature |
| KPA-064 | kpa-064.feature |
| KPA-066 | kpa-066.feature |
| KPA-067 | kpa-067.feature |
| KPA-068 | kpa-068.feature |
| KPA-069 | kpa-069.feature |
| KPA-070 | kpa-070.feature |
| KPA-071 | kpa-071.feature |
| KPA-072 | kpa-072.feature |
| KPA-073 | kpa-073.feature |
| KPA-074 | kpa-074.feature |
| KPA-075 | kpa-075.feature |
| KPA-076 | kpa-076.feature |
| KPA-077 | kpa-077.feature |
| KPA-078 | kpa-078.feature |
| KPA-079 | kpa-079.feature |
| KPA-081 | kpa-081.feature |
| KPA-082 | kpa-082.feature |
| KPA-085 | kpa-085.feature |
| KPA-086 | kpa-086.feature |
| KPA-087 | kpa-087.feature |
| KPA-088 | kpa-088.feature |
| KPA-089 | kpa-089.feature |
| KPA-090 | kpa-090.feature |
| KPA-093 | kpa-093.feature |
| KPA-097 | kpa-097.feature |
| KPA-098 | kpa-098.feature |
| KPA-100 | kpa-100.feature |
| KPA-102 | kpa-102.feature |
| KPA-104 | kpa-104.feature |
| KPA-105 | kpa-105.feature |
| KPA-106 | kpa-106.feature |
| KPA-107 | kpa-107.feature |
| KPA-108 | kpa-108.feature |
| KPA-109 | kpa-109.feature |
| KPA-111 | kpa-111.feature |
| KPA-112 | kpa-112.feature |
| KPA-113 | kpa-113.feature |
| KPA-114 | kpa-114.feature |
| KPA-115 | kpa-115.feature |
| KPA-116 | kpa-116.feature |
| KPA-117 | kpa-117.feature |
| KPA-118 | kpa-118.feature |
| KPA-119 | kpa-119.feature |
| KPA-120 | kpa-120.feature |
| KPA-121 | kpa-121.feature |
| KPA-122 | kpa-122.feature |
| KPA-123 | kpa-123.feature |
| KPA-124 | kpa-124.feature |
| KPA-125 | kpa-125.feature |
| KPA-126 | kpa-126.feature |
| KPA-127 | kpa-127.feature |
| KPA-128 | kpa-128.feature |
| KPA-130 | kpa-130.feature |
| KPA-131 | kpa-131.feature |
| KPA-132 | kpa-132.feature |
| KPA-133 | kpa-133.feature |
| KPA-134 | kpa-134.feature |
| KPA-135 | kpa-135.feature |
| KPA-136 | kpa-136.feature |
| KPA-137 | kpa-137.feature |

**개수**: 74개 KPA. (자동화 불가 083, 084, 138, 139는 feature/step 삭제됨)

---

## 3. 시연 시 실행 방법 (내부 테스트 자동화 시연)

**순수 시나리오만** UI 모드로 실행하려면 아래 중 하나를 사용하면 됩니다.

```bash
npm run test:ui
```

또는 시연용 별칭:

```bash
npm run test:ui:demo
```

- 둘 다 **chromium** 프로젝트만 실행하며, 스텁 시나리오(STUB_KPA_NUMBERS)는 **제외**됩니다.
- 시연 시 `test:ui:remaining` 은 사용하지 마세요. (스텁만 실행됨)

---

## 4. 설정 근거

- `playwright.config.ts`  
  - **chromium**: `testIgnore: ["**/adult/**", ...STUB_TEST_IGNORE]` → 스텁 KPA 제외, 순수 시나리오만 실행.  
  - **chromium-remaining**: `testMatch: STUB_KPA_NUMBERS ...` → 스텁 KPA만 실행.
- `npm run test:ui` / `npm run test:ui:demo` → `--project=chromium` 이므로 **순수 시나리오만** UI 모드로 실행됨.

이 문서는 `STUB_KPA_NUMBERS`와 동기화되어 있습니다. 스텁을 실제 구현으로 교체한 KPA는 config에서 해당 번호를 제거한 뒤 이 문서의 표를 수동으로 옮기면 됩니다.
