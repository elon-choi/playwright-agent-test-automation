// Generated from: features/kpa-102.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-102 시나리오 검증', () => {

  test('추천 작품 확인 및 이동', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 정보 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 이 작품과 함께보는 웹툰 작품을 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 추천 작품의 썸네일을 클릭한다', null, { ai, loginPage, page }); 
    await Then('추천 작품이 노출된다', null, { ai, loginPage, page }); 
    await And('작품 이미지, BM, 작품명이 노출된다', null, { ai, loginPage, page }); 
    await And('사용자가 해당 작품의 홈으로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-102.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 정보 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 이 작품과 함께보는 웹툰 작품을 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 추천 작품의 썸네일을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 추천 작품이 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 작품 이미지, BM, 작품명이 노출된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 사용자가 해당 작품의 홈으로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end