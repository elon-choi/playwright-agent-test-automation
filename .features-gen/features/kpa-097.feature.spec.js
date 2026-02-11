// Generated from: features/kpa-097.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-097 시나리오 검증', () => {

  test('유료회차 이용권 미보유 상태에서 이용권 충전 페이지 이동', async ({ Given, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 유료회차를 선택하고 보유 이용권이 없는 상태이며, 이용권 사용 확인 옵션을 체크한다', null, { ai, loginPage, page }); 
    await And('사용자가 홈 탭 하단의 회차 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 회차 리스트 영역을 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 특정 회차를 클릭한다', null, { ai, loginPage, page }); 
    await Then('회차 리스트가 노출된다', null, { ai, loginPage, page }); 
    await And('이용권 충전 페이지로 이동된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-097.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 유료회차를 선택하고 보유 이용권이 없는 상태이며, 이용권 사용 확인 옵션을 체크한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 홈 탭 하단의 회차 리스트를 확인한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자가 회차 리스트 영역을 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And 사용자가 특정 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 회차 리스트가 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 이용권 충전 페이지로 이동된다","stepMatchArguments":[]}]},
]; // bdd-data-end