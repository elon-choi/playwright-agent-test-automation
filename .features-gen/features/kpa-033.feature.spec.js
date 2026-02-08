// Generated from: features/kpa-033.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-033 시나리오 검증', () => {

  test('최근본 탭과 검색 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인되어 있다', null, { ai, loginPage, page }); 
    await And('최근본 탭에 작품 리스트가 존재한다', null, { ai, loginPage, page }); 
    await When('사용자가 최근본 탭을 클릭한다', null, { ai, loginPage, page }); 
    await Then('최근본 탭 하단에 작품 리스트가 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 페이지 상단의 검색 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('"임의의 작품명"을 검색어 입력란에 입력한다', null, { ai, loginPage, page }); 
    await And('검색 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('검색 결과에 "임의의 작품명"이 포함된 작품 리스트가 표시된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-033.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인되어 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 최근본 탭에 작품 리스트가 존재한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 최근본 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 최근본 탭 하단에 작품 리스트가 표시된다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When 사용자가 페이지 상단의 검색 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And \"임의의 작품명\"을 검색어 입력란에 입력한다","stepMatchArguments":[{"group":{"start":0,"value":"\"임의의 작품명\"","children":[{"start":1,"value":"임의의 작품명","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And 검색 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then 검색 결과에 \"임의의 작품명\"이 포함된 작품 리스트가 표시된다","stepMatchArguments":[{"group":{"start":7,"value":"\"임의의 작품명\"","children":[{"start":8,"value":"임의의 작품명","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end