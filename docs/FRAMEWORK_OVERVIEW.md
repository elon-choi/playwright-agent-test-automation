# KakaoPage BDD 테스트 자동화 프레임워크 (현행 반영)

기존 PDF 설계와 현재 구현 차이를 반영한 정리 문서.

## 문서(설계) vs 현재 구현 차이 요약

| 구분 | 기존 문서(PDF) | 현재 구현 |
|------|----------------|-----------|
| steps | fixtures.ts + login.steps.ts 만 | fixtures + common.navigation/auth/episode + login + kpa-002~139.steps (기능별 분리) |
| 브라우저 | WebKit/Firefox 호환 설정 | Chromium(channel: chrome) 단일 프로젝트 |
| bddgen | Phase 2 실행 프로세스에서 Generate | playwright-bdd 사용, .features-gen에 생성 스펙 |
| AI(ZeroStep) | Phase 2 Chromium 전용 분리 예정 | 이미 fixtures에 주입, withAiFallback 사용 |
| scripts | dump-dom.ts | + overnight, last-failure, notify-slack, clean-old-dumps |
| 시나리오 | 주요 기능(로그인·탐색 등) | login + KPA-002~139 등 120개 이상 .feature |
| 페이지 구조 | features, steps, pages, dom_dumps, dom_logs | + .features-gen, .auth, self_heal, test-results |

---

## 1. 목적 및 기대 효과

- **목적**: BDD(Gherkin) 공통 언어, Locator 기반 안정성, AI(ZeroStep) 확장을 위한 DI 구조.
- **기대 효과**: 자연어 리포팅, 실패 시 DOM/Trace 수집, Chromium+AI 전환 용이.

## 2. 단계별 계획 (현행)

- **Phase 1**: Playwright+playwright-bdd, KPA 시나리오(.feature), steps(common.* + kpa-xxx), DOM/덤프/self_heal, 스크립트(dump-dom, overnight, last-failure, notify-slack, clean-old-dumps) 완료.
- **Phase 2**: ZeroStep 부분 적용, selfHealLocator 기초, CI/Slack 적용.

## 3. 프로젝트 구조 (현재)

- **설계 문서**: steps = fixtures + login.steps만 기술.
- **현재**: steps = fixtures.ts + common.navigation/auth/episode.steps + login.steps + kpa-002~139.steps.ts (기능별 분리).
- **설계**: WebKit/Firefox. **현재**: Chromium(channel: chrome) 단일 프로젝트.
- **추가**: .features-gen(생성 스펙), scripts 확장, self_heal, .auth.

```
├── playwright.config.ts   # defineBddConfig, Chromium 1 project
├── features/             # login + kpa-002~139.feature
├── .features-gen/        # generated *.spec.js
├── steps/                # fixtures, common.*, login, kpa-xxx.steps
├── pages/                # BasePage, LoginPage
├── scripts/              # dump-dom, overnight, last-failure, notify-slack, clean-old-dumps
├── dom_dumps/, dom_logs/, self_heal/, test-results/
└── docs/
```

## 4. 플로우

- **구현**: .feature 작성 → config에 features/steps 등록 → bddgen → Step 구현.
- **실행**: testDir(.features-gen) → fixtures 주입(page, LoginPage, AI) → Chromium 순차 실행 → Locator 우선, ZEROSTEP_TOKEN 시 AI fallback → 리포트·trace·덤프 저장.

## 5. 기술 의사결정

- Smart Hybrid: Locator 중심 + 선택적 AI fallback. Chromium 단일.
- 데이터: DOM Dump/dom_logs/self_heal, Trace on-first-retry.
- Phase 2: Trace·DOM 기반 Auto-healing, 스텝 중복 정리, 필요 시 Cross-Browser 재추가.

## 6. 현황

- test / test:ui / test:ci. HTML·JSON 리포트, Slack. 일부 시나리오 Multiple definitions 등 정리 중.

## 7. 로드맵

AI 고도화, Auto-healing 파이프라인, 스텝·프로젝트 정리, WebKit/Firefox 옵션.

## Update History

- 26.02.01 초안, 26.02.04 현행 반영, (현재) 문서-구현 차이 반영 재정리.
