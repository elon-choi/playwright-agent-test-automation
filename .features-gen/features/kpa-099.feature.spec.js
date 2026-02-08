// Generated from: features/kpa-099.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-099 시나리오 검증', () => {

  test('정보 탭 UI 요소 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 로그인하지 않은 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 정보 탭을 클릭한다', null, { ai, loginPage, page }); 
    await Then('정보 탭 하단에 다음 요소들이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"요소"}]},{"cells":[{"value":"DA 광고 영역"}]},{"cells":[{"value":"줄거리"}]},{"cells":[{"value":"키워드"}]},{"cells":[{"value":"티저 영상 (티저 영상이 있을 경우에만)"}]},{"cells":[{"value":"이 작품과 함께보는 웹툰"}]},{"cells":[{"value":"이 작가의 다른 작품 (다른 작품이 있을 경우에만)"}]},{"cells":[{"value":"동일작 (동일작이 있을 경우에만)"}]},{"cells":[{"value":"상세 정보"}]}]}}, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-099.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인하지 않은 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 정보 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 정보 탭 하단에 다음 요소들이 노출된다:","stepMatchArguments":[]}]},
]; // bdd-data-end