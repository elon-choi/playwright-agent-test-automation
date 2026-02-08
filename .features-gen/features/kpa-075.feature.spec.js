// Generated from: features/kpa-075.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-075 시나리오 검증', () => {

  test('모바일 웹에서 첫 화 감상(이펍 뷰어)', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 모바일 웹 브라우저로 접속했을 때', null, { ai, loginPage, page }); 
    await And('사용자가 회차 감상 이력이 없는 경우', null, { ai, loginPage, page }); 
    await And('사용자가 이펍 뷰어를 사용 중일 때', null, { ai, loginPage, page }); 
    await When('사용자가 첫 화 보기 탭을 클릭하면', null, { ai, loginPage, page }); 
    await And('사용자가 화면을 스크롤하면', null, { ai, loginPage, page }); 
    await And('사용자가 [뷰어로 보기] 버튼을 클릭하면', null, { ai, loginPage, page }); 
    await Then('첫 화 보기 탭이 노출되고, 연재 정보와 줄거리, 압축 해제 이후 원고 이미지가 노출된다', null, { ai, loginPage, page }); 
    await And('[뷰어로 보기] 버튼이 계속해서 노출된다', null, { ai, loginPage, page }); 
    await And('감상 중인 회차의 뷰어가 화면에 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-075.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 모바일 웹 브라우저로 접속했을 때","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 회차 감상 이력이 없는 경우","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 이펍 뷰어를 사용 중일 때","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 첫 화 보기 탭을 클릭하면","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 화면을 스크롤하면","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 [뷰어로 보기] 버튼을 클릭하면","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 첫 화 보기 탭이 노출되고, 연재 정보와 줄거리, 압축 해제 이후 원고 이미지가 노출된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And [뷰어로 보기] 버튼이 계속해서 노출된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 감상 중인 회차의 뷰어가 화면에 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end