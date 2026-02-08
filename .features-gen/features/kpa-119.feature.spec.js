// Generated from: features/kpa-119.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-119 시나리오 검증', () => {

  test('무료 회차에서 댓글창 팝업 및 뷰어 엔드 영역 노출 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 전체 연령 작품 목록을 본다', null, { ai, loginPage, page }); 
    await And('사용자가 무료 회차에 진입한다', null, { ai, loginPage, page }); 
    await When('사용자가 무료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뷰어 이미지의 최하단까지 스크롤한다', null, { ai, loginPage, page }); 
    await And('사용자가 댓글 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 닫기 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('해당 회차의 Best 탭에 포커싱된 댓글창이 팝업된다', null, { ai, loginPage, page }); 
    await And('팝업창이 종료된 후 뷰어 엔드 영역이 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-119.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 전체 연령 작품 목록을 본다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 무료 회차에 진입한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 무료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 뷰어 이미지의 최하단까지 스크롤한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 댓글 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 사용자가 닫기 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 해당 회차의 Best 탭에 포커싱된 댓글창이 팝업된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 팝업창이 종료된 후 뷰어 엔드 영역이 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end