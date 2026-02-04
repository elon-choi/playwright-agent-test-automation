Feature: KPA-138 시나리오 검증

  Scenario: 무료 회차 감상 시 앱으로 이동
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 전체 연령 작품 목록을 확인한다
    And 무료 회차가 있는 작품을 선택한다
    When 사용자가 무료 회차를 클릭한다
    And "앱으로 보기" 버튼을 클릭한다
    Then "웹에서 감상 불가" 팝업이 노출된다
    And 카카오 페이지 앱이 실행되며, 해당 회차로 이동한다
