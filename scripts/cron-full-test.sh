#!/bin/bash
# 전체 시나리오 1일 1회 실행 (crontab용)

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK_FILE="$PROJECT_DIR/.fulltest.lock"
LOG_FILE="$PROJECT_DIR/logs/fulltest.log"

# 로그 디렉토리 생성
mkdir -p "$PROJECT_DIR/logs"

# 로그 로테이션: 10MB 초과 시 이전 로그 삭제 후 재시작
MAX_LOG_SIZE=10485760  # 10MB
if [ -f "$LOG_FILE" ]; then
  LOG_SIZE=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat --format=%s "$LOG_FILE" 2>/dev/null || echo 0)
  if [ "$LOG_SIZE" -gt "$MAX_LOG_SIZE" ]; then
    mv "$LOG_FILE" "${LOG_FILE}.old"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 로그 로테이션 완료 (이전: ${LOG_SIZE} bytes)" > "$LOG_FILE"
  fi
fi

# 중복 실행 방지
if [ -f "$LOCK_FILE" ]; then
  if [ "$(find "$LOCK_FILE" -mmin +120 2>/dev/null)" ]; then
    echo "[$(date '+%H:%M:%S')] Stale lock 제거" >> "$LOG_FILE"
    rm -f "$LOCK_FILE"
  else
    echo "[$(date '+%H:%M:%S')] 이전 실행 중 — 스킵" >> "$LOG_FILE"
    exit 0
  fi
fi

# lock 생성
trap 'rm -f "$LOCK_FILE"' EXIT
echo $$ > "$LOCK_FILE"

# NVM 환경 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd "$PROJECT_DIR" || exit 1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] === 전체 시나리오 실행 시작 ===" >> "$LOG_FILE"

npm run test:headless >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 결과: $([ $EXIT_CODE -eq 0 ] && echo 'PASS' || echo 'FAIL')" >> "$LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] === 전체 시나리오 실행 완료 ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
