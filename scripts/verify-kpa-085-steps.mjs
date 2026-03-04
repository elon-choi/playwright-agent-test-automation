/**
 * KPA-085 스텝 검증 (spawn 없이 Node만 사용).
 * 1) 전체 steps 폴더에서 스텝 문구 중복 전수 조사
 * 2) kpa-085.feature에 사용된 스텝이 정확히 1곳에서만 정의되는지 검증
 *
 * 사용: node scripts/verify-kpa-085-steps.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const stepsDir = path.join(projectRoot, "steps");
const featurePath = path.join(projectRoot, "features/pcw/06-콘텐츠홈/kpa-085.feature");

function extractStepTextsFromFile(content, filePath) {
  const entries = [];
  const doubleQuoted = /(?:Given|When|And|Then)\s*\(\s*"((?:[^"\\]|\\.)*)"/g;
  const singleQuoted = /(?:Given|When|And|Then)\s*\(\s*'((?:[^'\\]|\\.)*)'/g;
  const regexStep = /(?:Given|When|And|Then)\s*\(\s*\/((?:[^/\\]|\\.)*)\//g;
  let m;
  while ((m = doubleQuoted.exec(content)) !== null) {
    if (!content.slice(0, m.index).trimEnd().endsWith("//")) entries.push({ text: m[1], file: filePath });
  }
  while ((m = singleQuoted.exec(content)) !== null) {
    if (!content.slice(0, m.index).trimEnd().endsWith("//")) entries.push({ text: m[1], file: filePath });
  }
  while ((m = regexStep.exec(content)) !== null) {
    if (!content.slice(0, m.index).trimEnd().endsWith("//")) entries.push({ text: "(regex)", file: filePath });
  }
  return entries;
}

function loadAllStepDefinitions() {
  const byText = new Map();
  const files = fs.readdirSync(stepsDir).filter((f) => f.endsWith(".ts"));
  for (const f of files) {
    const filePath = path.join(stepsDir, f);
    const content = fs.readFileSync(filePath, "utf8");
    const entries = extractStepTextsFromFile(content, f);
    for (const { text, file } of entries) {
      if (!byText.has(text)) byText.set(text, []);
      byText.get(text).push(file);
    }
  }
  return byText;
}

function extractStepLinesFromFeature(content) {
  const lines = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (/^(Given|When|And|Then)\s+/.test(trimmed)) {
      const text = trimmed.replace(/^(Given|When|And|Then)\s+/, "").trim();
      if (text) lines.push(text);
    }
  }
  return lines;
}

const byText = loadAllStepDefinitions();
const duplicates = [];
for (const [text, files] of byText) {
  const uniq = [...new Set(files)];
  if (uniq.length > 1) duplicates.push({ text: text.slice(0, 60) + (text.length > 60 ? "..." : ""), files: uniq });
}

const featureContent = fs.readFileSync(featurePath, "utf8");
const kpa085Steps = extractStepLinesFromFeature(featureContent);
const missing = [];
const multiple = [];
for (const stepLine of kpa085Steps) {
  const normalized = stepLine.replace(/\s+/g, " ").trim();
  const candidates = [];
  for (const [defText, files] of byText) {
    const defNorm = defText.replace(/\s+/g, " ").trim();
    if (defNorm === normalized || defNorm.includes(normalized) || normalized.includes(defNorm)) candidates.push({ defText, files });
  }
  const exact = candidates.filter((c) => c.defText.replace(/\s+/g, " ").trim() === normalized);
  const defs = exact.length ? exact.flatMap((c) => c.files) : candidates.flatMap((c) => c.files);
  const uniqDefs = [...new Set(defs)];
  if (uniqDefs.length === 0) missing.push(normalized.slice(0, 70));
  else if (uniqDefs.length > 1) multiple.push({ step: normalized.slice(0, 60), files: uniqDefs });
}

console.log("=== 1) 스텝 문구 중복 전수 조사 (steps/*.ts) ===");
if (duplicates.length === 0) {
  console.log("중복 없음.");
} else {
  console.log("중복 발견:", duplicates.length, "건");
  duplicates.forEach((d) => console.log("  -", d.text, "->", d.files.join(", ")));
}

console.log("\n=== 2) KPA-085 feature 스텝 매칭 검증 ===");
console.log("feature 스텝 수:", kpa085Steps.length);
if (missing.length > 0) {
  console.log("매칭 없음:", missing.length, "건");
  missing.forEach((m) => console.log("  -", m));
}
if (multiple.length > 0) {
  console.log("여러 파일에서 매칭 (Multiple definitions 위험):", multiple.length, "건");
  multiple.forEach((m) => console.log("  -", m.step, "->", m.files.join(", ")));
}
if (missing.length === 0 && multiple.length === 0) {
  console.log("KPA-085 사용 스텝 모두 단일 정의로 매칭됨.");
}

process.exit(missing.length > 0 || multiple.length > 0 ? 1 : 0);
