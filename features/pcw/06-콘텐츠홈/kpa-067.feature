Feature: KPA-067 시나리오 검증

  Scenario: 작품 이미지의 BM 영역 확인
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사용자는 로그인 상태이다
    And 사용자가 메인에서 임의의 작품 카드를 클릭한다
    And 사용자가 처음 만나는 독자 혜택 팝업이 있으면 확인을 눌러 닫는다
    When 사용자가 작품 이미지의 좌측 상단에 있는 BM 영역을 확인한다
    Then 작품의 BM 타입에 따라 올바르게 표기되어 노출된다
