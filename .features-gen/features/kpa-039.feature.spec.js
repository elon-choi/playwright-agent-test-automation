// Generated from: features/kpa-039.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-039 좋아요 탭 작품 삭제 기능 검증', () => {

  test('사용자가 좋아요 탭에서 작품을 삭제한다', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인하여 좋아요 탭에 접근할 수 있다', null, { ai, loginPage, page }); 
    await When('사용자가 좋아요 탭 하단의 작품 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 편집 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 작품을 선택한다', null, { ai, loginPage, page }); 
    await And('사용자가 하단의 선택 항목 삭제 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('선택 항목 삭제 버튼이 활성화된다', null, { ai, loginPage, page }); 
    await And('선택한 작품이 삭제되어 좋아요 탭 리스트에서 더 이상 보이지 않는다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-039.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인하여 좋아요 탭에 접근할 수 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 좋아요 탭 하단의 작품 리스트를 확인한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 편집 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 임의의 작품을 선택한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 하단의 선택 항목 삭제 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 선택 항목 삭제 버튼이 활성화된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 선택한 작품이 삭제되어 좋아요 탭 리스트에서 더 이상 보이지 않는다","stepMatchArguments":[]}]},
]; // bdd-data-end