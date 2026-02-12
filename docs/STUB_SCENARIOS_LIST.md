# 스텁 API 사용 시나리오 목록

스텁(waitForTimeout 위주, 실제 검증 없이 통과 처리)으로 구성된 시나리오입니다.  
점검·구현 전환 시 아래 목록을 기준으로 하면 됩니다.

**UI 모드에서 실행**: `npm run test:ui:stub` (스텁 시나리오만 UI로 실행)

---

## 스텁 목록에서 제외된 시나리오 (실제 구현 있음)

아래는 `STUB_KPA_NUMBERS`에서 제외되어, 기본 UI 목록에 포함됩니다.

| 번호 | 사유 |
|------|------|
| 062 | 이벤트 서브탭/전체보기 클릭, getByRole·getByText·expect 사용 |
| 063 | 요일 서브탭·작품 클릭, waitForURL·locator 사용 |
| 071 | 이용권 내역 화면 이동, locator·getByRole·expect·뒤로가기 등 |
| 081 | 이용권 구매 흐름, ensureContentPage·GNB·작품 클릭·충전 버튼 등 |
| 082 | 소장권 구매, getByText·getByRole·locator·충전하기 버튼 등 |
| 085 | 이용권 환불 흐름, 대여권 탭·환불 항목 클릭 등 |
| 097 | 유료회차 이용권 미보유 시 충전 페이지 이동, ensureContentPage·회차 탭·expect 등 |
| 112 | 정주행 아이콘·확인 버튼·뷰어 엔드 영역, getByRole·getByText·waitFor 사용 |

---

## Feature 파일 목록 (스텁으로 분류된 것만, 083/084/138/139 제외)

| 번호 | feature |
|------|---------|
| 032 | kpa-032.feature |
| 033 | kpa-033.feature |
| 034 | kpa-034.feature |
| 035 | kpa-035.feature |
| 055 | kpa-055.feature |
| 057 | kpa-057.feature |
| 058 | kpa-058.feature |
| 060 | kpa-060.feature |
| 062 | kpa-062.feature |
| 063 | kpa-063.feature |
| 064 | kpa-064.feature |
| 066 | kpa-066.feature |
| 067 | kpa-067.feature |
| 068 | kpa-068.feature |
| 069 | kpa-069.feature |
| 070 | kpa-070.feature |
| 071 | kpa-071.feature |
| 072 | kpa-072.feature |
| 073 | kpa-073.feature |
| 074 | kpa-074.feature |
| 075 | kpa-075.feature |
| 076 | kpa-076.feature |
| 077 | kpa-077.feature |
| 078 | kpa-078.feature |
| 079 | kpa-079.feature |
| 081 | kpa-081.feature |
| 082 | kpa-082.feature |
| 085 | kpa-085.feature |
| 086 | kpa-086.feature |
| 087 | kpa-087.feature |
| 088 | kpa-088.feature |
| 089 | kpa-089.feature |
| 090 | kpa-090.feature |
| 093 | kpa-093.feature |
| 097 | kpa-097.feature |
| 098 | kpa-098.feature |
| 100 | kpa-100.feature |
| 102 | kpa-102.feature |
| 104 | kpa-104.feature |
| 105 | kpa-105.feature |
| 106 | kpa-106.feature |
| 107 | kpa-107.feature |
| 108 | kpa-108.feature |
| 109 | kpa-109.feature |
| 111 | kpa-111.feature |
| 112 | kpa-112.feature |
| 113 | kpa-113.feature |
| 114 | kpa-114.feature |
| 115 | kpa-115.feature |
| 116 | kpa-116.feature |
| 117 | kpa-117.feature |
| 118 | kpa-118.feature |
| 119 | kpa-119.feature |
| 120 | kpa-120.feature |
| 121 | kpa-121.feature |
| 122 | kpa-122.feature |
| 123 | kpa-123.feature |
| 124 | kpa-124.feature |
| 125 | kpa-125.feature |
| 126 | kpa-126.feature |
| 127 | kpa-127.feature |
| 128 | kpa-128.feature |
| 130 | kpa-130.feature |
| 131 | kpa-131.feature |
| 132 | kpa-132.feature |
| 133 | kpa-133.feature |
| 134 | kpa-134.feature |
| 135 | kpa-135.feature |
| 136 | kpa-136.feature |
| 137 | kpa-137.feature |

---

## 스텝 파일 (대응 관계)

각 시나리오의 스텝 정의는 `steps/kpa-XXX.steps.ts`에 있으며, 대부분 본문이 `await page.waitForTimeout(500)`만 있는 순수 스텁입니다.  
KPA-128, 134, 136은 전용 스텝 파일이 없고 공통/다른 KPA 스텝을 사용합니다.

---

이 목록은 `playwright.config.ts`의 `STUB_KPA_NUMBERS`와 동기화됩니다.
