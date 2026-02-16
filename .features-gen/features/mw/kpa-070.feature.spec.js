// Generated from: features/mw/kpa-070.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('KPA-070 시나리오 검증 (MW 전용)', () => {

  test('더보기 레이어 팝업의 동작 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 [더보기] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('더보기 레이어 팝업이 노출되어야 한다', null, { ai, loginPage, page }); 
    await And('팝업에는 "이용권 내역"과 "취소" 옵션이 포함되어 있어야 한다', null, { ai, loginPage, page }); 
    await When('사용자가 팝업 내의 "취소" 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('더보기 레이어 팝업이 닫혀야 한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/mw/kpa-070.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 [더보기] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 더보기 레이어 팝업이 노출되어야 한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 팝업에는 \"이용권 내역\"과 \"취소\" 옵션이 포함되어 있어야 한다","stepMatchArguments":[{"group":{"start":5,"value":"\"이용권 내역\"","children":[{"start":6,"value":"이용권 내역","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":15,"value":"\"취소\"","children":[{"start":16,"value":"취소","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When 사용자가 팝업 내의 \"취소\" 버튼을 클릭한다","stepMatchArguments":[{"group":{"start":11,"value":"\"취소\"","children":[{"start":12,"value":"취소","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 더보기 레이어 팝업이 닫혀야 한다","stepMatchArguments":[]}]},
]; // bdd-data-end