// Generated from: features/kpa-059.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-059 시나리오 검증', () => {

  test('요일연재 메뉴를 통한 페이지 이동 및 구성 요소 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => {
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page });
    await And('사용자는 로그인하지 않은 상태이다', null, { ai, loginPage, page });
    await When('사용자가 웹 페이지 하단의 요일연재 메뉴를 클릭한다', null, { ai, loginPage, page });
    await Then('요일연재 메뉴 화면이 다음과 같이 구성되어 있는지 확인한다:', {"dataTable":{"rows":[{"cells":[{"value":"항목"}]},{"cells":[{"value":"요일 탭 (월, 화, 수, 목, 금, 토, 일)"}]},{"cells":[{"value":"\"전체\", \"카웹Zone\", \"웹툰\", \"웹소설\" 탭"}]},{"cells":[{"value":"\"카웹Zone\", \"웹툰\", \"웹소설\" 섹션"}]},{"cells":[{"value":"작품 리스트"}]}]}}, { ai, loginPage, page });
    await When('사용자가 임의의 요일연재 메뉴를 클릭한다', null, { ai, loginPage, page });
    await Then('사용자는 클릭한 메뉴에 해당하는 페이지로 이동한다', null, { ai, loginPage, page });
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-059.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인하지 않은 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지 하단의 요일연재 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 요일연재 메뉴 화면이 다음과 같이 구성되어 있는지 확인한다:","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When 사용자가 임의의 요일연재 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 클릭한 메뉴에 해당하는 페이지로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end
