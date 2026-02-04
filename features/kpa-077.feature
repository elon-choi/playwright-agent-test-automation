Feature: KPA-077 시나리오 검증

  Scenario: 회차 감상 이력이 없는 사용자가 첫 화를 보는 과정 검증
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사용자의 계정에 회차 감상 이력이 없다
    When 사용자가 회차 탭 영역을 클릭한다
    Then 플로팅 버튼이 화면에 표시된다
    When 사용자가 플로팅 버튼을 클릭한다
    Then [첫 화 보기] 버튼이 화면에 표시된다
    And 첫 화 뷰어가 화면에 표시된다
