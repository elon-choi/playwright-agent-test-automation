// Generated from: features/kpa-085-2.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-085-2 소장권 환불 검증 (이용권 내역에서)', () => {

  test('소장권 환불 검증 (이용권 내역에서)', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인하여 계정에 접속한다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('이용권 내역 메뉴를 클릭한다.', null, { ai, loginPage, page }); 
    await And('스크롤 다운을 하면서 구매한 이용권 내역이 노출 될때까지 찾는다', null, { ai, loginPage, page }); 
    await And('충전 내역 탭에서 구매한 소장권 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 좌측 작품 정보 영역 이미지 하단의 대여권 n장 소장권 n장 > 영역에서 > 아이콘을 클릭한다.', null, { ai, loginPage, page }); 
    await And('이용권 내역 팝업창에서 구매를 취소할 소장권 타입을 클릭한다', null, { ai, loginPage, page }); 
    await And('이용권 내역 상세 팝업창에서 스크롤 다운 후 구매 취소하기 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('이용권을 취소 하시겠습니까? 메세지 팝업에서 확인 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('이용권 또는 소장권이 취소 되었습니다. 토스트 메세지가 노출되는 걸 확인한다', null, { ai, loginPage, page }); 
    await And('이용권 내역 상세 팝업 우측 상단의 닫기 버튼을 클릭한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-085-2.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인하여 계정에 접속한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 이용권 내역 메뉴를 클릭한다.","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 스크롤 다운을 하면서 구매한 이용권 내역이 노출 될때까지 찾는다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 충전 내역 탭에서 구매한 소장권 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 사용자가 좌측 작품 정보 영역 이미지 하단의 대여권 n장 소장권 n장 > 영역에서 > 아이콘을 클릭한다.","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And 이용권 내역 팝업창에서 구매를 취소할 소장권 타입을 클릭한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And 이용권 내역 상세 팝업창에서 스크롤 다운 후 구매 취소하기 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"And 이용권을 취소 하시겠습니까? 메세지 팝업에서 확인 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then 이용권 또는 소장권이 취소 되었습니다. 토스트 메세지가 노출되는 걸 확인한다","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And 이용권 내역 상세 팝업 우측 상단의 닫기 버튼을 클릭한다","stepMatchArguments":[]}]},
]; // bdd-data-end