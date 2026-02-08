// Generated from: features/kpa-098.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-098 기능 검증', () => {

  test('유료 회차에서 이용권 사용 확인 팝업 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 유료 회차를 선택할 수 있는 상태이다', null, { ai, loginPage, page }); 
    await And('사용자가 보유 이용권을 가지고 있다', null, { ai, loginPage, page }); 
    await And('이용권 사용 확인 팝업이 활성화되어 있다', null, { ai, loginPage, page }); 
    await When('사용자가 회차 탭을 클릭한다', null, { ai, loginPage, page }); 
    await Then('회차 리스트가 화면에 노출된다', null, { ai, loginPage, page }); 
    await When('사용자가 특정 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('취소 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('회차 리스트가 다시 화면에 노출된다', null, { ai, loginPage, page }); 
    await When('사용자가 미구매 회차를 선택한다', null, { ai, loginPage, page }); 
    await Then('이용권 사용 확인 팝업이 화면에 노출된다', null, { ai, loginPage, page }); 
    await And('팝업에는 On, Off, 취소 버튼이 포함되어 있다', null, { ai, loginPage, page }); 
    await When('사용자가 팝업에서 취소 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('팝업이 종료되고 회차 리스트가 화면에 다시 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-098.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 유료 회차를 선택할 수 있는 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 보유 이용권을 가지고 있다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 이용권 사용 확인 팝업이 활성화되어 있다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 회차 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 회차 리스트가 화면에 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When 사용자가 특정 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And 취소 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then 회차 리스트가 다시 화면에 노출된다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When 사용자가 미구매 회차를 선택한다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then 이용권 사용 확인 팝업이 화면에 노출된다","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And 팝업에는 On, Off, 취소 버튼이 포함되어 있다","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When 사용자가 팝업에서 취소 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then 팝업이 종료되고 회차 리스트가 화면에 다시 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end