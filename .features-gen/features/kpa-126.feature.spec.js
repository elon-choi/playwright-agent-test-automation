// Generated from: features/kpa-126.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-126 시나리오 검증', () => {

  test('무료 회차에서 댓글 기능 사용 후 뷰어로 돌아가기', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 전체 연령 작품 목록을 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 무료 회차 목록을 확인한다', null, { ai, loginPage, page }); 
    await When('사용자가 무료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('뷰어 하단의 댓글 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뒤로 가기를 실행한다', null, { ai, loginPage, page }); 
    await Then('댓글창이 팝업되며, 해당 회차의 전체 탭에 포커싱된다', null, { ai, loginPage, page }); 
    await And('댓글창이 종료되고, 사용자는 뷰어로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-126.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 전체 연령 작품 목록을 확인한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 무료 회차 목록을 확인한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 무료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 뷰어 하단의 댓글 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 뒤로 가기를 실행한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 댓글창이 팝업되며, 해당 회차의 전체 탭에 포커싱된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 댓글창이 종료되고, 사용자는 뷰어로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end