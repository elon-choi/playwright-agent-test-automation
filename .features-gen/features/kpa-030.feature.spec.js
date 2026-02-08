// Generated from: features/kpa-030.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-030 시나리오 검증', () => {

  test('보관함 메뉴 화면 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 우측 상단의 보관함 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await Then('보관함 메뉴 화면이 구성되어야 한다', null, { ai, loginPage, page }); 
    await And('보관함 화면에 진입하며, 다음과 같은 메뉴가 노출되어야 한다:', {"dataTable":{"rows":[{"cells":[{"value":"항목"}]},{"cells":[{"value":"메인홈 아이콘 및 타이틀 문구: 보관함 (모바일 웹 전용)"}]},{"cells":[{"value":"탭: 최근 본(기본 선택), 좋아요, 구매 작품"}]},{"cells":[{"value":"카테고리 메뉴: 검색, 전체, 웹툰, 웹소설, 책"}]},{"cells":[{"value":"제어 메뉴: 편집, 정렬"}]},{"cells":[{"value":"작품 리스트"}]}]}}, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-030.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 우측 상단의 보관함 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 보관함 메뉴 화면이 구성되어야 한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And 보관함 화면에 진입하며, 다음과 같은 메뉴가 노출되어야 한다:","stepMatchArguments":[]}]},
]; // bdd-data-end