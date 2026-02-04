// Generated from: features/kpa-048.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-048 시나리오 검증', () => {

  test('운영 중인 배너의 UI 및 동작 검증', async ({ Given, When, Then, And, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { loginPage, page }); 
    await And('운영 중인 배너가 3개 이상 존재한다', null, { page }); 
    await When('사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다', null, { page }); 
    await And('배너 영역을 좌우로 스와이프한다', null, { page }); 
    await And('운영 배너를 클릭한다', null, { page }); 
    await Then('운영 배너가 노출된다'); 
    await And('배너는 다음 요소로 구성된다:', {"dataTable":{"rows":[{"cells":[{"value":"구성 요소"}]},{"cells":[{"value":"배경 및 썸네일"}]},{"cells":[{"value":"메인타이틀(이미지 alt 포함)"}]},{"cells":[{"value":"뱃지(있을 경우)"}]},{"cells":[{"value":"배너 순서"}]}]}}); 
    await Then('스와이프 동작이 오류 없이 수행된다'); 
    await Then('어드민에 설정된 작품홈 혹은 이벤트 페이지로 이동한다', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-048.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 운영 중인 배너가 3개 이상 존재한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 상단의 추천 GNB 메뉴를 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 배너 영역을 좌우로 스와이프한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 운영 배너를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 운영 배너가 노출된다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 배너는 다음 요소로 구성된다:","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then 스와이프 동작이 오류 없이 수행된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then 어드민에 설정된 작품홈 혹은 이벤트 페이지로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end