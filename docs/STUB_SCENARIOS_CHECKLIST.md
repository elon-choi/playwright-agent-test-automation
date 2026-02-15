# 스텁 시나리오 체크리스트 (정상 동작 전환용)

`playwright.config.ts`의 `STUB_KPA_NUMBERS`에 포함된 시나리오입니다.  
정상 시나리오로 전환 후, 해당 번호를 `STUB_KPA_NUMBERS`에서 제거하면 됩니다.

**기준**: `chromium` 프로젝트에서는 **제외**(testIgnore), `chromium-remaining`에서만 실행됨.

---

## 체크리스트 (총 72개)

| # | KPA | feature | 정상 전환 |
|---|-----|---------|----------|
| 1 | 032 | kpa-032.feature | [ ] |
| 2 | 033 | kpa-033.feature | [ ] |
| 3 | 034 | kpa-034.feature | [ ] |
| 4 | 035 | kpa-035.feature | [ ] |
| 5 | 055 | kpa-055.feature | [ ] |
| 6 | 057 | kpa-057.feature | [ ] |
| 7 | 058 | kpa-058.feature | [ ] |
| 8 | 060 | kpa-060.feature | [ ] |
| 9 | 064 | kpa-064.feature | [ ] |
| 10 | 066 | kpa-066.feature | [ ] |
| 11 | 067 | kpa-067.feature | [ ] |
| 12 | 068 | kpa-068.feature | [ ] |
| 13 | 069 | kpa-069.feature | [ ] |
| 14 | 070 | kpa-070.feature | [ ] |
| 15 | 072 | kpa-072.feature | [ ] |
| 16 | 073 | kpa-073.feature | [ ] |
| 17 | 074 | kpa-074.feature | [ ] |
| 18 | 075 | kpa-075.feature | [ ] |
| 19 | 076 | kpa-076.feature | [ ] |
| 20 | 077 | kpa-077.feature | [ ] |
| 21 | 078 | kpa-078.feature | [ ] |
| 22 | 079 | kpa-079.feature | [ ] |
| 23 | 086 | kpa-086.feature | [ ] |
| 24 | 087 | kpa-087.feature | [ ] |
| 25 | 088 | kpa-088.feature | [ ] |
| 26 | 089 | kpa-089.feature | [ ] |
| 27 | 090 | kpa-090.feature | [ ] |
| 28 | 093 | kpa-093.feature | [ ] |
| 29 | 098 | kpa-098.feature | [ ] |
| 30 | 100 | kpa-100.feature | [ ] |
| 31 | 102 | kpa-102.feature | [ ] |
| 32 | 104 | kpa-104.feature | [ ] |
| 33 | 105 | kpa-105.feature | [ ] |
| 34 | 106 | kpa-106.feature | [ ] |
| 35 | 107 | kpa-107.feature | [ ] |
| 36 | 108 | kpa-108.feature | [ ] |
| 37 | 109 | kpa-109.feature | [ ] |
| 38 | 111 | kpa-111.feature | [ ] |
| 39 | 113 | kpa-113.feature | [ ] |
| 40 | 114 | kpa-114.feature | [ ] |
| 41 | 115 | kpa-115.feature | [ ] |
| 42 | 116 | kpa-116.feature | [ ] |
| 43 | 117 | kpa-117.feature | [ ] |
| 44 | 118 | kpa-118.feature | [ ] |
| 45 | 119 | kpa-119.feature | [ ] |
| 46 | 120 | kpa-120.feature | [ ] |
| 47 | 121 | kpa-121.feature | [ ] |
| 48 | 122 | kpa-122.feature | [ ] |
| 49 | 123 | kpa-123.feature | [ ] |
| 50 | 124 | kpa-124.feature | [ ] |
| 51 | 125 | kpa-125.feature | [ ] |
| 52 | 126 | kpa-126.feature | [ ] |
| 53 | 127 | kpa-127.feature | [ ] |
| 54 | 128 | kpa-128.feature | [ ] |
| 55 | 130 | kpa-130.feature | [ ] |
| 56 | 131 | kpa-131.feature | [ ] |
| 57 | 132 | kpa-132.feature | [ ] |
| 58 | 133 | kpa-133.feature | [ ] |
| 59 | 134 | kpa-134.feature | [ ] |
| 60 | 135 | kpa-135.feature | [ ] |
| 61 | 136 | kpa-136.feature | [ ] |
| 62 | 137 | kpa-137.feature | [ ] |

**참고**: 062, 063, 071, 081, 082, 085, 097, 112는 이미 `STUB_KPA_NUMBERS`에서 제외되어 있어 chromium(메인)에서 실행됩니다. 이 체크리스트에는 스텁으로만 돌아가는 62개만 포함됩니다.

---

## 번호만 나열 (복사용)

```
32, 33, 34, 35, 55, 57, 58, 60, 64, 66, 67, 68, 69, 70, 72, 73, 74, 75, 76, 77, 78, 79,
86, 87, 88, 89, 90, 93, 98, 100, 102, 104, 105, 106, 107, 108, 109,
111, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128,
130, 131, 132, 133, 134, 135, 136, 137
```

---

## 전환 후 할 일

1. 해당 KPA의 `steps/kpa-XXX.steps.ts`에 실제 동작 구현 (locator, click, expect 등).
2. 통과 확인 후 `playwright.config.ts`의 `STUB_KPA_NUMBERS` 배열에서 해당 번호 제거.
3. 제거한 번호는 자동으로 chromium(메인)에서 실행됨.
