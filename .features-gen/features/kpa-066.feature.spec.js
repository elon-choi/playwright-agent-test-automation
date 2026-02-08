// Generated from: features/kpa-066.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-066 시나리오 검증', () => {

  test('작품 정보가 올바르게 노출되는지 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('페이지가 완전히 로드된다', null, { ai, loginPage, page }); 
    await When('사용자가 작품명 영역을 확인한다', null, { ai, loginPage, page }); 
    await Then('작품명이 올바르게 노출된다', null, { ai, loginPage, page }); 
    await When('사용자가 작가명 영역을 확인한다', null, { ai, loginPage, page }); 
    await Then('작가명이 올바르게 노출된다', null, { ai, loginPage, page }); 
    await When('사용자가 장르 영역을 확인한다', null, { ai, loginPage, page }); 
    await Then('장르가 올바르게 노출된다', null, { ai, loginPage, page }); 
    await When('사용자가 누적 열람 수와 좋아요 수를 확인한다', null, { ai, loginPage, page }); 
    await Then('누적 열람 수와 좋아요 수가 올바르게 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-066.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 페이지가 완전히 로드된다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 작품명 영역을 확인한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 작품명이 올바르게 노출된다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 작가명 영역을 확인한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 작가명이 올바르게 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When 사용자가 장르 영역을 확인한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 장르가 올바르게 노출된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When 사용자가 누적 열람 수와 좋아요 수를 확인한다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then 누적 열람 수와 좋아요 수가 올바르게 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end