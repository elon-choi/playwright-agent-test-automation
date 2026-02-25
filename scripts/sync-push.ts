/**
 * BDD → Sheets push. 사용: npx ts-node --esm scripts/sync-push.ts <TC_ID>
 * 예: npm run sync:push kpa-092
 */
import "dotenv/config";
import { push } from "../agents/SyncAgent.js";

const tcId = process.argv[2];
if (!tcId) {
  console.error("Usage: npm run sync:push <TC_ID>");
  process.exit(1);
}

const result = await push(tcId);
if (result.ok) {
  console.log("OK: 시트 행", result.rowIndex, "업데이트됨");
} else {
  console.error("Error:", result.error);
  process.exit(1);
}
