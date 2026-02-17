/**
 * 기능별(섹션/상세) 폴더로 feature 파일 이동
 * pcw: 기존 루트 + features/pcw/* → features/pcw/{섹션}/{상세}/
 * mw: features/mw/* → features/mw/{섹션}/{상세}/
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FEATURES = path.join(ROOT, "features");

const SECTION_DETAIL = {
  "00-login.feature": ["공통", ""],
  "kpa-002.feature": ["회원", ""],
  "kpa-003.feature": ["회원", ""],
  "kpa-004.feature": ["회원", ""],
  "kpa-005.feature": ["회원", ""],
  "kpa-008.feature": ["공통", ""],
  "kpa-009.feature": ["공통", ""],
  "kpa-010.feature": ["공통", ""],
  "kpa-011.feature": ["공통", ""],
  "kpa-012.feature": ["공통", ""],
  "kpa-013.feature": ["공통", ""],
  "kpa-016.feature": ["더보기", ""],
  "kpa-018.feature": ["더보기", ""],
  "kpa-019.feature": ["더보기", ""],
  "kpa-020.feature": ["더보기", ""],
  "kpa-021.feature": ["더보기", ""],
  "kpa-022.feature": ["더보기", ""],
  "kpa-026.feature": ["콘텐츠홈", ""],
  "kpa-027.feature": ["숏컷", "검색"],
  "kpa-028.feature": ["숏컷", "검색"],
  "kpa-029.feature": ["숏컷", "검색"],
  "kpa-030.feature": ["숏컷", "보관함"],
  "kpa-031.feature": ["숏컷", "보관함"],
  "kpa-032.feature": ["숏컷", "보관함"],
  "kpa-033.feature": ["숏컷", "보관함"],
  "kpa-034.feature": ["숏컷", "보관함"],
  "kpa-035.feature": ["숏컷", "보관함"],
  "kpa-036.feature": ["숏컷", "보관함"],
  "kpa-037.feature": ["숏컷", "보관함"],
  "kpa-038.feature": ["숏컷", "검색"],
  "kpa-039.feature": ["숏컷", "보관함"],
  "kpa-040.feature": ["숏컷", "보관함"],
  "kpa-041.feature": ["숏컷", "보관함"],
  "kpa-042.feature": ["숏컷", "보관함"],
  "kpa-043.feature": ["숏컷", "검색"],
  "kpa-044.feature": ["숏컷", "보관함"],
  "kpa-044-1.feature": ["숏컷", "보관함"],
  "kpa-045.feature": ["숏컷", "보관함"],
  "kpa-046.feature": ["숏컷", "선물함"],
  "kpa-048.feature": ["GNB", "책"],
  "kpa-049.feature": ["GNB", "웹소설"],
  "kpa-051.feature": ["GNB", "책"],
  "kpa-052.feature": ["GNB", "웹소설"],
  "kpa-054.feature": ["GNB", "책"],
  "kpa-055.feature": ["GNB", "웹소설"],
  "kpa-057.feature": ["GNB", "책"],
  "kpa-058.feature": ["GNB", "웹소설"],
  "kpa-059.feature": ["GNB", "요일연재"],
  "kpa-060.feature": ["GNB", "웹툰"],
  "kpa-061.feature": ["GNB", "웹툰"],
  "kpa-062.feature": ["GNB", "추천홈"],
  "kpa-063.feature": ["GNB", "웹툰"],
  "kpa-064.feature": ["GNB", "웹소설"],
  "kpa-065.feature": ["콘텐츠홈", ""],
  "kpa-066.feature": ["콘텐츠홈", ""],
  "kpa-067.feature": ["콘텐츠홈", ""],
  "kpa-068.feature": ["콘텐츠홈", ""],
  "kpa-069.feature": ["콘텐츠홈", ""],
  "kpa-070.feature": ["더보기", ""],
  "kpa-071.feature": ["더보기", ""],
  "kpa-072.feature": ["콘텐츠홈", ""],
  "kpa-073.feature": ["뷰어", ""],
  "kpa-074.feature": ["뷰어", ""],
  "kpa-075.feature": ["뷰어", ""],
  "kpa-076.feature": ["뷰어", ""],
  "kpa-077.feature": ["콘텐츠홈", ""],
  "kpa-078.feature": ["콘텐츠홈", ""],
  "kpa-079.feature": ["뷰어", ""],
  "kpa-081.feature": ["콘텐츠홈", ""],
  "kpa-082.feature": ["콘텐츠홈", ""],
  "kpa-085.feature": ["콘텐츠홈", ""],
  "kpa-085-1.feature": ["콘텐츠홈", ""],
  "kpa-085-2.feature": ["콘텐츠홈", ""],
  "kpa-086.feature": ["콘텐츠홈", ""],
  "kpa-087.feature": ["콘텐츠홈", ""],
  "kpa-088.feature": ["콘텐츠홈", ""],
  "kpa-089.feature": ["콘텐츠홈", ""],
  "kpa-090.feature": ["콘텐츠홈", ""],
  "kpa-091.feature": ["콘텐츠홈", ""],
  "kpa-092.feature": ["콘텐츠홈", ""],
  "kpa-093.feature": ["콘텐츠홈", ""],
  "kpa-097.feature": ["콘텐츠홈", ""],
  "kpa-098.feature": ["콘텐츠홈", ""],
  "kpa-099.feature": ["콘텐츠홈", ""],
  "kpa-100.feature": ["숏컷", "검색"],
  "kpa-101.feature": ["GNB", "웹툰"],
  "kpa-102.feature": ["GNB", "추천홈"],
  "kpa-103.feature": ["콘텐츠홈", ""],
  "kpa-104.feature": ["뷰어", ""],
  "kpa-105.feature": ["뷰어", ""],
  "kpa-106.feature": ["뷰어", ""],
  "kpa-107.feature": ["뷰어", ""],
  "kpa-108.feature": ["뷰어", ""],
  "kpa-109.feature": ["뷰어", ""],
  "kpa-111.feature": ["뷰어", ""],
  "kpa-112.feature": ["뷰어", ""],
  "kpa-113.feature": ["뷰어", ""],
  "kpa-114.feature": ["뷰어", ""],
  "kpa-115.feature": ["뷰어", ""],
  "kpa-116.feature": ["뷰어", ""],
  "kpa-117.feature": ["뷰어", ""],
  "kpa-118.feature": ["뷰어", ""],
  "kpa-119.feature": ["뷰어", ""],
  "kpa-120.feature": ["뷰어", ""],
  "kpa-121.feature": ["뷰어", ""],
  "kpa-122.feature": ["뷰어", ""],
  "kpa-123.feature": ["뷰어", ""],
  "kpa-124.feature": ["뷰어", ""],
  "kpa-125.feature": ["뷰어", ""],
  "kpa-126.feature": ["뷰어", ""],
  "kpa-127.feature": ["뷰어", ""],
  "kpa-128.feature": ["뷰어", ""],
  "kpa-130.feature": ["뷰어", ""],
  "kpa-131.feature": ["뷰어", ""],
  "kpa-132.feature": ["뷰어", ""],
  "kpa-133.feature": ["뷰어", ""],
  "kpa-134.feature": ["뷰어", ""],
  "kpa-135.feature": ["뷰어", ""],
  "kpa-136.feature": ["뷰어", ""],
  "kpa-137.feature": ["뷰어", ""],
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function rel(p) {
  return path.relative(ROOT, p);
}

const moved = [];
const errors = [];

function moveFile(src, platform, section, detail) {
  const parts = [FEATURES, platform, section];
  if (detail) parts.push(detail);
  parts.push(path.basename(src));
  const dest = path.join(...parts);
  if (!fs.existsSync(src)) {
    errors.push(`skip (not found): ${rel(src)}`);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  fs.unlinkSync(src);
  moved.push({ src: rel(src), dest: rel(dest) });
}

function main() {
  const orderLoginFirst = (a, b) => {
    if (a.includes("00-login")) return -1;
    if (b.includes("00-login")) return 1;
    return a.localeCompare(b);
  };

  const pcwPaths = [];
  const mwPaths = [];

  for (const [basename, [section, detail]] of Object.entries(SECTION_DETAIL)) {
    const srcRoot = path.join(FEATURES, basename);
    const srcPcw = path.join(FEATURES, "pcw", basename);
    const srcMw = path.join(FEATURES, "mw", basename);

    const destPart = detail ? `${section}/${detail}` : section;
    const destPcw = path.join("features", "pcw", destPart, basename);
    const destMw = path.join("features", "mw", destPart, basename);

    if (["kpa-070.feature", "kpa-071.feature", "kpa-072.feature"].includes(basename)) {
      const mwContentHomePath = path.join(FEATURES, "mw", "콘텐츠홈", basename);
      if (fs.existsSync(mwContentHomePath)) mwPaths.push(`features/mw/콘텐츠홈/${basename}`);
      continue;
    }

    if (["kpa-073.feature", "kpa-074.feature", "kpa-075.feature", "kpa-076.feature", "kpa-079.feature"].includes(basename)) {
      const src = path.join(FEATURES, "mw", basename);
      if (fs.existsSync(src)) {
        moveFile(src, "mw", section, detail);
        mwPaths.push(destMw.replace(path.sep, "/"));
      }
      continue;
    }

    if (fs.existsSync(srcRoot)) {
      moveFile(srcRoot, "pcw", section, detail);
      pcwPaths.push(destPcw.replace(path.sep, "/"));
    }
  }

  pcwPaths.sort(orderLoginFirst);
  mwPaths.sort(orderLoginFirst);

  console.log("Moved", moved.length, "files");
  moved.forEach((m) => console.log("  ", m.src, "->", m.dest));
  if (errors.length) console.log("Errors:", errors);

  const allPaths = [...pcwPaths, ...mwPaths];
  fs.writeFileSync(
    path.join(ROOT, "scripts", "generated-feature-paths.json"),
    JSON.stringify({ pcwPaths, mwPaths, allPaths }, null, 2)
  );
  console.log("\nGenerated scripts/generated-feature-paths.json");

  return { moved, pcwPaths, mwPaths, errors };
}

main();
