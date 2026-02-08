// Generated from: features/kpa-062.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-062 시나리오 검증', () => {

  test('이벤트 페이지 UI 및 흐름 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입하여 상단의 추천 GNB 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 이벤트 서브탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 이벤트 전체 보기 배너를 클릭한다', null, { ai, loginPage, page }); 
    await Then('이벤트 메뉴 하단에 다음 요소들이 노출되어야 한다:', {"dataTable":{"rows":[{"cells":[{"value":"요소"}]},{"cells":[{"value":"빅배너 (시리즈 연동 / 이벤트)"}]},{"cells":[{"value":"DA 광고 영역"}]},{"cells":[{"value":"이벤트 리스트"}]},{"cells":[{"value":"이벤트 전체 보기 랜딩 배너"}]},{"cells":[{"value":"테마 섹션"}]}]}}, { ai, loginPage, page }); 
    await And('사용자는 이벤트 전체 페이지로 이동해야 한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-062.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입하여 상단의 추천 GNB 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 이벤트 서브탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 이벤트 전체 보기 배너를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 이벤트 메뉴 하단에 다음 요소들이 노출되어야 한다:","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And 사용자는 이벤트 전체 페이지로 이동해야 한다","stepMatchArguments":[]}]},
]; // bdd-data-end