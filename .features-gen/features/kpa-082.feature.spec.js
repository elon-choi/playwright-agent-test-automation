// Generated from: features/kpa-082.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-082 시나리오 검증', () => {

  test('사용자가 소장권을 정상적으로 구매할 수 있는지 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인하여 계정에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자의 계정에 충분한 캐시가 충전되어 있다', null, { ai, loginPage, page }); 
    await When('사용자가 회차 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 이용권 충전 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 소장권 n장을 선택하고 캐시 금액 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 구매할 이용권 수를 선택하고 하단의 충전하기 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('선택한 소장권이 정상적으로 구매되었음을 확인한다', null, { ai, loginPage, page }); 
    await And('사용자의 캐시 잔액이 적절히 차감되었음을 확인한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-082.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인하여 계정에 접속한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자의 계정에 충분한 캐시가 충전되어 있다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 회차 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 이용권 충전 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 소장권 n장을 선택하고 캐시 금액 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 사용자가 구매할 이용권 수를 선택하고 하단의 충전하기 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 선택한 소장권이 정상적으로 구매되었음을 확인한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 사용자의 캐시 잔액이 적절히 차감되었음을 확인한다","stepMatchArguments":[]}]},
]; // bdd-data-end