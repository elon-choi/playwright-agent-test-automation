// Generated from: features/kpa-028.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-028 시나리오 검증', () => {

  test('최근 검색어를 통한 자동 완성 및 검색 결과 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('최근 검색어가 존재한다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 우 상단의 "검색" 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('검색창 하단의 임의의 최근 검색어를 클릭한다', null, { ai, loginPage, page }); 
    await Then('자동 완성 검색어가 노출된다', null, { ai, loginPage, page }); 
    await And('해당 검색어에 해당되는 검색 결과가 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-028.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 최근 검색어가 존재한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 우 상단의 \"검색\" 아이콘을 클릭한다","stepMatchArguments":[{"group":{"start":24,"value":"\"검색\"","children":[{"start":25,"value":"검색","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 검색창 하단의 임의의 최근 검색어를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 자동 완성 검색어가 노출된다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 해당 검색어에 해당되는 검색 결과가 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end