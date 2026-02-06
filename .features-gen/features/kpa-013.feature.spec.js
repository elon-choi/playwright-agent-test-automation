// Generated from: features/kpa-013.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-013 시나리오 검증', () => {

  test('비로그인 상태에서 기다무 작품 선물 받기 클릭 시 로그인 페이지로 이동', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { loginPage, page }); 
    await And('사용자가 비로그인 상태이다', null, { loginPage }); 
    await When('사용자가 GNB 메뉴의 "웹툰" 탭을 클릭한다', null, { page }); 
    await And('사용자가 "지금, 신작!" 섹션의 첫번째 작품 카드를 클릭한다', null, { ai, page }); 
    await And('사용자가 작품홈 이미지 하단의 선물 받기 버튼을 클릭한다', null, { ai, page }); 
    await Then('사용자는 카카오 로그인 페이지로 이동한다', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-013.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 비로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 GNB 메뉴의 \"웹툰\" 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 \"지금, 신작!\" 섹션의 첫번째 작품 카드를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 작품홈 이미지 하단의 선물 받기 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 카카오 로그인 페이지로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end