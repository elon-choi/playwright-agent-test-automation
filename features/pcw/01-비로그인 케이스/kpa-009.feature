Feature: KPA-009 시나리오 검증

  Scenario: 비로그인 상태에서 보관함 아이콘 클릭 시 로그인 페이지로 이동
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사용자가 비로그인 상태이다
    When 사용자가 우측 상단의 보관함 아이콘을 클릭한다
    Then 사용자는 카카오 로그인 페이지로 리디렉션된다
