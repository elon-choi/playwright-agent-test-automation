// Generated from: features/kpa-069.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-069 시나리오 검증', () => {

  test('좋아요 버튼 비활성화 및 보관함에서의 노출 여부 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인하여 좋아요가 활성화된 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 [♡] 좋아요 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('좋아요 버튼이 비활성화 상태로 변경된다', null, { ai, loginPage, page }); 
    await And('좋아요 버튼 우측에 작품 알림 버튼이 노출되지 않는다', null, { ai, loginPage, page }); 
    await And('사용자가 보관함으로 이동한다', null, { ai, loginPage, page }); 
    await And('보관함의 좋아요 탭을 확인한다', null, { ai, loginPage, page }); 
    await Then('해당 작품이 보관함의 좋아요 탭 하단에 노출되지 않는다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-069.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인하여 좋아요가 활성화된 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 [♡] 좋아요 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 좋아요 버튼이 비활성화 상태로 변경된다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And 좋아요 버튼 우측에 작품 알림 버튼이 노출되지 않는다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 사용자가 보관함으로 이동한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 보관함의 좋아요 탭을 확인한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 해당 작품이 보관함의 좋아요 탭 하단에 노출되지 않는다","stepMatchArguments":[]}]},
]; // bdd-data-end