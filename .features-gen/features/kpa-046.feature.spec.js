// Generated from: features/kpa-046.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-046 시나리오 검증', () => {

  test('선물함 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 상단의 선물함 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await Then('선물함 메뉴 화면이 올바르게 구성되어 있는지 확인한다', null, { ai, loginPage, page }); 
    await When('사용자가 임의의 작품 리스트에서 선물 받기 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('임의의 작품 리스트를 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자는 선물함 화면에 진입하며, 다음과 같은 메뉴가 노출된다', {"dataTable":{"rows":[{"cells":[{"value":"메뉴 항목"}]},{"cells":[{"value":"메인홈 아이콘"}]},{"cells":[{"value":"타이틀 문구: 선물함"}]},{"cells":[{"value":"탭: 전체(디폴트), 웹툰, 웹소설, 책"}]},{"cells":[{"value":"작품 리스트 노출"}]}]}}, { ai, loginPage, page }); 
    await Then('클릭한 작품의 이용권이 지급되었다는 토스트 메시지가 노출된다', null, { ai, loginPage, page }); 
    await And('사용자는 클릭한 작품의 홈으로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-046.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 상단의 선물함 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 선물함 메뉴 화면이 올바르게 구성되어 있는지 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 임의의 작품 리스트에서 선물 받기 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 임의의 작품 리스트를 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 선물함 화면에 진입하며, 다음과 같은 메뉴가 노출된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then 클릭한 작품의 이용권이 지급되었다는 토스트 메시지가 노출된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And 사용자는 클릭한 작품의 홈으로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end