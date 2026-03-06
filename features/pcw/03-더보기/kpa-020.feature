Feature: KPA-020 시나리오 검증

  Scenario: 댓글 내역 전체 삭제
    Given 사용자가 "https://page.kakao.com/" 사이트에 접속한다
    And 로그인 상태이다
    When 사용자가 우측 상단의 프로필 아이콘을 클릭한다
    And 댓글 내역 메뉴를 클릭한다
    Then 댓글 내역 페이지가 표시된다
    When 삭제할 댓글이 있으면 모두 삭제한다
    Then 댓글 삭제 결과를 확인한다
