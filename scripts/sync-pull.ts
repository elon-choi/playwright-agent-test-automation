/**
 * Sheets → BDD pull. 사용: npx ts-node --esm scripts/sync-pull.ts <TC_ID>
 * 예: npm run sync:pull kpa-092
 */
import "dotenv/config";
import { pull } from "../agents/SyncAgent.js";

const tcId = process.argv[2];
if (!tcId) {
  console.error("Usage: npm run sync:pull <TC_ID>");
  process.exit(1);
}

const result = await pull(tcId);
if (result.ok) {
  console.log("OK:", result.path);
} else {
  console.error("Error:", result.error);
  process.exit(1);
}
