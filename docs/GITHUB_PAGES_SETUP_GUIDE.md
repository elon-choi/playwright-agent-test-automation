# GitHub Pages 실행 이력 설정 가이드 (상세)

테스트 실행 이력 페이지를 쓰려면 **gh-pages** 브랜치가 있어야 하고, 이 브랜치는 **워크플로가 한 번 실행된 뒤** 자동으로 생성됩니다. 아래 순서대로 진행하면 됩니다.

---

## 1. 워크플로 한 번 실행하기

실행 방법은 **두 가지** 중 하나입니다.

### 방법 A: main에 push 하기

1. 로컬에서 코드 수정 후 커밋합니다.
   ```bash
   git add .
   git commit -m "chore: trigger workflow for gh-pages"
   git push origin main
   ```
2. push가 완료되면 **자동으로** "Playwright Tests" 워크플로가 실행됩니다.

### 방법 B: Actions에서 수동 실행하기 (코드 변경 없이)

1. **저장소 상단 탭**에서 **Actions** 를 클릭합니다.  
   (Settings 쪽 왼쪽 메뉴의 "Actions"가 아니라, **Code / Issues / Pull requests** 옆에 있는 **Actions** 탭입니다.)
2. 왼쪽 워크플로 목록에서 **"Playwright Tests"** 를 클릭합니다.
3. 오른쪽 상단 **"Run workflow"** 버튼을 클릭합니다.
4. **Branch**가 `main`인지 확인하고, 다시 **"Run workflow"** 를 눌러 실행합니다.
5. 잠시 후 목록 맨 위에 **노란색 원(진행 중)** 이 보이면 실행이 시작된 것입니다.

---

## 2. 실행이 끝날 때까지 기다리기

1. **Actions** 탭에서 방금 실행된 **Run** (맨 위 항목)을 클릭합니다.
2. **두 개의 job**이 보입니다.
   - **test**: Playwright 테스트 실행, 리포트·아티팩트 업로드
   - **deploy-report-history**: gh-pages에 리포트 이력 배포 (main 브랜치 push 시에만 실행)
3. **test**가 먼저 끝나고(녹색 체크), 이어서 **deploy-report-history**가 실행됩니다.
4. **deploy-report-history**까지 **녹색 체크**가 되면 성공입니다.  
   - 실패(빨간 X)가 나오면 해당 job을 클릭해 로그를 확인합니다.  
   - `GITHUB_TOKEN` 권한 오류가 나면 아래 "5. 문제 해결"을 봅니다.

**참고:** `deploy-report-history`는 **push to main** 또는 **수동 Run workflow (main 기준)** 일 때만 실행됩니다. PR만 열었을 때는 이 job이 건너뛰어지고, 그 경우에는 gh-pages가 생성/갱신되지 않습니다.

---

## 3. gh-pages 브랜치 생성 여부 확인하기

1. 저장소 **상단 탭**에서 **Code** 를 클릭합니다.
2. **main** 이라고 써 있는 **브랜치 선택 버튼**을 클릭합니다.
3. 드롭다운에 **브랜치 목록**이 나옵니다.  
   - **gh-pages** 가 보이면 정상적으로 생성된 것입니다.
   - 안 보이면 **검색창에 "gh-pages"** 를 입력해 보거나, 워크플로 Run에서 **deploy-report-history** 가 실제로 실행됐는지(녹색 체크) 다시 확인합니다.

---

## 4. GitHub Pages에서 gh-pages 연결하기

1. **Settings** 탭으로 이동합니다.
2. 왼쪽 메뉴 **Code and automation** 아래 **Pages** 를 클릭합니다.
3. **Build and deployment** 에서:
   - **Source**: **Deploy from a branch**
   - **Branch**: **gh-pages** 선택, 폴더는 **/ (root)**
4. **Save** 를 누릅니다.
5. 몇 분 뒤 **"Your site is live at https://...github.io/저장소이름/"** 처럼 안내가 뜨면, 그 주소가 **실행 이력 페이지** 주소입니다.

---

## 5. 문제 해결

### deploy-report-history 가 실패하는 경우

- **원인:** `GITHUB_TOKEN` 이 기본값이면 브랜치에 push할 **쓰기 권한**이 없을 수 있습니다.
- **조치:**  
  **Settings → Actions → General** 로 이동해 아래로 내려 **Workflow permissions** 를 찾습니다.  
  **"Read and write permissions"** 를 선택하고 **Save** 합니다.  
  그 다음 Actions에서 **"Re-run all jobs"** 또는 **Run workflow** 로 다시 실행합니다.

### gh-pages가 드롭다운에 안 보이는 경우

- **deploy-report-history** 가 **실제로 실행됐는지** (녹색 체크) 확인합니다.
- **main** 에 대한 push 또는 **Run workflow (main)** 로만 이 job이 돌므로, PR만 열었다면 한 번 **main에 push** 하거나 **Run workflow** 로 main 기준 실행해 봅니다.
- 브랜치 목록을 **새로고침** 하거나, **Code** 탭에서 브랜치 검색창에 `gh-pages` 를 입력해 봅니다.

### Pages가 "Page build failed" 또는 빈 페이지인 경우

- **Branch** 가 **gh-pages**, 폴더가 **/ (root)** 인지 확인합니다.
- 배포 반영까지 **1~2분** 걸릴 수 있으니 잠시 후 다시 접속해 봅니다.

---

## 요약 체크리스트

- [ ] **방법 A** 또는 **방법 B**로 "Playwright Tests" 워크플로 실행
- [ ] **test** job 성공 (녹색)
- [ ] **deploy-report-history** job 성공 (녹색)
- [ ] **Code** 탭 브랜치 목록에 **gh-pages** 확인
- [ ] **Settings → Pages** 에서 Branch: **gh-pages**, / (root), **Save**
- [ ] 안내된 URL로 접속해 실행 이력 표가 보이는지 확인
