// Generated from: features/kpa-054.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-054 시나리오 검증', () => {

  test('운영중인 배너의 상호작용 및 이동 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('운영중인 배너가 3개 이상 존재한다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입하여 상단의 웹소설 GNB 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('배너 영역의 다음 화살표 버튼을 클릭하여 배너가 변경됨을 확인한다', null, { ai, loginPage, page }); 
    await And('현재 노출된 운영 배너의 링크 정보를 저장하고 클릭한다', null, { ai, loginPage, page }); 
    await Then('저장된 링크 주소로 페이지가 이동하였는지 확인한다', null, { ai, loginPage, page }); 
    await Then('운영 배너가 노출된다', null, { ai, loginPage, page }); 
    await And('배너는 배경 및 썸네일, 메인타이틀, 서브타이틀, 뱃지, 배너 순서로 구성된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-054.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 운영중인 배너가 3개 이상 존재한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입하여 상단의 웹소설 GNB 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 배너 영역의 다음 화살표 버튼을 클릭하여 배너가 변경됨을 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 현재 노출된 운영 배너의 링크 정보를 저장하고 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 저장된 링크 주소로 페이지가 이동하였는지 확인한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 운영 배너가 노출된다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 배너는 배경 및 썸네일, 메인타이틀, 서브타이틀, 뱃지, 배너 순서로 구성된다","stepMatchArguments":[]}]},
]; // bdd-data-end