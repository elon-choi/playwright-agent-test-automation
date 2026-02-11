// Generated from: features/kpa-071.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-071 시나리오 검증', () => {

  test('사용자가 카카오 페이지에서 이용권 내역 화면으로 이동', async ({ Given, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인되어 있다', null, { ai, loginPage, page }); 
    await And('사용자가 임의의 작품을 클릭한다.', null, { ai, loginPage, page }); 
    await And('사용자가 좌측 작품 정보 영역 이미지 하단의 대여권 n장 소장권 n장 > 영역에서 > 아이콘을 클릭한다.', null, { ai, loginPage, page }); 
    await Then('이용권 내역 화면으로 이동한다', null, { ai, loginPage, page }); 
    await And('이용권 내역 화면에 보유 이용권 내역이 노출된다. (보유 이용권이 없는 경우 이 작품에 대한 이용권 내역이 없습니다. 메세지가 노출된다.)', null, { ai, loginPage, page }); 
    await And('좌측 상단의 <- 뒤로 가기 아이콘을 클릭한다.', null, { ai, loginPage, page }); 
    await Then('작품홈 화면으로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-071.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인되어 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 임의의 작품을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자가 좌측 작품 정보 영역 이미지 하단의 대여권 n장 소장권 n장 > 영역에서 > 아이콘을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 이용권 내역 화면으로 이동한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 이용권 내역 화면에 보유 이용권 내역이 노출된다. (보유 이용권이 없는 경우 이 작품에 대한 이용권 내역이 없습니다. 메세지가 노출된다.)","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And 좌측 상단의 <- 뒤로 가기 아이콘을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 작품홈 화면으로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end