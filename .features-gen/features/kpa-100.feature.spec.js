// Generated from: features/kpa-100.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-100 시나리오 검증', () => {

  test('키워드 검색 및 작품 정보 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 정보 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 [키워드]를 클릭한다', null, { ai, loginPage, page }); 
    await Then('키워드가 검색 결과 페이지에 노출된다', null, { ai, loginPage, page }); 
    await And('사용자가 작품 리스트를 확인할 수 있다', null, { ai, loginPage, page }); 
    await When('사용자가 임의의 작품을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자는 해당 작품의 상세 페이지로 이동한다', null, { ai, loginPage, page }); 
    await And('작품 이미지, BM, 장르, 작품명, 작가명이 상세 페이지에 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-100.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 정보 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 임의의 [키워드]를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 키워드가 검색 결과 페이지에 노출된다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 사용자가 작품 리스트를 확인할 수 있다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When 사용자가 임의의 작품을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 해당 작품의 상세 페이지로 이동한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 작품 이미지, BM, 장르, 작품명, 작가명이 상세 페이지에 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end