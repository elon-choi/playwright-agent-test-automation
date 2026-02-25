/**
 * Google Sheets ↔ BDD 동기화 설정.
 * SPREADSHEET_ID, 시트명, 컬럼 범위는 .env 또는 여기서 중앙 관리.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

export const syncConfig = {
  /** 스프레드시트 ID (URL의 /d/SPREADSHEET_ID/ 부분) */
  spreadsheetId: process.env.SPREADSHEET_ID ?? "",
  /** 시트 이름 (탭 이름) */
  sheetName: process.env.SHEET_NAME ?? "테스트케이스",
  /** TC ID가 있는 컬럼 (A=1, B=2, ...). 시트에서 "행 찾기"에 사용 */
  columnTcId: parseInt(process.env.SHEET_COLUMN_TC_ID ?? "1", 10),
  /** 사전조건 컬럼 인덱스 (1-based) */
  columnPrecondition: parseInt(process.env.SHEET_COLUMN_PRECONDITION ?? "2", 10),
  /** 수행절차 컬럼 인덱스 (1-based) */
  columnSteps: parseInt(process.env.SHEET_COLUMN_STEPS ?? "3", 10),
  /** 기대결과 컬럼 인덱스 (1-based) */
  columnExpected: parseInt(process.env.SHEET_COLUMN_EXPECTED ?? "4", 10),
  /** 데이터 시작 행 (헤더 다음 행). 1-based */
  dataStartRow: parseInt(process.env.SHEET_DATA_START_ROW ?? "2", 10),
  /** feature 파일 검색 기준 디렉터리 */
  featuresDir: path.join(ROOT, "features"),
} as const;

/** 인덱스(1-based)를 시트 컬럼 문자로 변환 (1->A, 2->B, 27->AA) */
export function columnLetter(index: number): string {
  let s = "";
  for (; index > 0; index = Math.floor((index - 1) / 26)) {
    s = String.fromCharCode(65 + ((index - 1) % 26)) + s;
  }
  return s;
}
