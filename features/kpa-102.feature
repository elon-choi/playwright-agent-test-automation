Feature: KPA-102 시나리오 검증

  Scenario: 추천 작품 확인 및 이동
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사전 조건이 없다
    When 사용자가 정보 탭을 클릭한다
    And 사용자가 이 작품과 함께보는 웹툰 작품을 확인한다
    And 사용자가 추천 작품의 썸네일을 클릭한다
    Then 추천 작품이 노출된다
    And 작품 이미지, BM, 작품명이 노출된다
    And 사용자가 해당 작품의 홈으로 이동한다
