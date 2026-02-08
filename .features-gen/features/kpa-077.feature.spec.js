// Generated from: features/kpa-077.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-077 시나리오 검증', () => {

  test('회차 감상 이력이 없는 사용자가 첫 화를 보는 과정 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자의 계정에 회차 감상 이력이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 회차 탭 영역을 클릭한다', null, { ai, loginPage, page }); 
    await Then('플로팅 버튼이 화면에 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 플로팅 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('[첫 화 보기] 버튼이 화면에 표시된다', null, { ai, loginPage, page }); 
    await And('첫 화 뷰어가 화면에 표시된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-077.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자의 계정에 회차 감상 이력이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 회차 탭 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 플로팅 버튼이 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 플로팅 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then [첫 화 보기] 버튼이 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 첫 화 뷰어가 화면에 표시된다","stepMatchArguments":[]}]},
]; // bdd-data-end