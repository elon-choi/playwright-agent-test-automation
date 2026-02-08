// Generated from: features/kpa-021.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-021 시나리오 검증', () => {

  test('공지사항 내역 확인 및 뒤로가기 동작 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사전 조건이 없다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('공지사항 내역 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('임의의 공지사항을 클릭한다', null, { ai, loginPage, page }); 
    await And('좌측 상단의 뒤로가기[⬅︎] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('공지사항 화면이 다음과 같이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"요소"}]},{"cells":[{"value":"메인홈 아이콘 (mw only)"}]},{"cells":[{"value":"타이틀 문구: 공지사항"}]},{"cells":[{"value":"공지사항 리스트"}]}]}}, { ai, loginPage, page }); 
    await And('선택한 공지사항이 확장되어 노출된다', null, { ai, loginPage, page }); 
    await And('사용자가 공지사항 페이지를 빠져 나와, 더보기 메뉴로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-021.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사전 조건이 없다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 공지사항 내역 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 임의의 공지사항을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 좌측 상단의 뒤로가기[⬅︎] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 공지사항 화면이 다음과 같이 노출된다:","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And 선택한 공지사항이 확장되어 노출된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And 사용자가 공지사항 페이지를 빠져 나와, 더보기 메뉴로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end