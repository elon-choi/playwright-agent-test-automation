// Generated from: features/kpa-065.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-065 시나리오 검증', () => {

  test('작품 카드 클릭 후 이미지 확대 및 닫기 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자는 로그인하지 않은 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 카카오페이지 웹에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 작품 카드를 클릭한다', null, { ai, loginPage, page }); 
    await Then('메인 대표 이미지 영역이 화면에 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 대표 이미지를 클릭한다', null, { ai, loginPage, page }); 
    await Then('대표 이미지가 화면 전체 사이즈로 확대된다', null, { ai, loginPage, page }); 
    await When('사용자가 확대된 이미지를 닫기 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('이전 화면으로 돌아가고, 대표 섬네일 이미지가 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-065.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자는 로그인하지 않은 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 카카오페이지 웹에 접속한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 임의의 작품 카드를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 메인 대표 이미지 영역이 화면에 표시된다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When 사용자가 대표 이미지를 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 대표 이미지가 화면 전체 사이즈로 확대된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When 사용자가 확대된 이미지를 닫기 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then 이전 화면으로 돌아가고, 대표 섬네일 이미지가 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end