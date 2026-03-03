Feature: KPA-058 시나리오 검증

  Scenario: 책 GNB 및 기대 신작 TOP 배너 첫 작품 클릭으로 콘텐츠홈 이동
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    When 사용자가 웹 페이지에 진입하여 상단의 책 GNB 메뉴를 클릭한다
    And 사용자는 기대 신작 TOP 운영 영역이 노출될때까지 스크롤 다운한다.
    When 기대 신작 TOP 운영 배너가 노출되면 첫번째 작품(링크)을 클릭한다.
    Then 클릭한 작품의 콘텐츠홈으로 이동한다.
