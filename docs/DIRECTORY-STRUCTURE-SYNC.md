# 디렉터리 구조 제안 (Sync 에이전트 반영)

```
playwright-agent-test-automation/
├── agents/
│   └── SyncAgent.ts          # 양방향 동기화 에이전트 (pull / push)
├── config/
│   └── sync.config.ts        # 시트 ID, 시트명, 범위, 컬럼 인덱스 등
├── lib/
│   ├── sheets.ts             # Google Sheets API 래퍼 (인증, 읽기, 쓰기, 행 검색)
│   └── openai.ts             # (선택) OpenAI 호출 공통화, 스키마/재시도
├── features/                 # 기존
│   └── pcw/
│       ├── 01-비로그인 케이스/
│       ├── ...
│       └── 06-콘텐츠홈/
├── steps/                    # 기존
├── pages/                    # (기존 POM) Step에서 참조
├── scripts/
│   ├── sync-pull.ts          # npm run sync:pull {TC_ID} 진입점
│   └── sync-push.ts          # npm run sync:push {TC_ID} 진입점
├── .env                      # SPREADSHEET_ID, OPENAI_API_KEY, GOOGLE_APPLICATION_CREDENTIALS 등
├── package.json
└── ...
```

## 추가/변경 폴더 역할

| 경로 | 역할 |
|------|------|
| `agents/SyncAgent.ts` | Sheets ↔ BDD 변환 오케스트레이션, LLM 호출, 파일/시트 입출력 |
| `config/sync.config.ts` | 스프레드시트 ID, 시트 이름, TC_ID/사전조건/수행절차/기대결과 컬럼·범위 |
| `lib/sheets.ts` | 서비스 계정 인증, getRange, updateRange, findRowByTcId |
| `scripts/sync-pull.ts` | CLI에서 `sync:pull kpa-092` 호출 시 SyncAgent.pull() 실행 |
| `scripts/sync-push.ts` | CLI에서 `sync:push kpa-092` 호출 시 SyncAgent.push() 실행 |
