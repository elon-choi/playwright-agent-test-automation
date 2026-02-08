// Generated from: features/kpa-031.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-031 시나리오 검증', () => {

  test('감상 이력이 있는 사용자의 보관함 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자의 계정에 감상 이력이 존재한다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입하여 우측 상단의 보관함 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await Then('최근본 탭 하단에 작품 리스트가 표시된다', null, { ai, loginPage, page }); 
    await When('사용자가 임의의 작품 이미지를 클릭한다', null, { ai, loginPage, page }); 
    await Then('해당 작품의 홈 페이지로 이동한다', null, { ai, loginPage, page }); 
    await When('사용자가 임의의 작품에서 이어보기 또는 다음화 보기 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await Then('최근본 작품이 정렬 기준에 따라 노출된다', null, { ai, loginPage, page }); 
    await And('사용자의 회차 열람 이력 및 보유한 이용권 수에 따라 이어보기 또는 다음 회차로 진입한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-031.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자의 계정에 감상 이력이 존재한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입하여 우측 상단의 보관함 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then 최근본 탭 하단에 작품 리스트가 표시된다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 임의의 작품 이미지를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 해당 작품의 홈 페이지로 이동한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When 사용자가 임의의 작품에서 이어보기 또는 다음화 보기 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 최근본 작품이 정렬 기준에 따라 노출된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 사용자의 회차 열람 이력 및 보유한 이용권 수에 따라 이어보기 또는 다음 회차로 진입한다","stepMatchArguments":[]}]},
]; // bdd-data-end