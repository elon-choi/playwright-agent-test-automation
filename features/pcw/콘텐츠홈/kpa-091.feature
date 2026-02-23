Feature: KPA-091 시나리오 검증

  Scenario: 회차 정렬 기능 검증
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사용자가 "개미" 웹툰 작품을 검색 후 클릭한다 "https://page.kakao.com/content/68239972"
    And 사용자가 처음 만나는 독자 혜택 팝업이 있으면 확인을 눌러 닫는다
    And 사용자가 홈 탭 하단의 회차 리스트를 확인한다
    And 사용자가 회차 정렬 메뉴를 클릭한다
    And 사용자가 "첫화부터" 정렬 옵션을 클릭한다
    Then "첫화부터" 옵션이 화면에 노출된다
    And 회차명이 오름차순 정렬되어 화면에 노출된다
