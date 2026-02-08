// Generated from: features/kpa-020.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-020 시나리오 검증', () => {

  test('댓글 내역 확인 및 삭제', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('로그인 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('댓글 내역 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await Then('댓글 내역 리스트가 화면에 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 특정 댓글을 클릭한다', null, { ai, loginPage, page }); 
    await And('댓글 삭제 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('"댓글을 삭제하시겠습니까? (삭제한 댓글은 복구할 수 없습니다.)"라는 메시지 팝업이 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 팝업에서 삭제 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('선택한 댓글이 삭제된다', null, { ai, loginPage, page }); 
    await When('사용자가 좌측 상단의 뒤로가기[⬅︎] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('댓글 내역 화면이 다음과 같이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"요소"},{"value":"설명"}]},{"cells":[{"value":"메인홈 아이콘"},{"value":"mw only"}]},{"cells":[{"value":"타이틀 문구"},{"value":"댓글 내역"}]},{"cells":[{"value":"작성한 댓글 리스트"},{"value":"최근 순서대로 정렬"}]},{"cells":[{"value":"좋아요 / 댓글달기 / 삭제 버튼"},{"value":"각 댓글에 대해 표시"}]},{"cells":[{"value":"작성한 날짜"},{"value":"각 댓글의 작성 날짜 표시"}]},{"cells":[{"value":"좋아요 수"},{"value":"다른 사용자가 선택한 좋아요 수 표시"}]},{"cells":[{"value":"댓글 수"},{"value":"댓글 수 표시"}]}]}}, { ai, loginPage, page }); 
    await Then('사용자가 댓글 내역 페이지를 빠져 나와, 더보기 메뉴로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-020.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 댓글 내역 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 댓글 내역 리스트가 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When 사용자가 특정 댓글을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 댓글 삭제 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then \"댓글을 삭제하시겠습니까? (삭제한 댓글은 복구할 수 없습니다.)\"라는 메시지 팝업이 표시된다","stepMatchArguments":[{"group":{"start":0,"value":"\"댓글을 삭제하시겠습니까? (삭제한 댓글은 복구할 수 없습니다.)\"","children":[{"start":1,"value":"댓글을 삭제하시겠습니까? (삭제한 댓글은 복구할 수 없습니다.)","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When 사용자가 팝업에서 삭제 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then 선택한 댓글이 삭제된다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When 사용자가 좌측 상단의 뒤로가기[⬅︎] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then 댓글 내역 화면이 다음과 같이 노출된다:","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then 사용자가 댓글 내역 페이지를 빠져 나와, 더보기 메뉴로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end