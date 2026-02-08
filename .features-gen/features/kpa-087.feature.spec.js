// Generated from: features/kpa-087.feature
import { test } from "../../steps/fixtures.ts";

test.describe('KPA-087 시나리오 검증', () => {

  test('기다무 충전 영역 노출 확인', async ({ Given, When, Then, And, ai, loginPage, page }) => { 
    await Given('사용자가 "https://page.kakao.com/" 사이트에 접속한다', null, { ai, loginPage, page }); 
    await And('사용자가 기다무 작품 BM을 선택하고, 해당 작품이 "기다무 충전 중" 상태임을 확인한다', null, { ai, loginPage, page }); 
    await When('사용자가 회차 탭을 클릭한다', null, { ai, loginPage, page }); 
    await And('사용자가 기다무 충전 영역을 확인한다', null, { ai, loginPage, page }); 
    await Then('기다무 충전 영역이 화면에 노출되어야 한다', null, { ai, loginPage, page }); 
    await And('기다무 충전 영역에는 "{N}일 {N}시간 {N}분 기다무 대여권 0장" 또는 "{N}분 남음", "{N}분 미만 남음"과 같은 정보가 표시되어야 한다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/kpa-087.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given 사용자가 \"https://page.kakao.com/\" 사이트에 접속한다","stepMatchArguments":[{"group":{"start":5,"value":"\"https://page.kakao.com/\"","children":[{"start":6,"value":"https://page.kakao.com/","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And 사용자가 기다무 작품 BM을 선택하고, 해당 작품이 \"기다무 충전 중\" 상태임을 확인한다","stepMatchArguments":[{"group":{"start":29,"value":"\"기다무 충전 중\"","children":[{"start":30,"value":"기다무 충전 중","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When 사용자가 회차 탭을 클릭한다","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And 사용자가 기다무 충전 영역을 확인한다","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then 기다무 충전 영역이 화면에 노출되어야 한다","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And 기다무 충전 영역에는 \"{N}일 {N}시간 {N}분 기다무 대여권 0장\" 또는 \"{N}분 남음\", \"{N}분 미만 남음\"과 같은 정보가 표시되어야 한다","stepMatchArguments":[{"group":{"start":12,"value":"\"{N}일 {N}시간 {N}분 기다무 대여권 0장\"","children":[{"start":13,"value":"{N}일 {N}시간 {N}분 기다무 대여권 0장","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"{N}분 남음\"","children":[{"start":45,"value":"{N}분 남음","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"{N}분 미만 남음\"","children":[{"start":56,"value":"{N}분 미만 남음","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end