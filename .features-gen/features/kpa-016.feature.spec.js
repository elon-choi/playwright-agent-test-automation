// Generated from: features/kpa-016.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-016 시나리오 검증', () => {

  test('알림 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 수신 받은 알림 리스트를 보유하고 있다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 알림 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 알림 메시지를 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자는 알림 화면에 진입하며, 다음과 같은 메뉴가 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"항목"}]},{"cells":[{"value":"(모바일 웹 전용) 메인홈 아이콘 / 타이틀 문구: 알림"}]},{"cells":[{"value":"탭: 전체(디폴트), 내 소식, 업데이트"}]},{"cells":[{"value":"DA 배너 광고"}]},{"cells":[{"value":"수신된 알림 리스트"}]}]}}, { ai, loginPage, page }); 
    await And('사용자는 알림 상세 페이지로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-016.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 수신 받은 알림 리스트를 보유하고 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 알림 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 임의의 알림 메시지를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 알림 화면에 진입하며, 다음과 같은 메뉴가 노출된다:","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And 사용자는 알림 상세 페이지로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end