// Generated from: features/kpa-086.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-086 시나리오 검증', () => {

  test('기다무 충전 영역 노출 확인', async ({ Given, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인하여 기다무 작품 BM을 선택하고 기다무 충전이 완료된 상태이다', null, { ai, loginPage, page }); 
    await And('사용자가 홈 탭 하단의 회차 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 기다무 충전 영역을 확인한다', null, { ai, loginPage, page }); 
    await Then('기다무 충전 영역이 화면에 노출되어야 한다', null, { ai, loginPage, page }); 
    await And('기다무 대여권 1장이 "{N}일(시간)" 동안 사용 가능하다는 메시지가 표시되어야 한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-086.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인하여 기다무 작품 BM을 선택하고 기다무 충전이 완료된 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 홈 탭 하단의 회차 리스트를 확인한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자가 기다무 충전 영역을 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 기다무 충전 영역이 화면에 노출되어야 한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 기다무 대여권 1장이 \"{N}일(시간)\" 동안 사용 가능하다는 메시지가 표시되어야 한다","stepMatchArguments":[{"group":{"start":12,"value":"\"{N}일(시간)\"","children":[{"start":13,"value":"{N}일(시간)","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end