// Generated from: features/kpa-042.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-042 기능 검증', () => {

  test('구매 작품 정렬 및 실시간 랭킹 1위 작품 이용권 구매', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('구매 순 정렬이 선택된 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 하단의 보관함 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('구매 작품탭 하단의 작품 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('메인홈에서 웹툰 > 실시간 랭킹 > 1위 작품을 클릭하여 이용권을 구매한다', null, { ai, loginPage, page }); 
    await And('보관함에서 구매 작품탭 하단의 작품 리스트를 다시 확인한다', null, { ai, loginPage, page }); 
    await Then('구매 작품이 정렬 기준에 따라 올바르게 노출된다', null, { ai, loginPage, page }); 
    await And('실시간 랭킹 1위 작품의 이용권 구매가 정상적으로 진행된다', null, { ai, loginPage, page }); 
    await And('구매 작품탭 최상단에 방금 감상한 작품 이력이 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-042.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 구매 순 정렬이 선택된 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 하단의 보관함 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 구매 작품탭 하단의 작품 리스트를 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 메인홈에서 웹툰 > 실시간 랭킹 > 1위 작품을 클릭하여 이용권을 구매한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 보관함에서 구매 작품탭 하단의 작품 리스트를 다시 확인한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 구매 작품이 정렬 기준에 따라 올바르게 노출된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 실시간 랭킹 1위 작품의 이용권 구매가 정상적으로 진행된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 구매 작품탭 최상단에 방금 감상한 작품 이력이 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end