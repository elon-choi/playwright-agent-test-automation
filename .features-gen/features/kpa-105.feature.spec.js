// Generated from: features/kpa-105.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-105 시나리오 검증', () => {

  test('댓글 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 로그인 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 댓글 탭을 클릭한다', null, { ai, loginPage, page }); 
    await Then('댓글 영역이 화면에 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 첫 번째 댓글의 [좋아요] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('댓글 리스트가 화면에 표시된다', null, { ai, loginPage, page }); 
    await And('각 댓글에는 닉네임, 작성일자, 댓글 내용, 좋아요 수, 싫어요 수, 답글 버튼, 더보기 버튼이 표시된다', null, { ai, loginPage, page }); 
    await And('클릭한 댓글의 좋아요 수가 1 증가하여 표시된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-105.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 댓글 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 댓글 영역이 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 첫 번째 댓글의 [좋아요] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 댓글 리스트가 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 각 댓글에는 닉네임, 작성일자, 댓글 내용, 좋아요 수, 싫어요 수, 답글 버튼, 더보기 버튼이 표시된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 클릭한 댓글의 좋아요 수가 1 증가하여 표시된다","stepMatchArguments":[]}]},
]; // bdd-data-end