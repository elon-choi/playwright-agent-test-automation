// Generated from: features/kpa-032.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-032 시나리오 검증', () => {

  test('최근본 작품 정렬 및 실시간 랭킹 작품 감상 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 "최근 순" 정렬 상태를 선택한다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 하단의 보관함 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 "최근본 작품" 탭 하단의 작품 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 "메인홈" > "웹툰" > "실시간 랭킹"에서 1위~20위 중 임의의 한 작품을 클릭하고, 해당 작품의 1회차를 감상한다', null, { ai, loginPage, page }); 
    await And('사용자가 "보관함" > "최근본 작품" 탭 하단의 작품 리스트를 다시 확인한다', null, { ai, loginPage, page }); 
    await Then('최근본 작품이 사용자가 선택한 정렬 기준대로 노출된다', null, { ai, loginPage, page }); 
    await And('선택한 작품의 1회차가 정상적으로 감상된다', null, { ai, loginPage, page }); 
    await And('"최근본 작품" 탭 최상단에 방금 감상한 작품이 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-032.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 \"최근 순\" 정렬 상태를 선택한다","stepMatchArguments":[{"group":{"start":5,"value":"\"최근 순\"","children":[{"start":6,"value":"최근 순","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 하단의 보관함 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 \"최근본 작품\" 탭 하단의 작품 리스트를 확인한다","stepMatchArguments":[{"group":{"start":5,"value":"\"최근본 작품\"","children":[{"start":6,"value":"최근본 작품","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 \"메인홈\" > \"웹툰\" > \"실시간 랭킹\"에서 1위~20위 중 임의의 한 작품을 클릭하고, 해당 작품의 1회차를 감상한다","stepMatchArguments":[{"group":{"start":5,"value":"\"메인홈\"","children":[{"start":6,"value":"메인홈","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":13,"value":"\"웹툰\"","children":[{"start":14,"value":"웹툰","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":20,"value":"\"실시간 랭킹\"","children":[{"start":21,"value":"실시간 랭킹","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 \"보관함\" > \"최근본 작품\" 탭 하단의 작품 리스트를 다시 확인한다","stepMatchArguments":[{"group":{"start":5,"value":"\"보관함\"","children":[{"start":6,"value":"보관함","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":13,"value":"\"최근본 작품\"","children":[{"start":14,"value":"최근본 작품","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 최근본 작품이 사용자가 선택한 정렬 기준대로 노출된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 선택한 작품의 1회차가 정상적으로 감상된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And \"최근본 작품\" 탭 최상단에 방금 감상한 작품이 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end