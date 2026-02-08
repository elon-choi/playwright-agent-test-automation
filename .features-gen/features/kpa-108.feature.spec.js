// Generated from: features/kpa-108.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-108 댓글 차단 기능 검증', () => {

  test('사용자가 특정 유저의 댓글/답글을 차단하는 경우', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('로그인하여 댓글을 볼 수 있는 상태이다', null, { ai, loginPage, page }); 
    await When('댓글 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('[더보기] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('[차단하기] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await And('[차단] 버튼을 클릭한다', null, { ai, loginPage, page }); 
    await Then('"{유저 닉네임}" 님의 댓글/답글을 차단하시겠습니까? 팝업이 노출된다', null, { ai, loginPage, page }); 
    await And('해당 유저의 댓글/답글이 차단되고, 댓글 영역에 "내가 차단한 이용자의 답글입니다."가 노출된다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-108.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 로그인하여 댓글을 볼 수 있는 상태이다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 댓글 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And [더보기] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And [차단하기] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And [차단] 버튼을 클릭한다","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then \"{유저 닉네임}\" 님의 댓글/답글을 차단하시겠습니까? 팝업이 노출된다","stepMatchArguments":[{"group":{"start":0,"value":"\"{유저 닉네임}\"","children":[{"start":1,"value":"{유저 닉네임}","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And 해당 유저의 댓글/답글이 차단되고, 댓글 영역에 \"내가 차단한 이용자의 답글입니다.\"가 노출된다","stepMatchArguments":[{"group":{"start":27,"value":"\"내가 차단한 이용자의 답글입니다.\"","children":[{"start":28,"value":"내가 차단한 이용자의 답글입니다.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end