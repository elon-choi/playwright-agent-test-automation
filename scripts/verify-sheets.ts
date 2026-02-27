/**
 * Google Sheets 연동 확인. 사용: npx ts-node --esm scripts/verify-sheets.ts
 */
import "dotenv/config";
import { getSheetsAuth, getRange } from "../lib/sheets.js";
import { syncConfig } from "../config/sync.config.js";

async function main() {
  console.log("1. Google 인증 확인 중...");
  const auth = await getSheetsAuth();
  console.log("   인증 성공 (client_email:", (auth as { email?: string }).email ?? "ok", ")");

  const id = syncConfig.spreadsheetId;
  if (!id) {
    console.log("2. SPREADSHEET_ID가 .env에 없어 시트 접근은 생략합니다.");
    return;
  }
  console.log("2. 시트 접근 확인 중...", id);
  const name = syncConfig.sheetName;
  const rows = await getRange(id, `${name}!A1:B1`);
  console.log("   시트 읽기 성공. 첫 범위 행 수:", rows?.length ?? 0);
  console.log("\n연동 정상입니다.");
}

main().catch((e) => {
  console.error("연동 실패:", e instanceof Error ? e.message : e);
  process.exit(1);
});
