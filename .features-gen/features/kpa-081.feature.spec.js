// Generated from: features/kpa-081.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-081 시나리오 검증', () => {

  test('이용권 구매 흐름 검증', async ({ Given, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인하여 계정에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자의 계정이 캐시가 충전된 상태이다', null, { ai, loginPage, page }); 
    await And('상단 GNB 메뉴에서 웹툰 메뉴를 클릭한다.', null, { ai, loginPage, page }); 
    await Then('웹툰 메뉴로 이동한다.', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 웹툰 작품을 클릭한다.', null, { ai, loginPage, page }); 
    await And('사용자가 좌측 작품 정보 영역 이미지 하단의 충전 버튼을 클릭한다.', null, { ai, loginPage, page }); 
    await And('이용권 충전 페이지에서 "대여권 충전" 영역의 첫번째 n00캐시 버튼을 클릭한다.', null, { ai, loginPage, page }); 
    await And('대여권 1장이 기본 선택된 상태에서 하단의 "충전하기" 버튼을 클릭한다.', null, { ai, loginPage, page }); 
    await Then('구매 완료 메시지가 화면에 다음의 요소가 표시되어야 한다.', {"dataTable":{"rows":[{"cells":[{"value":"대여권 1장 구매가 완료되었습니다."}]},{"cells":[{"value":"보유 캐시: nnn캐시"}]},{"cells":[{"value":"확인 버튼"}]}]}}, { ai, loginPage, page }); 
    await And('팝업의 확인 버튼을 클릭한다.', null, { ai, loginPage, page }); 
    await Then('작품홈 홈탭 화면으로 이동한다.', null, { ai, loginPage, page }); 
    await Then('선택한 대여권이 정상적으로 구매되었음을 확인한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-081.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인하여 계정에 접속한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자의 계정이 캐시가 충전된 상태이다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And 상단 GNB 메뉴에서 웹툰 메뉴를 클릭한다.","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then 웹툰 메뉴로 이동한다.","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 사용자가 임의의 웹툰 작품을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 사용자가 좌측 작품 정보 영역 이미지 하단의 충전 버튼을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And 이용권 충전 페이지에서 \"대여권 충전\" 영역의 첫번째 n00캐시 버튼을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And 대여권 1장이 기본 선택된 상태에서 하단의 \"충전하기\" 버튼을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then 구매 완료 메시지가 화면에 다음의 요소가 표시되어야 한다.","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And 팝업의 확인 버튼을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then 작품홈 홈탭 화면으로 이동한다.","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then 선택한 대여권이 정상적으로 구매되었음을 확인한다","stepMatchArguments":[]}]},
]; // bdd-data-end