// Generated from: features/kpa-125.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-125 시나리오 검증', () => {

  test('자동 스크롤 버튼 노출 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('전체 연령 작품 목록을 확인한다', null, { ai, loginPage, page }); 
    await And('무료 회차 목록을 확인한다', null, { ai, loginPage, page }); 
    await When('사용자가 무료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('뷰어 상단의 설정 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('자동 스크롤 활성 버튼을 On으로 설정한다', null, { ai, loginPage, page }); 
    await And('뷰어 이미지 영역을 클릭한다', null, { ai, loginPage, page }); 
    await Then('우측 하단에 자동 스크롤 버튼이 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-125.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 전체 연령 작품 목록을 확인한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 무료 회차 목록을 확인한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 무료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 뷰어 상단의 설정 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 자동 스크롤 활성 버튼을 On으로 설정한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 뷰어 이미지 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 우측 하단에 자동 스크롤 버튼이 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end