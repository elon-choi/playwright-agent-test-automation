# 테스트 실행 이력 대시보드 – Run 목록에서 클릭해 결과 확인

이미지(Katalon TestOps 스타일)처럼 **실행할 때마다 Run 목록이 쌓이고, 각 Run을 클릭해 상세 결과(Summary, 통과/실패 수, 스위트별 breakdown)**를 보려면 아래 중 하나로 구성하면 됩니다.

---

## 1. 가능한 구성 방식 요약

| 방식 | Run 목록 + 클릭 | 비용 | 구현 난이도 | 비고 |
|------|------------------|------|-------------|------|
| GitHub Actions Artifacts | Run별 아티팩트로 “목록” | 무료 | 이미 적용됨 | Actions 탭이 Run 목록 역할 |
| Allure Report + GitHub Pages (이력 누적) | Allure 대시보드에서 런 이력/트렌드 | 무료 | 중 | history 유지 시 트렌드·비교 가능 |
| ReportPortal | Run 목록 + 클릭, 풀 대시보드 | OSS/유료 | 중상 | Self-host 또는 Cloud |
| Katalon TestOps | 이미지와 동일한 UX | 유료 | 중 | CI에서 결과 전송 |
| Allure TestOps | Allure 기반 풀 대시보드 | 유료 | 중 | Allure 생태계 |

---

## 2. 지금 구조로 “클릭해서 확인” (이미 가능)

