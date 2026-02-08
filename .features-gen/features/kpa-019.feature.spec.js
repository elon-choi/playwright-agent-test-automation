// Generated from: features/kpa-019.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-019 시나리오 검증', () => {

  test('이용권 내역 및 사용 내역 탐색', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인되어 있다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('이용권 내역 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('충전 내역 탭을 확인한다', null, { ai, loginPage, page }); 
    await And('사용 내역 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('임의의 사용 내역을 클릭한다', null, { ai, loginPage, page }); 
    await And('좌측 상단 뒤로가기 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('이용권 내역 화면이 다음과 같이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"요소"},{"value":"설명"}]},{"cells":[{"value":"메인홈 아이콘 / 타이틀 문구"},{"value":"이용권 내역"}]},{"cells":[{"value":"충전 내역 / 사용 내역 탭"},{"value":"두 탭이 모두 노출됨"}]}]}}, { ai, loginPage, page }); 
    await And('사용자의 이용권 충전 리스트가 최근 리스트 순서대로 노출된다', null, { ai, loginPage, page }); 
    await And('사용자의 이용권 사용 리스트가 최근 리스트 순서대로 노출된다', null, { ai, loginPage, page }); 
    await And('클릭한 이용권 사용 내역의 대상 페이지로 이동했다', null, { ai, loginPage, page }); 
    await And('이용권 내역 페이지를 빠져 나와, 더보기 메뉴로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-019.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인되어 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 이용권 내역 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 충전 내역 탭을 확인한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용 내역 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 임의의 사용 내역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And 좌측 상단 뒤로가기 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then 이용권 내역 화면이 다음과 같이 노출된다:","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And 사용자의 이용권 충전 리스트가 최근 리스트 순서대로 노출된다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And 사용자의 이용권 사용 리스트가 최근 리스트 순서대로 노출된다","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And 클릭한 이용권 사용 내역의 대상 페이지로 이동했다","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"And 이용권 내역 페이지를 빠져 나와, 더보기 메뉴로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end