// Generated from: features/kpa-026.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-026 기능 검증', () => {

  test('이용권 사용 확인 팝업 동작 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('이용권 사용 확인 팝업이 Off 상태이다', null, { ai, loginPage, page }); 
    await And('사용자가 대여권을 보유하고 있다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('설정 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('임의의 메뉴 설정을 변경한다', null, { ai, loginPage, page }); 
    await And('이용권 사용 확인 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('On 옵션을 클릭한다', null, { ai, loginPage, page }); 
    await And('더보기 메뉴를 이탈하여 대여권을 보유한 임의의 작품을 클릭한다', null, { ai, loginPage, page }); 
    await And('감상 이력이 없는 유료 회차를 클릭한 후 취소 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('이용권 사용 확인 메뉴를 클릭할 때 다음과 같은 팝업이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"팝업 내용"}]},{"cells":[{"value":"미구매 회차를 선택했을 때, 이용권 사용 확인 팝업이 노출됩니다."}]},{"cells":[{"value":"On / Off / 취소 버튼"}]}]}}, { ai, loginPage, page }); 
    await And('이용권 사용 팝업이 노출되며, 취소 버튼을 클릭하면 팝업이 종료되고 회차 리스트가 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-026.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 이용권 사용 확인 팝업이 Off 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 대여권을 보유하고 있다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 설정 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 임의의 메뉴 설정을 변경한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 이용권 사용 확인 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And On 옵션을 클릭한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And 더보기 메뉴를 이탈하여 대여권을 보유한 임의의 작품을 클릭한다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"And 감상 이력이 없는 유료 회차를 클릭한 후 취소 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then 이용권 사용 확인 메뉴를 클릭할 때 다음과 같은 팝업이 노출된다:","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And 이용권 사용 팝업이 노출되며, 취소 버튼을 클릭하면 팝업이 종료되고 회차 리스트가 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end