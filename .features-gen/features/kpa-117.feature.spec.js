// Generated from: features/kpa-117.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-117 시나리오 검증', () => {

  test('무료 회차에서 좋아요 버튼과 작품 알림 버튼 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 전체 연령 작품 목록을 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 무료 회차에 진입한다', null, { ai, loginPage, page }); 
    await When('사용자가 무료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뷰어 이미지의 최하단까지 스크롤한다', null, { ai, loginPage, page }); 
    await And('사용자가 좋아요 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await Then('좋아요 버튼이 활성화된다', null, { ai, loginPage, page }); 
    await And('좋아요 버튼 우측에 작품 알림 버튼이 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-117.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 전체 연령 작품 목록을 확인한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 무료 회차에 진입한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 무료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 뷰어 이미지의 최하단까지 스크롤한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 좋아요 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 좋아요 버튼이 활성화된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 좋아요 버튼 우측에 작품 알림 버튼이 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end