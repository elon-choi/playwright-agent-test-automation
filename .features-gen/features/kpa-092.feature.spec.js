// Generated from: features/kpa-092.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-092 시나리오 검증', () => {

  test('회차 탭에서 최신 순 정렬 옵션을 선택하여 회차 정렬 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { loginPage, page }); 
    await And('사용자는 로그인하지 않은 상태이다', null, { loginPage }); 
    await When('사용자가 회차 탭을 클릭한다', null, { ai, page }); 
    await And('사용자가 정렬 메뉴를 클릭한다', null, { ai, page }); 
    await And('사용자가 최신 순 정렬 옵션을 클릭한다', null, { ai, page }); 
    await Then('"첫화부터"와 "최신순" 옵션이 화면에 노출된다', null, { page }); 
    await And('회차가 최신 회차부터 순서대로 정렬되어 화면에 노출된다', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-092.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인하지 않은 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 회차 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 정렬 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 최신 순 정렬 옵션을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then \"첫화부터\"와 \"최신순\" 옵션이 화면에 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 회차가 최신 회차부터 순서대로 정렬되어 화면에 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end