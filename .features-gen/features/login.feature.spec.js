// Generated from: features/login.feature
import { test } from "../../steps/fixtures.ts";

test.describe('공통 로그인 시나리오', () => {

  test('미인증 계정으로 로그인 성공', async ({ Given, When, Then, ai, loginPage, page }) => { 
    await Given('사용자가 카카오페이지 로그인 화면을 연다', null, { ai, loginPage, page }); 
    await When('사용자가 미인증 계정으로 로그인한다', null, { ai, loginPage, page }); 
    await Then('추천 홈으로 이동한다', null, { ai, loginPage, page }); 
  });

  test('성인 인증 계정으로 로그인 성공', async ({ Given, When, Then, ai, loginPage, page }) => { 
    await Given('사용자가 카카오페이지 로그인 화면을 연다', null, { ai, loginPage, page }); 
    await When('사용자가 성인 인증 계정으로 로그인한다', null, { ai, loginPage, page }); 
    await Then('추천 홈으로 이동한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 카카오페이지 로그인 화면을 연다","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When 사용자가 미인증 계정으로 로그인한다","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then 추천 홈으로 이동한다","stepMatchArguments":[]}]},
  {"pwTestLine":12,"pickleLine":8,"tags":[],"steps":[{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Context","textWithKeyword":"Given 사용자가 카카오페이지 로그인 화면을 연다","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When 사용자가 성인 인증 계정으로 로그인한다","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then 추천 홈으로 이동한다","stepMatchArguments":[]}]},
]; // bdd-data-end