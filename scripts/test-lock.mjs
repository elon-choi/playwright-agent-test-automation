/**
 * 테스트 실행 락 유틸리티
 *
 * 헬스체크(5분 주기)와 전체 테스트가 동시에 실행되지 않도록 보호한다.
 * - 헬스체크: isLocked() → true면 스킵
 * - 전체 테스트: acquire() → 락 획득 후 실행, 완료 시 release()
 */
import { existsSync, writeFileSync, unlinkSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const LOCK_FILE = join(__dirname, "..", ".test-lock");
const STALE_MS = 2 * 60 * 60 * 1000; // 2시간 지나면 stale로 판단

export function isLocked() {
  if (!existsSync(LOCK_FILE)) return false;
  try {
    const data = JSON.parse(readFileSync(LOCK_FILE, "utf-8"));
    const age = Date.now() - data.timestamp;
    // 2시간 넘은 락은 좀비로 판단 → 자동 해제
    if (age > STALE_MS) {
      console.log(`[lock] stale 락 감지 (${Math.round(age / 60000)}분 경과) → 자동 해제`);
      release();
      return false;
    }
    return true;
  } catch {
    // 파일 파싱 실패 → 락 해제
    release();
    return false;
  }
}

export function acquire(owner = "unknown") {
  writeFileSync(LOCK_FILE, JSON.stringify({ owner, timestamp: Date.now(), pid: process.pid }), "utf-8");
}

export function release() {
  try { unlinkSync(LOCK_FILE); } catch { /* 이미 없으면 무시 */ }
}

export function lockInfo() {
  if (!existsSync(LOCK_FILE)) return null;
  try {
    return JSON.parse(readFileSync(LOCK_FILE, "utf-8"));
  } catch {
    return null;
  }
}
