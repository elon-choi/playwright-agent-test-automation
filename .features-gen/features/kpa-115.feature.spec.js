// Generated from: features/kpa-115.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-115 시나리오 검증', () => {

  test('무료 회차 열람 후 뷰어 엔드 영역 확인 및 작품 홈으로 이동', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 전체 연령 작품을 선택한다', null, { ai, loginPage, page }); 
    await And('사용자가 처음 만나는 독자 혜택 팝업이 있으면 확인을 눌러 닫는다', null, { ai, loginPage, page }); 
    await And('사용자가 무료 회차에 진입한다', null, { ai, loginPage, page }); 
    await When('사용자가 무료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 뷰어 이미지의 최하단까지 스크롤한다', null, { ai, loginPage, page }); 
    await Then('뷰어 엔드 영역에 다음 요소들이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"요소"}]},{"cells":[{"value":"원작 소설로 보기 배너"}]},{"cells":[{"value":"DA 광고 배너"}]},{"cells":[{"value":"작품명 / 좋아요"}]},{"cells":[{"value":"별점 아이콘 / 점수 / 별점 작성 인원수 / 별점 > 버튼"}]},{"cells":[{"value":"댓글 아이콘 / 댓글 수 / 댓글 > 버튼"}]},{"cells":[{"value":"베스트 댓글"}]},{"cells":[{"value":"다음화 이동"}]},{"cells":[{"value":"작품홈 가기 >"}]},{"cells":[{"value":"이작품과 함께 보는 웹툰"}]}]}}, { ai, loginPage, page }); 
    await When('사용자가 뒤로 가기를 실행한다', null, { ai, loginPage, page }); 
    await Then('사용자는 작품홈 회차 리스트로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-115.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 전체 연령 작품을 선택한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 처음 만나는 독자 혜택 팝업이 있으면 확인을 눌러 닫는다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"And 사용자가 무료 회차에 진입한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When 사용자가 무료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 뷰어 이미지의 최하단까지 스크롤한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 뷰어 엔드 영역에 다음 요소들이 노출된다:","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When 사용자가 뒤로 가기를 실행한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then 사용자는 작품홈 회차 리스트로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end