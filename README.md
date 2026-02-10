# Playwright Agent Test Automation

**카카오페이지** E2E 테스트 자동화 프로젝트 (BDD · Playwright)

- 저장소: [github.com/elon-choi/playwright-agent-test-automation](https://github.com/elon-choi/playwright-agent-test-automation)

---

## 개요

- **BDD**: Gherkin(feature) + playwright-bdd로 시나리오 기반 테스트
- **대상**: 카카오페이지 (웹툰/웹소설/책 등)
- **브라우저**: Chromium(Chrome) 단일 프로젝트
- **실행**: Locator 기반 + 실패 시 DOM 덤프·로그·셀프힐링 지원

---

## 기술 스택

- Node.js (ESM), TypeScript
- Playwright, playwright-bdd
- 선택: ZeroStep AI, dotenv

---

## 설치

```bash
git clone https://github.com/elon-choi/playwright-agent-test-automation.git
cd playwright-agent-test-automation
npm ci
npm run pw:install
cp .env.example .env
```

---

## 실행 방법

| 명령 | 설명 | 브라우저 |
|------|------|----------|
| npm run test | 전체 시나리오 | 창 표시 |
| npm run test:ui | Playwright UI 모드 | 창 표시 |
| npm run test:ci | 전체 + 슬랙 알림 | 창 표시 |
| npm run test:ui:ci | UI 모드 + 슬랙 | 헤드리스 |

헤드리스: CI=true npm run test 또는 npm run test:ui:ci

---

## 프로젝트 구조

- features/ - BDD 시나리오 (Gherkin)
- steps/ - 스텝 정의 (fixtures, common.*, kpa-*)
- pages/ - Page Object
- scripts/ - notify-slack, last-failure 등
- docs/ - 프레임워크 개요, 슬랙 가이드

---

## CI / 슬랙

- GitHub Actions: main push/PR 시 playwright.yml 실행
- 슬랙: Secrets에 SLACK_WEBHOOK_URL 등록 시 결과 전송
- 상세: docs/DASHBOARD_AND_SLACK_GUIDE.md

---

## 문서

- docs/FRAMEWORK_OVERVIEW.md - 목적, 구조, 로드맵
- docs/DASHBOARD_AND_SLACK_GUIDE.md - 슬랙 설정 및 확인 사항
