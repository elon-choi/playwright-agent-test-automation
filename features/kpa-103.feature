Feature: KPA-103 시나리오 검증

  Scenario: 소식 탭 UI 검증
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 사용자는 로그인하지 않은 상태이다
    When 사용자가 "소식" 탭을 클릭한다
    Then 페이지는 "소식" 탭의 내용을 표시한다
    And 페이지 하단에 "DA 광고 영역"이 있을 경우 노출된다
    And 페이지 하단에 "작품 소식 영역" 또는 안내 문구가 노출된다
