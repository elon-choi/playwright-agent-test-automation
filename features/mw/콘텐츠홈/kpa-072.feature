Feature: KPA-072 시나리오 검증

  Scenario: 탭 영역 하단 배너 클릭 시 랜딩 페이지로 이동
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사전 조건이 없다
    When 사용자가 탭 영역 하단 배너를 확인한다
    And 사용자가 탭 영역 하단 배너를 클릭한다
    Then 사용자는 해당 배너의 랜딩 URL로 이동한다
