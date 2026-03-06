/**
 * 밤새 남은 시나리오만 생성·등록·테스트. 기존 성공 시나리오는 변경하지 않음.
 * 사용: node scripts/overnight-generate-remaining.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = join(process.cwd());
const FEATURES_DIR = join(ROOT, "features");
const STEPS_DIR = join(ROOT, "steps");
const RESULTS_PATH = join(ROOT, "overnight-results.json");

/** features/ 하위를 재귀 탐색하여 kpa-NNN 번호 추출 */
function getAllFeatureNumbers() {
  const numbers = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(dir, entry.name));
      else {
        const m = entry.name.match(/^kpa-(\d+)(?:-\d+)?\.feature$/);
        if (m) numbers.push(parseInt(m[1], 10));
      }
    }
  }
  walk(FEATURES_DIR);
  return [...new Set(numbers)].sort((a, b) => a - b);
}

/** step 파일이 존재하고 실제 구현이 있는 KPA 번호 집합 */
function getImplementedKpaNumbers() {
  const implemented = new Set();
  const files = readdirSync(STEPS_DIR).filter((f) => f.endsWith(".steps.ts"));
  for (const f of files) {
    const m = f.match(/^kpa-(\d+)/);
    if (!m) continue;
    const content = readFileSync(join(STEPS_DIR, f), "utf-8");
    if (!isStepsFileStubOnly(content)) implemented.add(parseInt(m[1], 10));
  }
  return implemented;
}

function getRemainingKpaNumbers() {
  const all = getAllFeatureNumbers();
  const done = getImplementedKpaNumbers();
  return all.filter((n) => !done.has(n));
}

/** features/ 하위를 재귀 탐색하여 kpa-NNN.feature 파일 경로 반환 */
function findFeatureFile(dir, id) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const found = findFeatureFile(join(dir, entry.name), id);
      if (found) return found;
    } else if (entry.name.startsWith(id) && entry.name.endsWith(".feature")) {
      return join(dir, entry.name);
    }
  }
  return null;
}

function normalizeStepPattern(text) {
  return text
    .replace(/"[^"]*"/g, "{string}")
    .replace(/\{(?!string|int\b)[^}]*\}/g, "{string}")
    .trim();
}

function extractStepsFromFeature(content) {
  const steps = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const m = line.match(/^\s*(Given|When|Then|And)\s+(.+)$/);
    if (m) {
      const keyword = m[1];
      let text = m[2].trim();
      const pattern = normalizeStepPattern(text);
      steps.push({ keyword, text, pattern });
    }
  }
  return steps;
}

