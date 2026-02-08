// Generated from: features/kpa-018.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-018 캐시 내역 검증', () => {

  test('사용자가 캐시 내역을 확인하고 충전 및 사용 내역을 검토한다', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('캐시 내역 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await Then('캐시 내역 화면이 다음과 같이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"요소"},{"value":"설명"}]},{"cells":[{"value":"메인홈 아이콘"},{"value":"타이틀 문구: 캐시 내역"}]},{"cells":[{"value":"캐시충전 버튼"},{"value":""}]},{"cells":[{"value":"보유 캐시 상세 영역"},{"value":""}]},{"cells":[{"value":"배너 영역"},{"value":""}]},{"cells":[{"value":"충전 내역 탭"},{"value":""}]},{"cells":[{"value":"사용 내역 탭"},{"value":""}]}]}}, { ai, loginPage, page }); 
    await When('사용자가 충전 내역 탭을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자의 캐시 충전 리스트가 최근 리스트 순서대로 노출된다', null, { ai, loginPage, page }); 
    await When('사용자가 사용 내역 탭을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자의 캐시 사용 리스트가 최근 리스트 순서대로 노출된다', null, { ai, loginPage, page }); 
    await When('사용자가 [캐시 충전] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('캐시 충전 메뉴로 이동된다', null, { ai, loginPage, page }); 
    await When('사용자가 좌측 상단 뒤로가기[⬅︎] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('캐시 내역 화면으로 다시 이동된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-018.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And 캐시 내역 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 캐시 내역 화면이 다음과 같이 노출된다:","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When 사용자가 충전 내역 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then 사용자의 캐시 충전 리스트가 최근 리스트 순서대로 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When 사용자가 사용 내역 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then 사용자의 캐시 사용 리스트가 최근 리스트 순서대로 노출된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When 사용자가 [캐시 충전] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then 캐시 충전 메뉴로 이동된다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When 사용자가 좌측 상단 뒤로가기[⬅︎] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then 캐시 내역 화면으로 다시 이동된다","stepMatchArguments":[]}]},
]; // bdd-data-end