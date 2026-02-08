// Generated from: features/kpa-060.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-060 시나리오 검증', () => {

  test('웹툰 실시간 랭킹 1위 작품 확인 및 이동', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 실시간 랭킹 서브탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 웹툰 실시간 랭킹 1위 작품을 클릭한다', null, { ai, loginPage, page }); 
    await Then('실시간 랭킹 메뉴 하단에 다음 요소들이 노출되어야 한다:', {"dataTable":{"rows":[{"cells":[{"value":"요소"}]},{"cells":[{"value":"DA 광고 영역"}]},{"cells":[{"value":"웹툰 / 웹소설 탭"}]},{"cells":[{"value":"랭킹 선정 기준"}]},{"cells":[{"value":"1위 ~ 300위까지 작품 리스트"}]}]}}, { ai, loginPage, page }); 
    await And('사용자는 웹툰 실시간 랭킹 1위 작품의 홈으로 이동해야 한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-060.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 실시간 랭킹 서브탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 웹툰 실시간 랭킹 1위 작품을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 실시간 랭킹 메뉴 하단에 다음 요소들이 노출되어야 한다:","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And 사용자는 웹툰 실시간 랭킹 1위 작품의 홈으로 이동해야 한다","stepMatchArguments":[]}]},
]; // bdd-data-end