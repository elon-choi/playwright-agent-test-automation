// Generated from: features/kpa-005.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-005 로그아웃 기능 검증', () => {

  test('사용자가 카카오 페이지에서 로그아웃을 성공적으로 수행한다', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자 정보 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('로그아웃 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('[로그아웃] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('안내 팝업이 노출된다', null, { ai, loginPage, page }); 
    await And('팝업에는 "로그아웃 하시겠습니까?" 메시지가 표시된다', null, { ai, loginPage, page }); 
    await And('팝업에는 [취소]와 [로그아웃] 버튼이 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 팝업에서 [로그아웃] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자는 로그아웃되고 메인홈으로 이동한다', null, { ai, loginPage, page }); 
    await And('메인홈 페이지가 정상적으로 표시된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-005.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자 정보 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 로그아웃 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And [로그아웃] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 안내 팝업이 노출된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And 팝업에는 \"로그아웃 하시겠습니까?\" 메시지가 표시된다","stepMatchArguments":[{"group":{"start":5,"value":"\"로그아웃 하시겠습니까?\"","children":[{"start":6,"value":"로그아웃 하시겠습니까?","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And 팝업에는 [취소]와 [로그아웃] 버튼이 표시된다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When 사용자가 팝업에서 [로그아웃] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 로그아웃되고 메인홈으로 이동한다","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And 메인홈 페이지가 정상적으로 표시된다","stepMatchArguments":[]}]},
]; // bdd-data-end