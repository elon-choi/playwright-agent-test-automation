// Generated from: features/kpa-106.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-106 시나리오 검증', () => {

  test('댓글에 답글을 달고 카운트를 확인한다', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 댓글 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('댓글 영역이 화면에 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 [답글] 버튼을 클릭하고 임의의 답글을 입력한다', null, { ai, loginPage, page }); 
    await And('사용자가 [답글 등록] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('입력한 답글이 답글 목록에 등록된다', null, { ai, loginPage, page }); 
    await And('답글 카운트가 +1 증가하여 표시된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-106.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 댓글 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 댓글 영역이 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 [답글] 버튼을 클릭하고 임의의 답글을 입력한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 [답글 등록] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 입력한 답글이 답글 목록에 등록된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 답글 카운트가 +1 증가하여 표시된다","stepMatchArguments":[]}]},
]; // bdd-data-end