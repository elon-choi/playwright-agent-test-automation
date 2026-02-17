Feature: KPA-093 시나리오 검증

  Scenario: 회차 리스트와 뷰어 이동 검증
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사용자가 무료 회차와 일반 회차가 있는 페이지에 도달한다
    And 사용자가 홈 탭 하단의 회차 리스트를 확인한다
    Then 회차 리스트 영역이 화면에 표시된다
    When 사용자가 특정 [회차]를 클릭한다
    Then 해당 회차의 뷰어 페이지로 이동한다
