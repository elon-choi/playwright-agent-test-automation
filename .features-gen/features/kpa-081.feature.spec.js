// Generated from: features/kpa-081.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-081 시나리오 검증', () => {

  test('이용권 구매 흐름 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자의 계정이 캐시가 충전된 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 "회차" 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('"이용권 충전" 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('대여권 n장을 선택하고 캐시 금액 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('구매할 이용권 수를 선택하고 하단의 "충전하기" 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('선택한 대여권이 정상적으로 구매되어야 한다', null, { ai, loginPage, page }); 
    await And('구매 완료 메시지가 화면에 표시되어야 한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-081.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자의 계정이 캐시가 충전된 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 \"회차\" 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And \"이용권 충전\" 버튼을 클릭한다","stepMatchArguments":[{"group":{"start":0,"value":"\"이용권 충전\"","children":[{"start":1,"value":"이용권 충전","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 대여권 n장을 선택하고 캐시 금액 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 구매할 이용권 수를 선택하고 하단의 \"충전하기\" 버튼을 클릭한다","stepMatchArguments":[{"group":{"start":20,"value":"\"충전하기\"","children":[{"start":21,"value":"충전하기","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 선택한 대여권이 정상적으로 구매되어야 한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 구매 완료 메시지가 화면에 표시되어야 한다","stepMatchArguments":[]}]},
]; // bdd-data-end