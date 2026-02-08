// Generated from: features/kpa-071.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-071 시나리오 검증', () => {

  test('사용자가 카카오 페이지에서 이용권 내역 화면으로 이동', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인되어 있다', null, { ai, loginPage, page }); 
    await When('사용자가 [더보기] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 [이용권 내역] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자는 이용권 내역 화면으로 이동한다', null, { ai, loginPage, page }); 
    await And('이용권 내역 화면이 올바르게 표시된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-071.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인되어 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 [더보기] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 [이용권 내역] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 이용권 내역 화면으로 이동한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 이용권 내역 화면이 올바르게 표시된다","stepMatchArguments":[]}]},
]; // bdd-data-end