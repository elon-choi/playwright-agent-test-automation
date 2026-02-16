// Generated from: features/mw/kpa-074.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('KPA-074 시나리오 검증', () => {

  test('모바일 웹에서 첫 화 보기 및 다음 화 보기 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 모바일 웹 브라우저로 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 회차 감상 이력이 없는 상태이다', null, { ai, loginPage, page }); 
    await And('사용자는 이미지 뷰어를 사용 중이다', null, { ai, loginPage, page }); 
    await When('사용자가 "첫 화 보기" 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 화면을 최하단으로 스크롤한다', null, { ai, loginPage, page }); 
    await And('사용자가 "[다음화 보기]" 영역을 클릭한다', null, { ai, loginPage, page }); 
    await Then('"첫 화 보기" 탭이 노출되고, 연재 정보, 줄거리, 원고 이미지가 화면에 표시된다', null, { ai, loginPage, page }); 
    await And('"[다음 회차]" 영역이 화면에 표시된다', null, { ai, loginPage, page }); 
    await And('다음 회차의 뷰어가 화면에 표시된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/mw/kpa-074.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 모바일 웹 브라우저로 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 회차 감상 이력이 없는 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자는 이미지 뷰어를 사용 중이다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 \"첫 화 보기\" 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 화면을 최하단으로 스크롤한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 \"[다음화 보기]\" 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then \"첫 화 보기\" 탭이 노출되고, 연재 정보, 줄거리, 원고 이미지가 화면에 표시된다","stepMatchArguments":[{"group":{"start":0,"value":"\"첫 화 보기\"","children":[{"start":1,"value":"첫 화 보기","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And \"[다음 회차]\" 영역이 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 다음 회차의 뷰어가 화면에 표시된다","stepMatchArguments":[]}]},
]; // bdd-data-end