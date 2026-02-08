// Generated from: features/kpa-049.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-049 시나리오 검증', () => {

  test('사용자의 작품 감상 이력 및 추천 작품 노출 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 작품 감상 이력이 있는 계정으로 로그인한다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자는 최근본 작품탭 하단의 작품 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 메인홈에서 웹툰 > 실시간 랭킹 > 3위 작품을 클릭하고, 1회차를 감상한다', null, { ai, loginPage, page }); 
    await And('사용자는 추천탭 하단의 최근본 작품 영역에서 작품 리스트가 노출되는지 확인한다', null, { ai, loginPage, page }); 
    await Then('최근본 작품이 최신 감상 이력을 기준으로 정렬되어 노출된다', null, { ai, loginPage, page }); 
    await And('실시간 랭킹 3위 작품의 1회차가 정상적으로 감상된다', null, { ai, loginPage, page }); 
    await And('최근본 작품 영역 하단의 첫 번째 작품에 사용자가 3번에서 감상한 작품 이력이 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-049.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 작품 감상 이력이 있는 계정으로 로그인한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자는 최근본 작품탭 하단의 작품 리스트를 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 메인홈에서 웹툰 > 실시간 랭킹 > 3위 작품을 클릭하고, 1회차를 감상한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자는 추천탭 하단의 최근본 작품 영역에서 작품 리스트가 노출되는지 확인한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 최근본 작품이 최신 감상 이력을 기준으로 정렬되어 노출된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 실시간 랭킹 3위 작품의 1회차가 정상적으로 감상된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 최근본 작품 영역 하단의 첫 번째 작품에 사용자가 3번에서 감상한 작품 이력이 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end