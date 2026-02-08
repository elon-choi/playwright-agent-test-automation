// Generated from: features/kpa-112.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-112 시나리오 검증', () => {

  test('무료 회차 정주행 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 전체 연령 작품 목록을 본다', null, { ai, loginPage, page }); 
    await And('사용자가 무료 회차 목록에 진입한다', null, { ai, loginPage, page }); 
    await When('사용자가 무료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뷰어 하단의 정주행 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('정주행 안내 가이드 팝업창의 하단 확인 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뷰어 이미지의 최하단까지 스크롤한다', null, { ai, loginPage, page }); 
    await And('사용자가 뷰어 엔드 영역을 확인한다', null, { ai, loginPage, page }); 
    await Then('정주행 아이콘이 활성화되고, 뷰어 엔드 영역에 노출되던 메뉴들(배너, 베스트 댓글 등)이 노출되지 않는다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-112.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 전체 연령 작품 목록을 본다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 무료 회차 목록에 진입한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 무료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 뷰어 하단의 정주행 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 정주행 안내 가이드 팝업창의 하단 확인 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 사용자가 뷰어 이미지의 최하단까지 스크롤한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And 사용자가 뷰어 엔드 영역을 확인한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then 정주행 아이콘이 활성화되고, 뷰어 엔드 영역에 노출되던 메뉴들(배너, 베스트 댓글 등)이 노출되지 않는다","stepMatchArguments":[]}]},
]; // bdd-data-end