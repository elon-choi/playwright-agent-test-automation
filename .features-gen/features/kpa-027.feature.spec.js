// Generated from: features/kpa-027.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-027 시나리오 검증', () => {

  test('검색 기능 및 작품 상세 페이지 이동 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입하여 우 상단의 검색 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('임의의 텍스트를 입력하고 엔터 키를 누른다', null, { ai, loginPage, page }); 
    await Then('검색 결과 화면이 표시된다', null, { ai, loginPage, page }); 
    await And('매칭된 키워드에 해당하는 작품 리스트가 노출된다', null, { ai, loginPage, page }); 
    await When('사용자가 임의의 작품을 클릭한다', null, { ai, loginPage, page }); 
    await Then('선택한 작품의 상세 페이지로 이동한다', null, { ai, loginPage, page }); 
    await And('작품 카드에는 썸네일, #장르명, 뱃지, 작품명, 작가명이 표시된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-027.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입하여 우 상단의 검색 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 임의의 텍스트를 입력하고 엔터 키를 누른다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 검색 결과 화면이 표시된다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 매칭된 키워드에 해당하는 작품 리스트가 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When 사용자가 임의의 작품을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 선택한 작품의 상세 페이지로 이동한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 작품 카드에는 썸네일, #장르명, 뱃지, 작품명, 작가명이 표시된다","stepMatchArguments":[]}]},
]; // bdd-data-end