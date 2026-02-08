// Generated from: features/kpa-088.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-088 시나리오 검증', () => {

  test('기다무 안내 팝업 노출 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 "기다무 작품 BM"을 선택한다', null, { ai, loginPage, page }); 
    await When('사용자가 "회차 탭"을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 "기다무 충전 영역"을 클릭한다', null, { ai, loginPage, page }); 
    await Then('"기다무 안내 팝업"이 화면에 노출된다', null, { ai, loginPage, page }); 
    await And('팝업에는 다음과 같은 내용이 포함되어야 한다:', {"dataTable":{"rows":[{"cells":[{"value":"내용"}]},{"cells":[{"value":"기다리면 무료 이용권을 사용 후, {n일}을 기다리면 이용권 {n장}을 드립니다."}]},{"cells":[{"value":"해당 이용권을 사용한 회차는 {n일} 동안 볼 수 있습니다."}]},{"cells":[{"value":"최신 {n편}(무료편 포함)은 해당 이용권으로 볼 수 없습니다."}]},{"cells":[{"value":"이용권이 지급되면 푸시 알림으로 안내드립니다."}]},{"cells":[{"value":"닫기 버튼"}]}]}}, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-088.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 \"기다무 작품 BM\"을 선택한다","stepMatchArguments":[{"group":{"start":5,"value":"\"기다무 작품 BM\"","children":[{"start":6,"value":"기다무 작품 BM","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 \"회차 탭\"을 클릭한다","stepMatchArguments":[{"group":{"start":5,"value":"\"회차 탭\"","children":[{"start":6,"value":"회차 탭","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 \"기다무 충전 영역\"을 클릭한다","stepMatchArguments":[{"group":{"start":5,"value":"\"기다무 충전 영역\"","children":[{"start":6,"value":"기다무 충전 영역","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then \"기다무 안내 팝업\"이 화면에 노출된다","stepMatchArguments":[{"group":{"start":0,"value":"\"기다무 안내 팝업\"","children":[{"start":1,"value":"기다무 안내 팝업","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 팝업에는 다음과 같은 내용이 포함되어야 한다:","stepMatchArguments":[]}]},
]; // bdd-data-end