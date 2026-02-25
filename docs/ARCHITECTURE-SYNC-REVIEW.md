# 설계 검토: Playwright BDD & Google Sheets Hybrid Automation

## 검토 요약

- **철학(Deterministic + SSOT + 분리)** 에 맞고, Agent A/B 역할 분리가 명확함.
- **역방향 JSON Schema + strict** 로 환각 통제하는 방향 적절함.
- 아래 제안 구조와 뼈대 코드로 1차 구현 후, 시트 포맷(컬럼 인덱스·시트 이름)과 TC_ID↔파일 경로 규칙만 프로젝트에 맞게 조정하면 됨.

## 보완 제안 (선택)

1. **TC_ID ↔ feature 경로**: 현재는 `features/pcw/06-콘텐츠홈/kpa-092.feature` 형태이므로, `sync:pull` 시 "어느 섹션에 생성할지" 또는 기존 파일 검색 규칙(예: `**/kpa-{id}.feature`)을 config에 두는 것이 좋음.
2. **역방향 시트 매칭**: "해당 TC 번호의 행"을 찾을 때 시트에서 사용하는 TC 컬럼(예: `KPA-092` vs `kpa-092`) 형식을 config에 명시하면 유지보수에 유리함.
3. **Rate limit**: OpenAI + Sheets API 연속 호출 시 재시도/백오프를 한 곳(예: `lib/openai.ts`)에 두면 안정성 확보에 도움됨.
