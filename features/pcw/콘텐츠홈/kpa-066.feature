Feature: KPA-066 시나리오 검증

  Scenario: 작품 정보가 올바르게 노출되는지 확인
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 페이지가 완전히 로드된다
    When 사용자가 작품명 영역을 확인한다
    Then 작품명이 올바르게 노출된다
    When 사용자가 작가명 영역을 확인한다
    Then 작가명이 올바르게 노출된다
    When 사용자가 장르 영역을 확인한다
    Then 장르가 올바르게 노출된다
    When 사용자가 누적 열람 수와 좋아요 수를 확인한다
    Then 누적 열람 수와 좋아요 수가 올바르게 노출된다
