# 테스트 결과 반영 확인 후 로컬 결과 폴더 삭제 가이드

리포트 페이지(GitHub Pages)에 결과가 이미 반영된 뒤에는, 로컬의 결과 폴더를 삭제해도 **리포트 페이지에는 영향이 없습니다.**  
아래 순서대로 확인한 다음 삭제하면 됩니다.

---

## 1단계: 테스트 결과가 잘 반영됐는지 확인

### 1-1. 리포트 페이지 열기

- 브라우저에서 **실행 이력 페이지**를 연다.  
  https://elon-choi.github.io/playwright-agent-test-automation/

### 1-2. 표에서 확인할 것

- **총계 / 통과 / 실패 / 스킵** 열이 **0이 아닌 Run**이 있는지 확인한다.
- 최근에 CI가 돌았다면, 가장 위 Run의 **총계**, **통과**, **실패**, **소요** 등이 채워져 있어야 한다.

### 1-3. 상세 리포트 확인 (선택)

- 표에서 Run 링크(예: `2026-02-23_17-32-01`)를 클릭한다.
- 해당 Run의 Playwright HTML 상세 리포트가 열리는지 확인한다.
- 실패한 테스트가 있으면 목록·스크린샷 등이 보이는지 확인한다.

### 1-4. 확인이 끝났다면

- 위처럼 **최근 Run에 숫자가 잘 나오고**, **Run 클릭 시 상세도 열리면**  
  → “테스트 결과가 잘 반영된 상태”로 보고, 로컬 결과 폴더를 삭제해도 된다.

---

## 2단계: 어떤 폴더를 삭제하는지

로컬에서 삭제해도 되는 **결과/리포트용 폴더**는 아래와 같다.

| 폴더 | 내용 |
|------|------|
| `allure-results/` | Allure 원본 결과 (result.json, 첨부 zip/png 등) |
| `allure-report/` | Allure로 생성한 HTML 리포트 |
| `test-results/` | Playwright JSON·trace 등 테스트 결과 |
| `playwright-report/` | Playwright HTML 리포트 |
| `blob-report/` | Blob 리포터 결과 (사용 시) |
| `dom_dumps/` | 실패 시 DOM 덤프 HTML |
| `dom_logs/` | 실패 시 로그 JSON |

이 폴더들은 **리포트 페이지와 별개**로, 로컬/CI에서만 쓰인다.  
삭제해도 **이미 배포된 리포트 페이지(gh-pages)에는 영향이 없다.**

---

## 3단계: 삭제 방법

### 방법 A: 한 번에 전부 삭제 (권장)

프로젝트 루트에서:

```bash
# 지울 대상만 보고 싶을 때 (실제 삭제 안 함)
npm run clean:results -- --dry-run

# 위에서 확인한 뒤, 실제로 삭제
npm run clean:results
```

- `clean:results`는 위 표의 7개 폴더를 **한 번에** 비운다.
- `--dry-run`은 삭제하지 않고, 지울 폴더/용량만 보여 준다.

### 방법 B: 폴더별로 삭제

- **allure-results만** 비우기 (용량이 클 때):  
  `npm run clean:allure-results`  
  또는  
  `npm run clean:allure-results -- --all`

- **나머지 폴더**는 터미널에서 직접 삭제:

```bash
# 프로젝트 루트에서
rm -rf test-results playwright-report allure-report blob-report dom_dumps dom_logs
```

- `allure-results`는 위에서 `npm run clean:allure-results`로 이미 비웠다면 생략해도 된다.

---

## 4단계: 삭제 후 확인

1. **리포트 페이지**를 새로고침해서,  
   - Run 목록과 숫자(총계/통과/실패 등)가 **그대로**인지 확인한다.
2. Run 하나를 클릭해서 **상세 리포트**가 여전히 열리는지 확인한다.

둘 다 그대로라면, 로컬 결과 폴더 삭제는 **완료**이고, 리포트에는 영향이 없는 상태다.

---

## 요약

1. **확인**:  
   https://elon-choi.github.io/playwright-agent-test-automation/ 에서  
   최근 Run에 총계/통과/실패가 채워져 있는지, Run 클릭 시 상세가 열리는지 확인.
2. **삭제**:  
   `npm run clean:results -- --dry-run` 으로 확인 후  
   `npm run clean:results` 로 한 번에 삭제.
3. **재확인**:  
   같은 리포트 페이지를 새로고침·클릭해서 변화가 없는지 확인.

이후에도 테스트를 다시 돌리면, 위 폴더들은 새로 생성되고, CI가 돌면 리포트 페이지에 새 Run이 다시 쌓인다.
