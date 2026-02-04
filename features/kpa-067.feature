Feature: KPA-067 시나리오 검증

  Scenario: 작품 이미지의 BM 영역 확인
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사전 조건이 없다
    When 사용자가 작품 이미지의 좌측 상단에 있는 BM 영역을 확인한다
    Then 작품의 BM 타입에 따라 올바르게 표기되어 노출된다
