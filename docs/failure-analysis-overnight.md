# 오버나이트 이후 실패 케이스 원인 분석

덤프 로그(dom_logs, dom_dumps)와 스텝/픽스처 코드 기준 정리.

## 1. 브라우저 실행 직후/초반 실패 패턴

많은 실패에서 실패 시점 URL이 `https://page.kakao.com/`(메인)으로 남아 있음. 접속 후 다음 단계가 기대대로 동작하지 않아 초반에 실패.

공통 원인 후보:
- 권한 팝업: 접속 직후 권한 요청이 떠 있으면 이후 스텝 요소가 가려지거나 클릭이 막힘. "사이트에 접속한다" 직후에도 팝업 차단 권장.
- 페이지 로딩/구조: CI/밤 시간대 로딩 지연 또는 메인/메뉴 구조 변경으로 초반 로케이터 실패.

## 2. 케이스별 요약

**KPA-091 (회차 정렬)**: 실패 URL=메인, "첫화부터" not visible. 시나리오에 작품홈 진입 단계가 없어 메인에서 회차 탭/정렬을 기대함. → feature에 "사용자가 특정 작품홈에 진입한다" Given 추가.

**KPA-048 (배너)**: "배너 이동 URL이 일치하지 않습니다. 현재: page.kakao.com/". 배너 클릭 후 이동/새탭 미반영 또는 대기 부족. → 새 탭/네비 대기 강화.

**KPA-061 (오늘신작)**: "작품 URL을 확보하지 못했습니다." 첫 신작 클릭 시 getAttribute("href")가 null. → 선택자/대체 경로로 href 확보.

**KPA-011 (BM 로그인 요구)**: "로그인이 필요합니다" not visible. 팝업/문구 변경 가능성. → locator 실제 화면에 맞게 수정.

**KPA-092**: Missing step "회차가 최신 회차부터...". 스펙과 feature 문구 불일치. → bddgen 재생성.

**소식/정보 탭**: toBeVisible 실패 또는 TypeError waitForTimeout (undefined). locator 변경 또는 잘못된 객체에 waitForTimeout 호출. → locator 정리, page 주입 확인.

## 3. 권장 조치

- "사이트에 접속한다" 스텝 직후 `dismissPermissionPopup(page)` 호출 추가하여 접속 직후 팝업 제거.
- KPA-091 feature에 작품홈 진입 Given 추가.
