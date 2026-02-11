# 스텁 시나리오 전수 조사 결과

`npm run test:ui:remaining` 실행 시 **chromium-remaining** 프로젝트에서 돌아가는 시나리오는 `playwright.config.ts`의 `STUB_KPA_NUMBERS`에 정의된 KPA만 실행됩니다.  
아래는 해당 시나리오들 중 **실제 검증 없이 `waitForTimeout`만 수행하고 통과 처리되는 스텝**을 가진 경우를 정리한 결과입니다.

---

## 1. 결론 요약

- **test:ui:remaining으로 실행되는 시나리오 전부**가 스텁 전용으로 분류된 KPA이며, 이들의 스텝 파일 상당수에서 **본문이 `await page.waitForTimeout(500)`(또는 400/600)만 있는 “순수 스텁”** 이 사용되고 있습니다.
- **순수 스텁 스텝**: 스텝 구현이 `await page.waitForTimeout(N);` 만 있고, `click`, `expect`, `getByRole`, `locator` 등 실제 동작/검증이 전혀 없는 경우.

따라서 **아래 목록의 시나리오는 브라우저만 띄우고 실제로는 통과하지 않아도 통과 처리되는 스텁이 포함된 시나리오**입니다.

---

## 2. chromium-remaining에서 실행되는 시나리오 (STUB_KPA_NUMBERS)

다음 KPA 번호들이 **test:ui:remaining** 에서만 실행됩니다.

```
32, 33, 34, 35, 55, 57, 58, 60, 62, 63, 64, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 93, 97, 98, 100, 102, 104, 105, 106, 107, 108, 109,
111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128,
130, 131, 132, 133, 134, 135, 136, 137, 138, 139
```

---

## 3. 순수 스텁 스텝만으로 통과 처리되는 시나리오 (전체 스텝이 스텁)

아래 시나리오는 해당 KPA 전용 스텝 파일(`steps/kpa-XXX.steps.ts`) 안의 **정의된 스텝이 모두 “본문 = waitForTimeout만”** 이거나, 공통 스텝을 쓰더라도 그 공통 스텝이 다른 스텁 전용 파일에서 같은 문구로 스텁 정의된 경우입니다.  
즉, **실제 클릭/검증 없이 통과만 되는 시나리오**로 볼 수 있습니다.

