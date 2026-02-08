// Generated from: features/kpa-029.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-029 시나리오 검증', () => {

  test('검색 결과가 없는 경우 검색 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await When('사용자가 우 상단의 검색 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 검색 입력란에 "임의의 텍스트"를 입력하고 엔터 키를 누른다', null, { ai, loginPage, page }); 
    await Then('사용자는 검색 결과 페이지로 이동한다', null, { ai, loginPage, page }); 
    await And('화면 중간에 "검색 결과가 없습니다."라는 텍스트가 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-029.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When 사용자가 우 상단의 검색 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And 사용자가 검색 입력란에 \"임의의 텍스트\"를 입력하고 엔터 키를 누른다","stepMatchArguments":[{"group":{"start":13,"value":"\"임의의 텍스트\"","children":[{"start":14,"value":"임의의 텍스트","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 검색 결과 페이지로 이동한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And 화면 중간에 \"검색 결과가 없습니다.\"라는 텍스트가 노출된다","stepMatchArguments":[{"group":{"start":7,"value":"\"검색 결과가 없습니다.\"","children":[{"start":8,"value":"검색 결과가 없습니다.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end