// Generated from: features/kpa-012.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-012 시나리오 검증', () => {

  test('비로그인 상태에서 유료 회차 접근 시 로그인 유도 팝업 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 비로그인 상태이다', null, { ai, loginPage, page }); 
    await And('사용자가 "기다무" 작품의 BM 카테고리를 선택한다', null, { ai, loginPage, page }); 
    await When('사용자가 작품 이미지 좌측 상단에 3다무 또는 기다무 뱃지가 있는 작품 카드를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 특정 작품홈에 진입한다', null, { ai, loginPage, page }); 
    await And('사용자가 홈 탭 하단의 회차 리스트에서 최신 유료 회차를 클릭한다', null, { ai, loginPage, page }); 
    await Then('콘텐츠 열람 안내 팝업이 다음과 같이 노출된다:', {"dataTable":{"rows":[{"cells":[{"value":"메시지 내용"}]},{"cells":[{"value":"해당 콘텐츠를 열람하시려면 로그인이 필요합니다."}]},{"cells":[{"value":"취소 / 로그인 하기"}]}]}}, { ai, loginPage, page }); 
    await When('사용자가 "로그인 하기" 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('사용자가 카카오 로그인 페이지로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-012.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 비로그인 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And 사용자가 \"기다무\" 작품의 BM 카테고리를 선택한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When 사용자가 작품 이미지 좌측 상단에 3다무 또는 기다무 뱃지가 있는 작품 카드를 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 특정 작품홈에 진입한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 홈 탭 하단의 회차 리스트에서 최신 유료 회차를 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then 콘텐츠 열람 안내 팝업이 다음과 같이 노출된다:","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When 사용자가 \"로그인 하기\" 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then 사용자가 카카오 로그인 페이지로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end