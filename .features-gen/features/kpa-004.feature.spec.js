// Generated from: features/kpa-004.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-004 닉네임 변경 기능 검증', () => {

  test('닉네임 변경 시 최대 글자 수 제한 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 로그인되어 있다', null, { ai, loginPage, page }); 
    await When('사용자가 우측 상단의 프로필 아이콘을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자 정보 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('닉네임 영역을 클릭한다', null, { ai, loginPage, page }); 
    await And('17자 이상의 닉네임을 입력한다', null, { ai, loginPage, page }); 
    await And('수정하기 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('닉네임이 최대 16자까지만 저장된다', null, { ai, loginPage, page }); 
    await And('"elon님17자이상닉네임변경테"로 노출된다', null, { ai, loginPage, page }); 
    await When('좌측 상단의 뒤로가기[⬅︎] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('더보기 페이지로 이동하며, 변경된 닉네임이 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-004.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 로그인되어 있다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 우측 상단의 프로필 아이콘을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자 정보 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And 닉네임 영역을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And 17자 이상의 닉네임을 입력한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And 수정하기 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 닉네임이 최대 16자까지만 저장된다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And \"elon님17자이상닉네임변경테\"로 노출된다","stepMatchArguments":[{"group":{"start":0,"value":"\"elon님17자이상닉네임변경테\"","children":[{"start":1,"value":"elon님17자이상닉네임변경테","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When 좌측 상단의 뒤로가기[⬅︎] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then 더보기 페이지로 이동하며, 변경된 닉네임이 노출된다","stepMatchArguments":[]}]},
]; // bdd-data-end