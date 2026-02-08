// Generated from: features/kpa-061.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-061 시나리오 검증', () => {

  test('오늘신작 메뉴 및 작품 홈 이동 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 로그인하지 않은 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 상단의 추천 GNB 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 오늘신작 서브탭을 클릭한다', null, { ai, loginPage, page }); 
    await Then('오늘신작 메뉴 하단에 다음 요소들이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"요소명"}]},{"cells":[{"value":"웹툰 탭"}]},{"cells":[{"value":"웹소설 탭"}]},{"cells":[{"value":"책 탭"}]},{"cells":[{"value":"TODAY 섹션"}]}]}}, { ai, loginPage, page }); 
    await When('사용자가 첫번째 신작 작품을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자는 클릭한 작품의 작품홈으로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-061.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인하지 않은 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 상단의 추천 GNB 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 오늘신작 서브탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 오늘신작 메뉴 하단에 다음 요소들이 노출된다:","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When 사용자가 첫번째 신작 작품을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"And 사용자는 클릭한 작품의 작품홈으로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end