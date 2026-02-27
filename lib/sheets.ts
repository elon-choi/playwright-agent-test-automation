/**
 * Google Sheets API 유틸리티.
 * 서비스 계정(JSON 키)으로 인증 후 범위 읽기/쓰기, TC ID로 행 검색.
 */
import { google, sheets_v4 } from "googleapis";
import type { JWT } from "google-auth-library";
import { syncConfig, columnLetter } from "../config/sync.config.js";

let authClient: JWT | null = null;

/**
 * 서비스 계정으로 JWT 클라이언트 생성.
 * 1) GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY 가 있으면 사용
 * 2) 없으면 GOOGLE_APPLICATION_CREDENTIALS(JSON 파일 경로) 사용
 */
export async function getSheetsAuth(): Promise<JWT> {
  if (authClient) return authClient;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (email && rawKey) {
    const privateKey = rawKey.replace(/\\n/g, "\n");
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: email, private_key: privateKey },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    authClient = (await auth.getClient()) as JWT;
    return authClient;
  }
  if (keyFile) {
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    authClient = (await auth.getClient()) as JWT;
    return authClient;
  }
  throw new Error(
    "Google 인증이 필요합니다. 다음 중 하나를 설정하세요. " +
      "1) GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY " +
      "2) GOOGLE_APPLICATION_CREDENTIALS (서비스 계정 JSON 파일 경로)"
  );
}

/**
 * 시트 범위 값 조회.
 * @param range - A1 표기 (예: "테스트케이스!A2:D100")
 */
export async function getRange(
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const auth = await getSheetsAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const rows = (res.data.values ?? []) as string[][];
  return rows;
}

/**
 * 시트 범위 값 덮어쓰기. 멱등 동작.
 * @param range - A1 표기
 * @param values - 2차원 배열 (행 단위)
 */
export async function updateRange(
  spreadsheetId: string,
  range: string,
  values: string[][]
): Promise<void> {
  const auth = await getSheetsAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

/**
 * TC ID로 해당 행(1-based) 찾기. 없으면 null.
 * 시트 전체를 읽어서 columnTcId 컬럼과 비교한다.
 */
export async function findRowByTcId(
  spreadsheetId: string,
  sheetName: string,
  tcId: string,
  columnTcId: number,
  dataStartRow: number
): Promise<number | null> {
  const col = columnLetter(columnTcId);
  const range = `${sheetName}!${col}${dataStartRow}:${col}`;
  const rows = await getRange(spreadsheetId, range);
  const normalized = tcId.replace(/^kpa-?/i, "KPA-").toUpperCase();
  for (let i = 0; i < rows.length; i++) {
    const cell = (rows[i][0] ?? "").toString().trim();
    const cellNorm = cell.replace(/^kpa-?/i, "KPA-").toUpperCase();
    if (cellNorm === normalized || cellNorm.endsWith(normalized) || cell === tcId) {
      return dataStartRow + i;
    }
  }
  return null;
}

/**
 * 설정(syncConfig) 기준으로 해당 TC 행의 [사전조건, 수행절차, 기대결과] 읽기.
 */
export async function getTcRow(
  tcId: string
): Promise<{ precondition: string; steps: string; expected: string; rowIndex: number } | null> {
  const { spreadsheetId, sheetName, columnPrecondition, columnSteps, columnExpected, columnTcId, dataStartRow } =
    syncConfig;
  if (!spreadsheetId) throw new Error("SPREADSHEET_ID가 설정되지 않았습니다.");

  const rowIndex = await findRowByTcId(
    spreadsheetId,
    sheetName,
    tcId,
    columnTcId,
    dataStartRow
  );
  if (rowIndex == null) return null;

  const colPre = columnLetter(columnPrecondition);
  const colSteps = columnLetter(columnSteps);
  const colExp = columnLetter(columnExpected);
  const range = `${sheetName}!${colPre}${rowIndex}:${colExp}${rowIndex}`;
  const rows = await getRange(spreadsheetId, range);
  const row = rows[0];
  if (!row || row.length < 3) return null;

  return {
    precondition: (row[0] ?? "").toString().trim(),
    steps: (row[1] ?? "").toString().trim(),
    expected: (row[2] ?? "").toString().trim(),
    rowIndex,
  };
}

/**
 * 설정 기준으로 해당 TC 행에 [사전조건, 수행절차, 기대결과] 덮어쓰기.
 * rowIndex는 getTcRow로 미리 구한 값 또는 findRowByTcId 결과.
 */
export async function updateTcRow(
  tcId: string,
  rowIndex: number,
  data: { precondition: string; steps: string; expected: string }
): Promise<void> {
  const { spreadsheetId, sheetName, columnPrecondition, columnSteps, columnExpected } =
    syncConfig;
  if (!spreadsheetId) throw new Error("SPREADSHEET_ID가 설정되지 않았습니다.");

  const colPre = columnLetter(columnPrecondition);
  const colExp = columnLetter(columnExpected);
  const range = `${sheetName}!${colPre}${rowIndex}:${colExp}${rowIndex}`;
  await updateRange(spreadsheetId, range, [
    [data.precondition, data.steps, data.expected],
  ]);
}
