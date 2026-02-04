Feature: KPA-089 시나리오 검증

  Scenario: 구매한 회차 목록 확인
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사용자가 로그인하여 구매 이력이 있는 계정으로 접속한다
    When 사용자가 회차 탭을 클릭한다
    And 사용자가 구매회차 메뉴를 클릭한다
    Then 구매회차 목록에 사용자가 구매한 회차 리스트가 노출된다