| KPA | feature | 비고 |
|-----|---------|------|
| KPA-032 | kpa-032.feature | 최근본 정렬/랭킹/1회차 감상 등 전부 스텁 |
| KPA-033 | kpa-033.feature | 순수 스텁 스텝 다수 |
| KPA-034 | kpa-034.feature | 최근본 탭/작품 삭제 등 전부 스텁 |
| KPA-035 | kpa-035.feature | 정렬 옵션 노출 등 스텁 |
| KPA-036 | kpa-036.feature | 알림 토글/좋아요 정렬 등 스텁 |
| KPA-055 | kpa-055.feature | 순수 스텁 스텝 다수 |
| KPA-057 | kpa-057.feature | 책 GNB/배너 구성 전부 스텁 |
| KPA-058 | kpa-058.feature | 순수 스텁 스텝 다수 |
| KPA-060 | kpa-060.feature | 실시간 랭킹 관련 전부 스텁 |
| KPA-062 | kpa-062.feature | 추천/이벤트 메뉴 전부 스텁 |
| KPA-063 | kpa-063.feature | 요일 메뉴 노출 스텁 |
| KPA-064 | kpa-064.feature | 장르전체 서브탭/UI 노출 스텁 |
| KPA-066 | kpa-066.feature | 작품명/작가명/장르/열람수 등 전부 스텁 |
| KPA-067 | kpa-067.feature | BM 영역 스텁 |
| KPA-068 | kpa-068.feature | 순수 스텁 스텝 다수 |
| KPA-069 | kpa-069.feature | 좋아요 비활성/보관함 스텁 |
| KPA-070 | kpa-070.feature | 더보기 레이어 팝업 전부 스텁 |
| KPA-071 | kpa-071.feature | 이용권 내역 스텁 |
| KPA-072 | kpa-072.feature | 순수 스텁 스텝 다수 |
| KPA-073 | kpa-073.feature | 첫 화 보기/뷰어로 보기 등 전부 스텁 |
| KPA-074 | kpa-074.feature | 순수 스텁 스텝 다수 |
| KPA-075 | kpa-075.feature | 순수 스텁 스텝 다수 |
| KPA-076 | kpa-076.feature | 순수 스텁 스텝 다수 |
| KPA-077 | kpa-077.feature | 순수 스텁 스텝 다수 |
| KPA-078 | kpa-078.feature | 순수 스텁 스텝 다수 |
| KPA-079 | kpa-079.feature | 순수 스텁 스텝 다수 |
| KPA-081 | kpa-081.feature | 캐시/대여권 구매 전부 스텁 |
| KPA-082 | kpa-082.feature | 순수 스텁 스텝 다수 |
| KPA-083 | kpa-083.feature | 순수 스텁 스텝 다수 |
| KPA-084 | kpa-084.feature | 순수 스텁 스텝 다수 |
| KPA-085 | kpa-085.feature | 이용권 환불 전부 스텁 |
| KPA-086 | kpa-086.feature | 순수 스텁 스텝 다수 |
| KPA-087 | kpa-087.feature | 순수 스텁 스텝 다수 |
| KPA-088 | kpa-088.feature | 선택/클릭/노출/팝업 내용 전부 스텁 |
| KPA-089 | kpa-089.feature | 순수 스텁 스텝 다수 |
| KPA-090 | kpa-090.feature | 순수 스텁 스텝 다수 |
| KPA-093 | kpa-093.feature | 순수 스텁 스텝 다수 |
| KPA-097 | kpa-097.feature | 순수 스텁 스텝 다수 |
| KPA-098 | kpa-098.feature | 순수 스텁 스텝 다수 |
| KPA-100 | kpa-100.feature | 순수 스텁 스텝 다수 |
| KPA-102 | kpa-102.feature | 순수 스텁 스텝 다수 |
| KPA-104 | kpa-104.feature | 댓글 탭/정렬/갯수 노출 전부 스텁 |
| KPA-105 | kpa-105.feature | 순수 스텁 스텝 다수 |
| KPA-106 | kpa-106.feature | 순수 스텁 스텝 다수 |
| KPA-107 | kpa-107.feature | 순수 스텁 스텝 다수 |
| KPA-108 | kpa-108.feature | 댓글/차단하기 팝업 전부 스텁 |
| KPA-109 | kpa-109.feature | 순수 스텁 스텝 다수 |
| KPA-111 | kpa-111.feature | 순수 스텁 스텝 다수 |
| KPA-112 | kpa-112.feature | 정주행/뷰어 엔드 전부 스텁 |
| KPA-113 | kpa-113.feature | 댓글창 팝업/종료 스텁 |
| KPA-114 | kpa-114.feature | 이전/다음 회차 이동 전부 스텁 |
| KPA-115 | kpa-115.feature | 뷰어 엔드 요소 노출 스텁 |
| KPA-116 | kpa-116.feature | 배너 클릭/작품홈 이동 스텁 |
| KPA-117 | kpa-117.feature | 좋아요/작품 알림 버튼 스텁 |
| KPA-118 | kpa-118.feature | 별점 팝업/설정 스텁 |
| KPA-119 | kpa-119.feature | 댓글창 Best 탭 스텁 |
| KPA-120 | kpa-120.feature | 댓글창 전체 탭/엔드 영역 스텁 |
| KPA-121 | kpa-121.feature | 다음화 보기 스텁 |
| KPA-122 | kpa-122.feature | 작품홈 가기/이동 스텁 |
| KPA-123 | kpa-123.feature | 섹션 작품 클릭/홈 이동 스텁 |
| KPA-124 | kpa-124.feature | 뷰어 탭 하단 요소 스텁 |
| KPA-125 | kpa-125.feature | 자동 스크롤/버튼 노출 스텁 |
| KPA-126 | kpa-126.feature | 댓글창 팝업/종료 스텁 |
| KPA-127 | kpa-127.feature | 정주행/스크롤/엔드 영역 스텁 |
| KPA-128 | kpa-128.feature | kpa-114 등 스텁 스텝 사용 (전용 스텝 없음) |
| KPA-130 | kpa-130.feature | 스크롤/작품 홈 이동 스텁 |
| KPA-131 | kpa-131.feature | 좋아요 우측 활성화 스텁 |
| KPA-132 | kpa-132.feature | 별점 선택/팝업 종료 스텁 |
| KPA-133 | kpa-133.feature | 댓글 창 닫기/Best 탭 스텁 |
| KPA-134 | kpa-134.feature | kpa-120 등 스텁 스텝 사용 (전용 스텝 없음) |
| KPA-135 | kpa-135.feature | 다음화 보기 스텁 |
| KPA-136 | kpa-136.feature | kpa-122 등 스텁 스텝 사용 (전용 스텝 없음) |
| KPA-137 | kpa-137.feature | 이전에 보던 작품 홈 스텁 |
| KPA-138 | kpa-138.feature | 앱으로 보기/스토어 이동 스텁 |
| KPA-139 | kpa-139.feature | 웹 감상 불가 팝업/스토어 스텁 |

---

## 4. 스텁이 아닌 경우 (참고)

- **KPA-039**: `kpa-039.steps.ts`에는 클릭/expect/locator 등 실제 동작이 포함되어 있음. 다만 `STUB_KPA_NUMBERS`에 포함되어 있어 **test:ui:remaining** 에서는 실행됨.
- **KPA-016**: 메인 chromium에서 실행. 알림 메뉴 클릭·expect 등 실제 구현 있음. 일부 스텝에만 `waitForTimeout` 보조 사용.

---

## 5. 판별 기준

- **순수 스텁**: 스텝 본문이 `await page.waitForTimeout(N);` 만 있고 그 외 코드(클릭, expect, getByRole, locator 등)가 없음.
- **일부 스텁**: 같은 파일에 위와 같은 “순수 스텁” 스텝이 하나라도 있으면, 해당 시나리오는 “스텁이 포함된 시나리오”로 분류.

검색 패턴: 스텝 콜백이 `async (...) => { await page.waitForTimeout(숫자); }` 만 있는 블록을 `steps/kpa-*.ts`에서 검사함.

---

## 6. 권장 사항

1. **test:ui:remaining** 으로 돌리는 위 시나리오들은 현재 “브라우저만 띄우고 통과 처리”되는 스텁이 많으므로, 실제 검증이 필요하면 스텝 구현을 순차적으로 실제 동작/검증으로 교체하는 것이 좋습니다.
2. 이미 구현이 들어간 KPA-039는 remaining에서 제외하고 메인 chromium에서만 돌리도록 `STUB_KPA_NUMBERS`에서 39를 빼는 것을 검토할 수 있습니다.
3. KPA-128, 134, 136은 전용 스텝 파일이 없고 공통/다른 KPA 스텝을 쓰며, 그 스텝들이 스텁인 경우 동일하게 “실제로는 통과하지 않아도 통과 처리”되는 시나리오입니다.

이 문서는 전수 조사 결과를 바탕으로 작성되었습니다.
