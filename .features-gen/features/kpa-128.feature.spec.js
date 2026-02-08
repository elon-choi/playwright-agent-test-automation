// Generated from: features/kpa-128.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-128 시나리오 검증', () => {

  test('무료 회차 탐색 및 이동 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 전체 연령 작품을 선택한다', null, { ai, loginPage, page }); 
    await And('사용자가 무료 회차에 진입한다', null, { ai, loginPage, page }); 
    await And('사용자가 이전/다음 회차가 무료인 작품을 확인한다', null, { ai, loginPage, page }); 
    await When('사용자가 무료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뷰어 하단의 다음화 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뷰어 하단의 이전화 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뒤로 가기를 실행한다', null, { ai, loginPage, page }); 
    await Then('사용자는 다음 회차로 이동한다', null, { ai, loginPage, page }); 
    await And('사용자는 이전 회차로 이동한다', null, { ai, loginPage, page }); 
    await And('사용자는 작품홈의 회차 리스트로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-128.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 전체 연령 작품을 선택한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 무료 회차에 진입한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자가 이전/다음 회차가 무료인 작품을 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 무료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 뷰어 하단의 다음화 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 사용자가 뷰어 하단의 이전화 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And 사용자가 뒤로 가기를 실행한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 다음 회차로 이동한다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And 사용자는 이전 회차로 이동한다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And 사용자는 작품홈의 회차 리스트로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end