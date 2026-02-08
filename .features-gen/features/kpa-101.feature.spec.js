// Generated from: features/kpa-101.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-101 시나리오 검증', () => {

  test('웹툰의 관련 소설 영역으로 이동', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/content/58095657?tab_type=about" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 로그인하지 않은 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 상단 메뉴에서 "정보" 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 정보 탭 하단의 "동일작" 섹션에서 원작 소설 작품을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자는 해당 작품홈 페이지로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-101.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/content/58095657?tab_type=about\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/content/58095657?tab_type=about\"","children":[{"start":6,"value":"https://page.kakao.com/content/58095657?tab_type=about","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인하지 않은 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 상단 메뉴에서 \"정보\" 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 정보 탭 하단의 \"동일작\" 섹션에서 원작 소설 작품을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 해당 작품홈 페이지로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end