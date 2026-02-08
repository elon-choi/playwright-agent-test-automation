// Generated from: features/kpa-003.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-003 시나리오 검증', () => {

  test('사용자 프로필 닉네임 변경', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자 정보 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('닉네임 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('새로운 임의의 닉네임을 입력하고 저장 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자는 더보기 페이지로 이동한다', null, { ai, loginPage, page }); 
    await And('내 정보 페이지로 이동하며, 정보가 올바르게 노출된다', null, { ai, loginPage, page }); 
    await And('프로필 수정 페이지로 이동한다', null, { ai, loginPage, page }); 
    await And('변경된 닉네임이 저장되고 계정 정보 페이지로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-003.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자 정보 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 닉네임 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 새로운 임의의 닉네임을 입력하고 저장 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 더보기 페이지로 이동한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 내 정보 페이지로 이동하며, 정보가 올바르게 노출된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 프로필 수정 페이지로 이동한다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And 변경된 닉네임이 저장되고 계정 정보 페이지로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end