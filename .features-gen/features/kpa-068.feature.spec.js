// Generated from: features/kpa-068.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-068 시나리오 검증', () => {

  test('작품 좋아요 후 보관함 노출 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인되어 있으며, 좋아요가 비활성화된 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 작품 이미지 영역 내 [♡] 좋아요 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 작품홈에서 이탈하여 보관함 메뉴로 이동한다', null, { ai, loginPage, page }); 
    await And('사용자가 보관함의 좋아요 탭을 확인한다', null, { ai, loginPage, page }); 
    await Then('좋아요 버튼이 활성화되고, 좋아요 버튼 우측에 작품 알림 버튼이 노출된다', null, { ai, loginPage, page }); 
    await And('보관함의 좋아요 탭 하단에 사용자가 선택한 작품이 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-068.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인되어 있으며, 좋아요가 비활성화된 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 작품 이미지 영역 내 [♡] 좋아요 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 작품홈에서 이탈하여 보관함 메뉴로 이동한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 보관함의 좋아요 탭을 확인한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 좋아요 버튼이 활성화되고, 좋아요 버튼 우측에 작품 알림 버튼이 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 보관함의 좋아요 탭 하단에 사용자가 선택한 작품이 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end