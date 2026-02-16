// Generated from: features/pcw/kpa-070.feature
import { test } from "../../../steps/fixtures.ts";

test.describe('KPA-070 시나리오 검증 (PCW)', () => {

  test('더보기 레이어 팝업 (PC Web 미지원)', async ({ Given, ai, loginPage, page }) => { 
    await Given('KPA-070은 PC Web에서 검증하지 않는다', null, { ai, loginPage, page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/pcw/kpa-070.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given KPA-070은 PC Web에서 검증하지 않는다","stepMatchArguments":[]}]},
]; // bdd-data-end