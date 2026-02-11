// Generated from: features/kpa-085.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-085 이용권 환불 기능 검증', () => {

  test('사용자가 미사용 이용권을 환불하는 경우', async ({ Given, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 로그인 상태이며 미사용 이용권을 보유하고 있다', null, { ai, loginPage, page }); 
    await And('사용자가 홈 탭 하단의 회차 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 보유한 대여권 타입을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 이용권 내역 리스트에서 환불할 항목을 선택하고 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 하단의 "구매 취소하기" 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 "확인" 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('"이용권 구매가 취소 되었습니다."라는 토스트 메시지가 화면에 표시된다', null, { ai, loginPage, page }); 
    await And('사용자의 계정에서 해당 이용권이 정상적으로 환불 처리된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-085.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인 상태이며 미사용 이용권을 보유하고 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 홈 탭 하단의 회차 리스트를 확인한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자가 보유한 대여권 타입을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And 사용자가 이용권 내역 리스트에서 환불할 항목을 선택하고 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And 사용자가 하단의 \"구매 취소하기\" 버튼을 클릭한다","stepMatchArguments":[{"group":{"start":9,"value":"\"구매 취소하기\"","children":[{"start":10,"value":"구매 취소하기","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And 사용자가 \"확인\" 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then \"이용권 구매가 취소 되었습니다.\"라는 토스트 메시지가 화면에 표시된다","stepMatchArguments":[{"group":{"start":0,"value":"\"이용권 구매가 취소 되었습니다.\"","children":[{"start":1,"value":"이용권 구매가 취소 되었습니다.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 사용자의 계정에서 해당 이용권이 정상적으로 환불 처리된다","stepMatchArguments":[]}]},
]; // bdd-data-end