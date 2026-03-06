# Playwright Test Automation — AI 코딩 규칙

## 테스트 코드 작성 원칙

### Assertion 규칙 (최우선)

1. **`expect()` 결과를 절대 삼키지 않는다**
   - `.catch(() => null)`, `.catch(() => false)` 를 assertion에 사용 금지
   - assertion이 실패하면 테스트가 반드시 실패해야 한다
   ```typescript
   // BAD — assertion 실패가 무시됨
   await expect(element).toBeVisible({ timeout: 10000 }).catch(() => null);

   // GOOD — 실패 시 테스트 실패
   await expect(element).toBeVisible({ timeout: 10000 });
   ```

2. **`.catch(() => null)`은 action(클릭, 스크롤, 네비게이션)에만 허용**
   ```typescript
   // OK — action의 방어적 처리
   await link.scrollIntoViewIfNeeded().catch(() => null);
   await page.waitForLoadState("domcontentloaded").catch(() => null);

   // BAD — assertion을 action처럼 취급
   await expect(page).toHaveURL(/search/i).catch(() => null);
   ```

3. **항상 참인 assertion 금지**
   ```typescript
   // BAD
   expect(deleted || true).toBe(true);       // || true 제거
   expect(count).toBeGreaterThanOrEqual(0);   // 0 이상은 항상 참 → >= 1
   expect(await page.locator("img").count() > 0 || await page.locator("main").count() > 0).toBe(true);  // 모든 페이지에서 참
   ```

4. **검증 대상은 구체적이어야 한다**
   - 네비게이션/헤더에 항상 존재하는 텍스트로 검증하지 않는다
   - 해당 시나리오에서만 나타나는 고유한 요소를 검증한다

### 빈 스텝 금지

- `Given`/`And` 전제 조건 스텝도 최소한의 상태 확인을 포함해야 한다
- 검증이 불가능한 전제 조건은 feature 파일의 주석(사전 조건)으로 이동한다
```typescript
// BAD — 아무것도 하지 않음
And("사용자의 계정에 구매 이력이 존재한다", async () => {});

// GOOD — 최소 확인
And("사용자의 계정에 구매 이력이 존재한다", async ({ page }) => {
  const hasItems = await page.locator('a[href*="/content/"]').count();
  expect(hasItems).toBeGreaterThanOrEqual(1);
});
```

### 방어적 코드 vs 검증 코드 구분

| 상황 | `.catch()` 허용 | 이유 |
|------|:---:|------|
| 클릭, 스크롤, goto | O | 부가 동작 실패는 다음 단계에서 잡힘 |
| `waitForLoadState` | O | 네트워크 타이밍 방어 |
| `isVisible()` 조건 분기 | O | 분기 판단이지 검증이 아님 |
| `expect().toBeVisible()` | **X** | 검증 결과를 삼키면 안 됨 |
| `expect().toHaveURL()` | **X** | 검증 결과를 삼키면 안 됨 |
| `expect().toBe()` | **X** | 검증 결과를 삼키면 안 됨 |

## 프로젝트 구조

- `features/pcw/` — BDD feature 파일 (한국어 Gherkin)
- `steps/` — step 구현 파일 (TypeScript)
- `steps/fixtures.ts` — 공통 fixture, BDD 바인딩
- `pages/` — 페이지 객체
- `scripts/` — 리포트, 슬랙 알림, 유틸리티

## 테스트 실행

```bash
npm run bddgen          # feature 변경 시 BDD 코드 재생성
npm run test:ui         # Chromium UI 모드
npm run test:ui:ci      # UI 모드 + 슬랙 알림 + 리포트 발행
npm run test:headless   # 헤드리스 + 슬랙 알림 + 리포트 발행
```
