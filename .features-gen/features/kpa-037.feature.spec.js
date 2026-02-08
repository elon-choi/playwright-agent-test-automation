// Generated from: features/kpa-037.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-037 시나리오 검증', () => {

  test('좋아요 순 정렬 상태에서 작품 좋아요 후 보관함 반영 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 "좋아요 순 정렬"을 선택한 상태이다', null, { ai, loginPage, page }); 
    await When('사용자가 웹 페이지에 진입한 후 하단의 "보관함" 메뉴를 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 "좋아요" 탭 하단의 작품 리스트를 확인한다', null, { ai, loginPage, page }); 
    await And('사용자가 "메인홈 > 웹툰 > 실시간 랭킹"에서 2위 작품을 클릭하고 "좋아요" 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 "보관함 > 좋아요 작품탭" 하단의 작품 리스트를 확인한다', null, { ai, loginPage, page }); 
    await Then('"좋아요 작품탭"의 최상단에 3번에서 선택한 작품이 이력으로 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-037.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 \"좋아요 순 정렬\"을 선택한 상태이다","stepMatchArguments":[{"group":{"start":5,"value":"\"좋아요 순 정렬\"","children":[{"start":6,"value":"좋아요 순 정렬","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 웹 페이지에 진입한 후 하단의 \"보관함\" 메뉴를 클릭한다","stepMatchArguments":[{"group":{"start":22,"value":"\"보관함\"","children":[{"start":23,"value":"보관함","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 \"좋아요\" 탭 하단의 작품 리스트를 확인한다","stepMatchArguments":[{"group":{"start":5,"value":"\"좋아요\"","children":[{"start":6,"value":"좋아요","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 사용자가 \"메인홈 > 웹툰 > 실시간 랭킹\"에서 2위 작품을 클릭하고 \"좋아요\" 아이콘을 클릭한다","stepMatchArguments":[{"group":{"start":5,"value":"\"메인홈 > 웹툰 > 실시간 랭킹\"","children":[{"start":6,"value":"메인홈 > 웹툰 > 실시간 랭킹","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":39,"value":"\"좋아요\"","children":[{"start":40,"value":"좋아요","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 사용자가 \"보관함 > 좋아요 작품탭\" 하단의 작품 리스트를 확인한다","stepMatchArguments":[{"group":{"start":5,"value":"\"보관함 > 좋아요 작품탭\"","children":[{"start":6,"value":"보관함 > 좋아요 작품탭","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then \"좋아요 작품탭\"의 최상단에 3번에서 선택한 작품이 이력으로 노출된다","stepMatchArguments":[{"group":{"start":0,"value":"\"좋아요 작품탭\"","children":[{"start":1,"value":"좋아요 작품탭","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end