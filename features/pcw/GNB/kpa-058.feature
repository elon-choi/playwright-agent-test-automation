Feature: KPA-058 시나리오 검증

  Scenario: 작품 감상 이력 확인 및 실시간 랭킹 작품 감상
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    When 사용자가 웹 페이지에 진입하여 상단의 책 GNB 메뉴를 클릭한다
    And 사용자는 기대 신작 TOP 운영 영역이 노출될때까지 스크롤 다운한다.
    When 기대 신작 TOP 운영 배너이 노출되면 첫번째 작품 이미지를 클릭한다.
    Then 클릭한 작품의 콘텐츠홈으로 이동한다.
