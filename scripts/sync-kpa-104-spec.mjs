/**
 * kpa-104.feature 내용을 읽어 .features-gen의 kpa-104.feature.spec.js를
 * 현재 feature 시나리오와 일치하도록 덮어쓴다.
 * bddgen이 이전(캐시) 내용으로 스펙을 덮어쓸 때 사용.
 *
 * 사용: node scripts/sync-kpa-104-spec.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const featurePath = path.join(root, "features/pcw/뷰어/kpa-104.feature");
const specPath = path.join(root, ".features-gen/features/pcw/뷰어/kpa-104.feature.spec.js");

const featureContent = fs.readFileSync(featurePath, "utf8");
const steps = [];
const stepRegex = /^\s*(Given|When|Then|And)\s+(.+)$/gm;
let m;
while ((m = stepRegex.exec(featureContent)) !== null) {
  const keyword = m[1];
  const text = m[2].trim();
  steps.push({ keyword, text });
}

const stepCalls = steps
  .map((s) => {
    const fn = s.keyword === "Given" ? "Given" : s.keyword === "When" ? "When" : s.keyword === "Then" ? "Then" : "And";
    const arg = textToJsString(s.text);
    return `    await ${fn}(${arg}, null, { ai, loginPage, page });`;
  })
  .join("\n");

function textToJsString(t) {
  const escaped = t.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  return `'${escaped}'`;
}

const bddSteps = steps.map((s, i) => ({
  pwStepLine: 7 + i,
  gherkinStepLine: 4 + i,
  keywordType: s.keyword === "Given" || (s.keyword === "And" && i < 2) ? "Context" : s.keyword === "When" || s.keyword === "And" ? "Action" : "Outcome",
  textWithKeyword: `${s.keyword} ${s.text}`,
  stepMatchArguments: s.text.includes("page.kakao.com") ? [{ group: { start: 5, value: '"https://page.kakao.com/"', children: [{ start: 6, value: "https://page.kakao.com/", children: [{ children: [] }] }, { children: [{ children: [] }] }] }, parameterTypeName: "string" }] : []
}));

const bddData = JSON.stringify([{ pwTestLine: 6, pickleLine: 3, tags: [], steps: bddSteps }]);

const specContent = `// Generated from: features/pcw/뷰어/kpa-104.feature
import { test } from "../../../../steps/fixtures.ts";

test.describe('KPA-104 시나리오 검증', () => {

  test('댓글 정렬 기능 검증', async ({ Given, When, Then, And, ai, loginPage, page }) => {
${stepCalls}
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/pcw/뷰어/kpa-104.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
 ${bddData.slice(1, -1)},
]; // bdd-data-end
`;

fs.mkdirSync(path.dirname(specPath), { recursive: true });
fs.writeFileSync(specPath, specContent, "utf8");
console.log("Synced kpa-104.feature -> kpa-104.feature.spec.js");
