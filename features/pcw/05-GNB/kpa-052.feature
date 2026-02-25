Feature: KPA-052 시나리오 검증

  Scenario: 최근본 작품 및 실시간 랭킹 작품 감상 검증
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    When 사용자가 웹 페이지 상단의 웹툰 GNB 메뉴를 클릭한다
    And 사용자가 최근본 작품탭 하단의 작품 리스트를 확인한다
    And 사용자가 최근본 작품탭 우측 끝 > 아이콘을 클릭한다
    And 보관함 > 최근 본 페이지로 이동한다