function getAlreadyDefinedStepTexts() {
  const defined = new Set();
  const files = readdirSync(STEPS_DIR).filter(
    (f) => f.endsWith(".ts") && !f.includes("zerostep")
  );
  const stepReg = /(?:Given|When|Then|And)\s*\(\s*["']((?:[^"']|\\["'])+)["']/g;
  const stepReg2 = /(?:Given|When|Then|And)\s*\(\s*\/([^/]+)\//g;
  for (const file of files) {
    const content = readFileSync(join(STEPS_DIR, file), "utf-8");
    let m;
    while ((m = stepReg.exec(content)) !== null) defined.add(m[1].trim());
    while ((m = stepReg2.exec(content)) !== null) defined.add(m[1].trim());
  }
  return defined;
}

/**
 * steps 파일이 스텁만 있는지 판별. 실제 구현(선택자/클릭/입력/expect 등)이 하나라도 있으면 false.
 */
function isStepsFileStubOnly(content) {
  const realImplementationPattern =
    /getByRole|getByText|getByLabel|getByPlaceholder|locator\s*\(|\.click\s*\(|\.fill\s*\(|\.press\s*\(|expect\s*\(|page\.goto|waitForSelector|zerostep/;
  return !realImplementationPattern.test(content);
}

function escapeStepText(text) {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function stepToImplementation(keyword, text) {
  const hasStringParam = /\{string\}/.test(text);
  const hasTable = text.endsWith(":");
  const escaped = escapeStepText(text);
  const param = hasStringParam ? ", _param: string" : hasTable ? ", _dataTable?: unknown" : "";
  return `${keyword}("${escaped}", async ({ page }${param}) => {
  await page.waitForTimeout(500);
});`;
}

function generateStepsFileContent(kpaNum, stepsToDefine) {
  const needsAnd = stepsToDefine.some((s) => s.keyword === "And");
  const imports = ["Given", "When", "Then", "expect", "getBaseUrlOrigin"];
  if (needsAnd) imports.splice(3, 0, "And");
  const lines = [
    `// Feature: KPA-${String(kpaNum).padStart(3, "0")} (overnight generated)`,
    `import { ${imports.join(", ")} } from "./fixtures.js";`,
    ""
  ];
  for (const { keyword, text } of stepsToDefine) {
    lines.push(stepToImplementation(keyword, text));
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

function runBddgen() {
  try {
    execSync("npx bddgen", { cwd: ROOT, stdio: "pipe", timeout: 60000 });
    return { ok: true };
  } catch (e) {
    return { ok: false, stderr: e.stderr?.toString() || e.message };
  }
}

function runTest(specPath) {
  const env = { ...process.env, PLAYWRIGHT_BROWSERS_PATH: ".playwright-browsers" };
  try {
    execSync(
      `npx playwright test "${specPath}" --project=chromium --reporter=list`,
      { cwd: ROOT, env, stdio: "pipe", timeout: 120000 }
    );
    return { ok: true };
  } catch (e) {
    return { ok: false, stderr: e.stderr?.toString() || e.message };
  }
}

function main() {
  const results = { started: new Date().toISOString(), scenarios: [] };
  const remaining = getRemainingKpaNumbers();
  const limit = parseInt(process.env.OVERNIGHT_LIMIT || "0", 10);
  const toProcess = limit > 0 ? remaining.slice(0, limit) : remaining;
  const definedSteps = getAlreadyDefinedStepTexts();

  console.log(`Remaining KPA numbers: ${remaining.length}, processing: ${toProcess.length}${limit > 0 ? ` (limit ${limit})` : ""}`);
  if (toProcess.length > 0) console.log(`First: ${toProcess.slice(0, 5).join(", ")}...`);

  for (const num of toProcess) {
    const id = `kpa-${String(num).padStart(3, "0")}`;
    try {
      const stepPath = `steps/${id}.steps.ts`;
      // features/ 하위를 재귀 탐색하여 해당 feature 파일 찾기
      const featureFullPath = findFeatureFile(FEATURES_DIR, id);
      if (!featureFullPath) {
        results.scenarios.push({ id, status: "skip", reason: "feature file not found" });
        continue;
      }

      const stepFullPath = join(ROOT, stepPath);
      if (existsSync(stepFullPath)) {
        const existingContent = readFileSync(stepFullPath, "utf-8");
        if (!isStepsFileStubOnly(existingContent)) {
          results.scenarios.push({ id, status: "skip", reason: "already implemented (non-stub)" });
          console.log(`${id}: skip (already implemented)`);
          continue;
        }
      }

      const featureContent = readFileSync(featureFullPath, "utf-8");
      const stepsInFeature = extractStepsFromFeature(featureContent);
      const stepsToDefine = stepsInFeature
        .filter(
          (s) => !definedSteps.has(s.text) && !definedSteps.has(s.pattern)
        )
        .map((s) => ({
          keyword: s.keyword,
          text: s.pattern !== s.text ? s.pattern : s.text
        }));

      const stepFileContent =
        stepsToDefine.length > 0
          ? generateStepsFileContent(num, stepsToDefine)
          : `// Feature: KPA-${String(num).padStart(3, "0")} (overnight generated - all steps from common)\nimport "./fixtures.js";\n`;
      writeFileSync(join(ROOT, stepPath), stepFileContent, "utf-8");
      stepsInFeature.forEach((s) => {
        definedSteps.add(s.text);
        definedSteps.add(s.pattern);
      });

      // auto-discovery (glob) 기반이므로 config 수정 불필요
      const bddResult = runBddgen();
      if (!bddResult.ok) {
        results.scenarios.push({
          id,
          status: "bddgen_fail",
          reason: (bddResult.stderr || "").slice(0, 500)
        });
        continue;
      }

      const specPath = `.features-gen/features/${id}.feature.spec.js`;
      const testResult = runTest(specPath);
      results.scenarios.push({
        id,
        status: testResult.ok ? "passed" : "failed",
        reason: testResult.ok ? undefined : (testResult.stderr || "").slice(0, 500)
      });
      console.log(`${id}: ${testResult.ok ? "passed" : "failed"}`);
    } catch (err) {
      results.scenarios.push({
        id,
        status: "error",
        reason: (err && (err.message || String(err)))?.slice(0, 500)
      });
      console.log(`${id}: error`);
    }
  }

  writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2), "utf-8");
  console.log(`Results written to ${RESULTS_PATH}`);
}

main();
