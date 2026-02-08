// Generated from: features/kpa-109.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-109 시나리오 검증', () => {

  test('무료 회차 진입 및 뒤로 가기 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 전체 연령 작품을 선택한다', null, { ai, loginPage, page }); 
    await And('사용자가 무료 회차에 진입한다', null, { ai, loginPage, page }); 
    await When('사용자가 무료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뒤로 가기를 실행한다', null, { ai, loginPage, page }); 
    await Then('뷰어 탭 하단에 다음 UI 요소들이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"요소명"}]},{"cells":[{"value":"회차명 / 캡쳐하기 아이콘 / 설정 메뉴"}]},{"cells":[{"value":"뷰어 이미지"}]},{"cells":[{"value":"가로 스크롤바"}]},{"cells":[{"value":"자동 스크롤 버튼 (활성화 on 시 노출)"}]},{"cells":[{"value":"정주행 버튼 / 댓글 아이콘 / 이전화 / 다음화"}]}]}}, { ai, loginPage, page }); 
    await And('사용자는 작품홈 회차 리스트로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-109.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 전체 연령 작품을 선택한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 무료 회차에 진입한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 무료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 뒤로 가기를 실행한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 뷰어 탭 하단에 다음 UI 요소들이 노출된다:","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And 사용자는 작품홈 회차 리스트로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end