- **CI**: push/PR 시 Playwright 테스트 실행 → **playwright-report**, **allure-report**, **allure-results** 를 **Run별 아티팩트**로 업로드.
- **확인 방법**:  
  GitHub **Actions** → **Workflow “Playwright Tests”** → **Run 목록**(#220, #219 …) → Run 하나 클릭 → **Artifacts**에서 `playwright-report` 또는 `allure-report` 다운로드 → 압축 해제 후 `index.html` 열기.

즉, “실행할 때마다 결과를 클릭해서 확인”은 **이미 가능**합니다. 다만 Run 목록이 “테스트 대시보드”가 아니라 **Actions Run 목록**이라는 점만 다릅니다.

---

## 3. “Run 목록 + 한 페이지에서 클릭”이 필요할 때

이미지처럼 **테스트 전용 페이지에서 Run #220, #219 … 목록이 보이고, 클릭 시 해당 Run의 Summary/통과·실패/스위트**를 보려면 아래가 적합합니다.

### A. Allure Report + 정적 호스팅 (무료, 추천)

- **역할**: Run별로 `allure-results`를 모아서 한 번에 `allure generate` 하면, Allure 리포트 하나에 **여러 런(Launch)**이 들어갈 수 있음. 그 리포트를 GitHub Pages 등에 올리면 **URL 하나**로 대시보드 접근.
- **Run 목록**: Allure UI에서 **Launches / History** 같은 형태로 런 목록이 보이고, 클릭 시 해당 런의 Summary, 통과/실패, 스위트별 결과, 스크린샷/트레이스 확인 가능.
- **구성 요약**:
  - CI에서 매 Run마다 `allure-results`를 **저장소(예: S3, GCS) 또는 별도 브랜치/디렉터리**에 Run ID별로 보관.
  - “리포트 생성” Job에서 **최근 N개 Run의 allure-results**를 합치거나, Allure가 지원하는 **history** 디렉터리 구조로 유지.
  - `allure generate` 한 번 실행 → **allure-report**를 GitHub Pages(또는 Netlify 등)에 배포.
- **장점**: 무료, Playwright + allure-playwright 이미 연동됨. 트렌드·이력 비교 가능.
- **단점**: Run 목록 UX는 Katalon만큼 “테스트 전용 대시보드”로 세련되진 않을 수 있음. Java 필요.

### B. ReportPortal (오픈소스 / Cloud)

- **역할**: 테스트 결과를 **API로 전송**하면 Run 목록이 쌓이고, 각 Run을 클릭해 상세 결과(Summary, 스위트, 통과/실패, 로그/스크린샷) 확인.
- **구성**: Playwright 결과를 ReportPortal이 받을 수 있는 형식(JUnit XML 등)으로 내보내고, CI에서 ReportPortal API로 업로드. Self-host 또는 ReportPortal Cloud.
- **장점**: 이미지와 비슷한 “Run 목록 → 클릭 → 상세” UX. 트렌드, 플라키 분석 등 기능 많음.
- **단점**: 서버 설치/운영 또는 Cloud 비용. Playwright 연동은 리포터/스크립트 작성 필요.

### C. Katalon TestOps (이미지와 동일)

- **역할**: 이미지와 같은 “Test Run #220”, “Test Suites”, “History” 테이블(Started, Duration, Total, Passed/Failed breakdown) 제공.
- **구성**: Katalon/다른 프레임워크에서 결과를 TestOps로 전송. Playwright의 경우 JUnit XML 등 지원 포맷으로 내보내고 TestOps에 업로드하는 방식 사용.
- **장점**: UI/UX가 이미지와 동일. 요구사항·디펙트 연동 등 테스트 관리 기능 풍부.
- **단점**: 유료. Katalon/TestOps 계정 및 설정 필요.

### D. Allure TestOps (Qameta)

- **역할**: Allure 형식 결과를 올리면 Run 목록, 트렌드, 요구사항 매핑 등 제공. Allure Report보다 “대시보드·관리”에 가깝게 구성됨.
- **구성**: CI에서 allure-results(또는 호환 데이터)를 Allure TestOps로 전송.
- **장점**: 이미 allure-playwright 쓰면 연동 수고 적음. Run 목록 + 클릭 구조 명확.
- **단점**: 유료(Cloud/Self-host).

---

## 4. 추천 정리

- **무료로 “실행할 때마다 결과 클릭”만 하면 됨**  
  → **현재처럼 GitHub Actions Artifacts**만 써도 가능. Run = Actions Run, 클릭 = Artifacts에서 리포트 다운로드 후 열기.

- **무료이면서 “한 URL에서 Run 이력 + 트렌드 + 클릭”**  
  → **Allure Report + GitHub Pages(또는 정적 호스팅)**.  
  CI에서 allure-results를 Run별로 보관하고, 주기적으로 또는 매 Run 후 `allure generate`로 리포트를 갱신해 배포하면, 이미지와 유사하게 “Run 이력 → 클릭해서 해당 Run 결과 확인”이 가능해짐.

- **이미지와 가장 비슷한 상용 제품**  
  → **Katalon TestOps**.  
  이미 사용 중인 화면이라면 그대로 “실행할 때마다 결과를 여기서 클릭해서 확인”하도록 CI만 연동하면 됨.

- **오픈소스로 풀 대시보드**  
  → **ReportPortal** (Self-host 또는 Cloud).  
  Run 목록, 클릭 시 상세, 트렌드, 플라키 등 이미지 수준의 대시보드를 무료( self-host )로 구성 가능.

---

## 5. 다음에 할 수 있는 작업 (선택)

- **Allure + GitHub Pages “Run 목록” 체험**:  
  CI에 “이전 Run의 allure-results 다운로드 → 현재 Run 결과와 합치기 → allure generate → GitHub Pages 배포” 스텝을 넣으면, 한 URL에서 이력이 누적된 Allure 대시보드를 볼 수 있음.
- **ReportPortal 연동**:  
  JUnit XML 리포터 추가 후 ReportPortal API 업로드 스크립트를 CI에 넣어 “Run 목록 + 클릭”을 ReportPortal에서만 보게 할 수 있음.

원하시면 “Allure + GitHub Pages로 Run 이력 누적” 구체 스텝(워크플로 예시, 디렉터리 구조)을 이 문서에 이어서 작성해 드리겠습니다.

---

## 6. 구현됨: 요일/실행 주기별 이력 페이지 (GitHub Pages)

**main** 브랜치에 push될 때마다 테스트가 돌고, 그 Run의 Playwright 리포트가 **gh-pages** 브랜치에 누적됩니다. 한 URL에서 **날짜·시각별 Run 목록**을 보고, 클릭하면 해당 시점의 상세 리포트로 이동합니다.

- **URL**: 저장소 **Settings → Pages** 에서 Source를 **Deploy from a branch** / Branch: **gh-pages** 로 설정하면  
  `https://<org>.github.io/<repo>/` 에서 이력 페이지가 열립니다.
- **내용**: 표에 날짜, 시각, Run ID, 총계/통과/실패/스킵, 소요 시간. Run ID 클릭 시 해당 Run의 Playwright HTML 리포트.
- **구성**: `.github/workflows/playwright.yml` 의 `deploy-report-history` job, `scripts/generate-report-index.mjs`, `scripts/write-report-summary.mjs`.

**로컬에서 인덱스만 미리보기**: `report-site` 디렉터리를 수동으로 채운 뒤  
`REPORT_SITE=report-site node scripts/generate-report-index.mjs` 로 `report-site/index.html` 을 만들고, 브라우저로 해당 파일을 열면 됩니다.
