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
const CONFIG_PATH = join(ROOT, "playwright.config.ts");
const RESULTS_PATH = join(ROOT, "overnight-results.json");

function getCurrentConfigEntries() {
  const content = readFileSync(CONFIG_PATH, "utf-8");
  const featuresMatch = content.match(/features:\s*\[([\s\S]*?)\]/);
  const stepsMatch = content.match(/steps:\s*\[([\s\S]*?)\]/);
  const features = featuresMatch
    ? featuresMatch[1]
        .split(",")
        .map((s) => s.trim().replace(/["']/g, ""))
        .filter(Boolean)
    : [];
  const steps = stepsMatch
    ? stepsMatch[1]
        .split(",")
        .map((s) => s.trim().replace(/["']/g, ""))
        .filter(Boolean)
    : [];
  return { features, steps };
}

function getFeatureNumbers() {
  const files = readdirSync(FEATURES_DIR).filter((f) => f.match(/^kpa-\d+\.feature$/));
  return files
    .map((f) => parseInt(f.replace("kpa-", "").replace(".feature", ""), 10))
    .sort((a, b) => a - b);
}

function getRemainingKpaNumbers(currentFeatures) {
  const allNumbers = getFeatureNumbers();
  const inConfig = new Set(
    currentFeatures
      .filter((p) => p.includes("kpa-"))
      .map((p) => parseInt(p.match(/kpa-(\d+)/)?.[1] || "0", 10))
  );
  return allNumbers.filter((n) => !inConfig.has(n));
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

function appendToConfig(newFeaturePath, newStepPath) {
  let content = readFileSync(CONFIG_PATH, "utf-8");
  const lastFeatureRe = /(    "features\/kpa-\d+\.feature")(\n)(  \],)/;
  const lastStepRe = /(    "steps\/kpa-\d+\.steps\.ts")(\n)(  \])/;
  content = content.replace(lastFeatureRe, `$1,$2    "${newFeaturePath}"$2$3`);
  content = content.replace(lastStepRe, `$1,$2    "${newStepPath}"$2$3`);
  writeFileSync(CONFIG_PATH, content);
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
  const { features: currentFeatures, steps: currentSteps } = getCurrentConfigEntries();
  const remaining = getRemainingKpaNumbers(currentFeatures);
  const limit = parseInt(process.env.OVERNIGHT_LIMIT || "0", 10);
  const toProcess = limit > 0 ? remaining.slice(0, limit) : remaining;
  const definedSteps = getAlreadyDefinedStepTexts();

  console.log(`Remaining KPA numbers: ${remaining.length}, processing: ${toProcess.length}${limit > 0 ? ` (limit ${limit})` : ""}`);
  if (toProcess.length > 0) console.log(`First: ${toProcess.slice(0, 5).join(", ")}...`);

  for (const num of toProcess) {
    const id = `kpa-${String(num).padStart(3, "0")}`;
    try {
      const featurePath = `features/${id}.feature`;
      const stepPath = `steps/${id}.steps.ts`;
      const featureFullPath = join(ROOT, featurePath);

      if (!existsSync(featureFullPath)) {
        results.scenarios.push({ id, status: "skip", reason: "feature file not found" });
        continue;
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

      appendToConfig(featurePath, stepPath);

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
