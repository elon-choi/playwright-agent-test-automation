// Generated from: features/kpa-045.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-045 시나리오 검증', () => {

  test('구매작품 탭의 작품 리스트 정렬 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인하여 구매작품 탭에 접근한다', null, { ai, loginPage, page }); 
    await When('사용자가 작품 리스트 상단의 정렬 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 정렬값을 클릭한다', null, { ai, loginPage, page }); 
    await Then('구매 순, 업데이트 순, 제목 순 정렬 옵션이 노출된다', null, { ai, loginPage, page }); 
    await And('선택한 정렬 기준으로 작품이 정렬되어 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-045.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인하여 구매작품 탭에 접근한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 작품 리스트 상단의 정렬 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 임의의 정렬값을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 구매 순, 업데이트 순, 제목 순 정렬 옵션이 노출된다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 선택한 정렬 기준으로 작품이 정렬되어 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end