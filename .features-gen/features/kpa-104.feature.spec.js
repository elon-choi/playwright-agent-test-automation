// Generated from: features/kpa-104.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-104 시나리오 검증', () => {

  test('댓글 정렬 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인되어 있다', null, { ai, loginPage, page }); 
    await When('사용자가 댓글 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 [정렬] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 정렬 옵션을 선택한다', null, { ai, loginPage, page }); 
    await Then('전체 댓글 갯수가 화면에 표시된다', null, { ai, loginPage, page }); 
    await And('정렬 버튼이 화면에 표시된다', null, { ai, loginPage, page }); 
    await And('좋아요순 / 최신순 정렬 설정 팝업이 화면에 표시된다', null, { ai, loginPage, page }); 
    await And('댓글이 선택한 정렬 순서에 맞춰 변경된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-104.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인되어 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 댓글 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 [정렬] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 임의의 정렬 옵션을 선택한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 전체 댓글 갯수가 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 정렬 버튼이 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 좋아요순 / 최신순 정렬 설정 팝업이 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 댓글이 선택한 정렬 순서에 맞춰 변경된다","stepMatchArguments":[]}]},
]; // bdd-data-end