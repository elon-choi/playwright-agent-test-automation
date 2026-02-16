// Generated from: features/kpa-090.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-090 시나리오 검증', () => {

  test('구매 이력이 없는 사용자가 회차 탭에서 메시지 노출 확인', async ({ Given, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 구매 이력이 없는 계정으로 로그인한다', null, { ai, loginPage, page }); 
    await And('사용자가 홈 탭 하단의 회차 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 구매회차 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await Then('"구매한 회차가 없습니다."라는 메시지가 화면에 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-090.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 구매 이력이 없는 계정으로 로그인한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 홈 탭 하단의 회차 리스트를 확인한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자가 구매회차 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then \"구매한 회차가 없습니다.\"라는 메시지가 화면에 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end