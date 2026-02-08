// Generated from: features/kpa-002.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-002 시나리오 검증', () => {

  test('사용자가 카카오 페이지에 로그인하여 추천홈에 진입', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 미로그인 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await Then('카카오 로그인 페이지로 이동한다', null, { ai, loginPage, page }); 
    await When('사용자가 카카오 로그인 페이지에서 아이디와 비밀번호를 입력한다', null, { ai, loginPage, page }); 
    await And('로그인 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자는 정상적으로 로그인되어 추천홈으로 진입한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-002.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 미로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 카카오 로그인 페이지로 이동한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 카카오 로그인 페이지에서 아이디와 비밀번호를 입력한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 로그인 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 정상적으로 로그인되어 추천홈으로 진입한다","stepMatchArguments":[]}]},
]; // bdd-data-end