# Allure 리포트 연동 설계

## 목적

- **실행 이력·대시보드**: "언제 몇 개 통과/실패했는지", "이전 실행들과 비교"를 한 페이지에서 확인
- Playwright 실행 결과를 Allure 형식으로 내보내고, Allure Report로 HTML 대시보드 생성
- 로컬: `allure serve`로 즉시 확인 / 배포: `allure generate`로 만든 정적 HTML을 웹 서버에 호스팅

## 요구사항 정리

| 구분 | 내용 |
|------|------|
| 로컬 | `allure serve`로 결과 디렉터리 기반 임시 서버 + 브라우저 자동 오픈 |
| 배포 | `allure generate`로 정적 HTML 생성 후 아티팩트 업로드 또는 정적 호스팅 |
| CI | 매 실행마다 `allure-results` 수집 → `allure generate` → 아티팩트 또는 정적 호스팅 업로드 |
| 리포터 | `@playwright/test` + `allure-playwright` 로 리포터 설정 |

## 기술 선택

- **리포터**: [allure-playwright](https://www.npmjs.com/package/allure-playwright) (Allure Report 공식 문서 기준)
- **CLI**: `allure-commandline` — `allure generate` / `allure serve` 실행용 (Java 8+ 필요)
- **결과 디렉터리**: `allure-results/` (기본값 유지)
- **생성 리포트 디렉터리**: `allure-report/` (generate 출력)

## 디렉터리 구조

```
프로젝트 루트/
├── allure-results/     # 테스트 실행 시 Allure 리포터가 생성 (git 제외)
├── allure-report/      # allure generate 실행 시 생성되는 정적 HTML (git 제외)
├── playwright.config.ts # reporter에 ["allure-playwright", { resultsDir: "allure-results" }] 추가
└── ...
```

- `allure-results/`: 실행 시마다 덮어쓰거나 누적(동일 런치로 여러 run 시). CI에서는 run별로 아티팩트로 보관 가능.
- `allure-report/`: `allure generate ./allure-results -o ./allure-report`로 생성. 이 디렉터리 전체를 정적 호스팅에 올리면 됨.

## 로컬 워크플로

1. 테스트 실행: `npm run test` (또는 `test:ui` 등) → `allure-results/`에 결과 생성
2. 리포트 확인:
   - **즉시 보기**: `npm run allure:serve` → `allure serve allure-results` (임시 서버 + 브라우저 오픈)
   - **정적 생성 후 보기**: `npm run allure:generate` 후 `npx allure open allure-report` (또는 브라우저로 `allure-report/index.html` 직접 오픈)

## CI 워크플로 (GitHub Actions)

1. **테스트 실행**  
   기존처럼 `npm run test` (또는 `test:ci`) 실행.  
   `playwright.config.ts`에 Allure 리포터가 설정되어 있으면 `allure-results/`가 생성됨.

2. **Allure 결과 아티팩트 업로드**  
   `allure-results/`를 아티팩트로 업로드 (실행 이력 보관·다운로드용).

3. **Java 설정**  
   `allure generate`는 Allure CLI(Java 기반)가 필요하므로 `actions/setup-java`로 JDK 설정.

4. **Allure CLI 설치**  
   `npm install -g allure-commandline` 또는 프로젝트 devDependency로 `npx allure-commandline` 사용.

5. **리포트 생성**  
   `allure generate allure-results -o allure-report --clean`.

6. **리포트 아티팩트 업로드**  
   `allure-report/`를 아티팩트로 업로드. 워크플로 실행 후 Artifacts에서 HTML 리포트 다운로드 가능.

7. **(선택) 정적 호스팅**  
   GitHub Pages, S3, Netlify 등에 `allure-report/` 내용을 배포하면 "항상 최신 실행 결과" URL 하나로 대시보드 공유 가능. 별도 워크플로 또는 배포 스크립트로 구현.

## Playwright 설정 변경

- 기존 리포터 유지: `html`, `list`, `json` (Slack 알림·기존 아티팩트와 호환)
- 추가: `["allure-playwright", { resultsDir: "allure-results", detail: true, suiteTitle: true }]`
- 필요 시 `environmentInfo`에 `node_version`, `CI` 등 추가 가능.

## npm 스크립트

| 스크립트 | 설명 |
|----------|------|
| `allure:generate` | `allure generate allure-results -o allure-report --clean` |
| `allure:serve` | `allure serve allure-results` (로컬에서 즉시 리포트 확인) |

## 의존성

- `allure-playwright`: Playwright 리포터
- `allure-commandline`: `allure generate` / `allure serve` (devDependencies, 로컬·CI 모두에서 사용)

## 전제 조건

- **Java 8+**: `allure generate` / `allure serve` 실행을 위해 필요. 로컬·CI 모두에서 `JAVA_HOME` 또는 PATH에 `java` 필요.
- CI(ubuntu-latest)에서는 `actions/setup-java`로 JDK를 설치하면 됨.

## 실행 이력·트렌드

- Allure는 `allure-results/` 내 **history** 데이터를 유지하면 런 간 트렌드(통과/실패 추이)를 보여줌.
- CI에서 run마다 새 폴더에 생성하면 run 단위 이력만 보임; **같은 `allure-results`에 누적**하거나, **이전 run의 history를 복사**해 오면 트렌드 그래프가 채워짐.  
  상시 대시보드(GitHub Pages 등)를 쓸 경우: 매 run 후 `allure generate`한 결과를 **같은 저장소/같은 경로**에 덮어 배포하고, **history** 디렉터리를 다음 run에서 다시 넣어주는 방식으로 트렌드를 유지할 수 있음 (구현 시 별도 스텝 설계).

## 요약

- **설정**: `playwright.config.ts`에 `allure-playwright` 리포터 추가, `allure-results` 디렉터리 사용.
- **로컬**: 테스트 실행 후 `npm run allure:serve`로 즉시 확인.
- **CI**: 테스트 → `allure-results` 아티팩트 업로드 → Java 설정 → `allure generate` → `allure-report` 아티팩트 업로드 (필요 시 정적 호스팅 배포).
