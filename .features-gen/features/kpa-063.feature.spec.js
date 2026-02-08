// Generated from: features/kpa-063.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-063 시나리오 검증', () => {

  test('웹툰 GNB 메뉴 및 요일 서브탭 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 상단의 웹툰 GNB 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('요일 서브탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('임의의 작품을 클릭한다', null, { ai, loginPage, page }); 
    await Then('요일 메뉴 하단에 다음과 같은 메뉴가 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"항목"}]},{"cells":[{"value":"신작 / 요일 / 완결 메뉴"}]},{"cells":[{"value":"전체 / 기다무 웹툰 / 연재무료 / 장르 필터"}]},{"cells":[{"value":"선택한 요일에 연재 중인 웹툰 작품 리스트"}]}]}}, { ai, loginPage, page }); 
    await And('사용자는 클릭한 작품의 작품홈으로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-063.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 상단의 웹툰 GNB 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 요일 서브탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 임의의 작품을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 요일 메뉴 하단에 다음과 같은 메뉴가 노출된다:","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And 사용자는 클릭한 작품의 작품홈으로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end