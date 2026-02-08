// Generated from: features/kpa-083.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-083 시나리오 검증', () => {

  test('대여권 보유 상태에서 유료 회차 클릭 후 뷰어 대여 상태 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 대여권을 보유하고 있다', null, { ai, loginPage, page }); 
    await When('사용자가 회차 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 유료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뒤로가기를 눌러 뷰어 대여 상태를 확인한다', null, { ai, loginPage, page }); 
    await Then('"{이용권} N장을 사용했습니다."라는 토스트 메시지가 노출되며 뷰어로 진입된다', null, { ai, loginPage, page }); 
    await And('뷰어 하단에 "[대여] 뱃지"와 "{n}일 {nn}시간 남은" 메시지가 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-083.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 대여권을 보유하고 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 회차 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 임의의 유료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 뒤로가기를 눌러 뷰어 대여 상태를 확인한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then \"{이용권} N장을 사용했습니다.\"라는 토스트 메시지가 노출되며 뷰어로 진입된다","stepMatchArguments":[{"group":{"start":0,"value":"\"{이용권} N장을 사용했습니다.\"","children":[{"start":1,"value":"{이용권} N장을 사용했습니다.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 뷰어 하단에 \"[대여] 뱃지\"와 \"{n}일 {nn}시간 남은\" 메시지가 노출된다","stepMatchArguments":[{"group":{"start":7,"value":"\"[대여] 뱃지\"","children":[{"start":8,"value":"[대여] 뱃지","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":18,"value":"\"{n}일 {nn}시간 남은\"","children":[{"start":19,"value":"{n}일 {nn}시간 남은","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end