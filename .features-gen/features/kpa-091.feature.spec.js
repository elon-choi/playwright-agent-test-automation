// Generated from: features/kpa-091.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-091 시나리오 검증', () => {

  test('회차 정렬 기능 검증', async ({ Given, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 로그인하지 않은 상태이다', null, { ai, loginPage, page }); 
    await And('사용자가 특정 작품홈에 진입한다', null, { ai, loginPage, page }); 
    await And('사용자가 처음 만나는 독자 혜택 팝업이 있으면 확인을 눌러 닫는다', null, { ai, loginPage, page }); 
    await And('사용자가 홈 탭 하단의 회차 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 정렬 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 "첫화부터" 정렬 옵션을 클릭한다', null, { ai, loginPage, page }); 
    await Then('"첫화부터" 옵션이 화면에 노출된다', null, { ai, loginPage, page }); 
    await And('회차가 1화부터 순서대로 정렬되어 화면에 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-091.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인하지 않은 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 특정 작품홈에 진입한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자가 처음 만나는 독자 혜택 팝업이 있으면 확인을 눌러 닫는다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And 사용자가 홈 탭 하단의 회차 리스트를 확인한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"And 사용자가 정렬 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"And 사용자가 \"첫화부터\" 정렬 옵션을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then \"첫화부터\" 옵션이 화면에 노출된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 회차가 1화부터 순서대로 정렬되어 화면에 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end