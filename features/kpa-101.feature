Feature: KPA-101 시나리오 검증

  Scenario: 웹툰의 관련 소설 영역으로 이동
    Given 사용자가 "https://page.kakao.com/content/58095657?tab_type=about" 사이트에 접속한다
    And 사용자는 로그인하지 않은 상태이다
    When 사용자가 상단 메뉴에서 "정보" 탭을 클릭한다
    And 사용자가 정보 탭 하단의 "동일작" 섹션에서 원작 소설 작품을 클릭한다
    Then 사용자는 해당 작품홈 페이지로 이동한다
