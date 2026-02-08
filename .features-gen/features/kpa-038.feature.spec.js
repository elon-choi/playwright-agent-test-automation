// Generated from: features/kpa-038.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-038 시나리오 검증', () => {

  test('작품 검색 및 리스트 노출 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인하여 계정에 접속한다', null, { ai, loginPage, page }); 
    await And('검색 결과가 있는 경우', null, { ai, loginPage, page }); 
    await When('사용자가 "좋아요" 탭 하단의 작품 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 검색 아이콘을 클릭하고 임의의 작품을 검색한다', null, { ai, loginPage, page }); 
    await Then('검색어에 포함된 작품 리스트가 화면에 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-038.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인하여 계정에 접속한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 검색 결과가 있는 경우","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 \"좋아요\" 탭 하단의 작품 리스트를 확인한다","stepMatchArguments":[{"group":{"start":5,"value":"\"좋아요\"","children":[{"start":6,"value":"좋아요","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 검색 아이콘을 클릭하고 임의의 작품을 검색한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 검색어에 포함된 작품 리스트가 화면에 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end