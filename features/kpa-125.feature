Feature: KPA-125 시나리오 검증

  Scenario: 자동 스크롤 버튼 노출 확인
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 전체 연령 작품 목록을 확인한다
    And 무료 회차 목록을 확인한다
    When 사용자가 무료 회차를 클릭한다
    And 뷰어 상단의 설정 아이콘을 클릭한다
    And 자동 스크롤 활성 버튼을 On으로 설정한다
    And 뷰어 이미지 영역을 클릭한다
    Then 우측 하단에 자동 스크롤 버튼이 노출된다
