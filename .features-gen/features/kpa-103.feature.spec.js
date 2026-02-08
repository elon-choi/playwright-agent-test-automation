// Generated from: features/kpa-103.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-103 시나리오 검증', () => {

  test('소식 탭 UI 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 로그인하지 않은 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 "소식" 탭을 클릭한다', null, { ai, loginPage, page }); 
    await Then('페이지는 "소식" 탭의 내용을 표시한다', null, { ai, loginPage, page }); 
    await And('페이지 하단에 "DA 광고 영역"이 있을 경우 노출된다', null, { ai, loginPage, page }); 
    await And('페이지 하단에 "작품 소식 영역" 또는 안내 문구가 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-103.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인하지 않은 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 \"소식\" 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 페이지는 \"소식\" 탭의 내용을 표시한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"And 페이지 하단에 \"DA 광고 영역\"이 있을 경우 노출된다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 페이지 하단에 \"작품 소식 영역\" 또는 안내 문구가 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end