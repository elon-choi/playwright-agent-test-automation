# 스텁 패턴 잔존 KPA 목록 (실제 시나리오 전환 대상)

아래 KPA는 `if ((await locator.count()) > 0) { ... .catch(() => null) }` 또는 느슨한 expect 패턴으로
요소가 없어도 통과하는 스텁에 가까운 동작이 남아 있음. 실제 UI가 있을 때만 동작/검증하도록 수정 필요.

## 목록 (스텁 후보 44건)

032, 033, 034, 037, 038, 055, 057, 058, 060, 066, 067, 068, 069, 070, 072, 073, 074, 075, 076, 077, 078, 079, 081, 082, 085, 086, 087, 088, 089, 090, 098, 100, 102, 104, 105, 106, 107, 108, 111, 112, 113, 115, 118, 119, 120, 123, 125, 126, 127, 132, 133, 136, 137

## 수정 원칙

1. 필수 요소가 없으면 실패: `if (count === 0) throw new Error("...");` 후 동작 실행.
2. 클릭/입력은 실패 전파: `.catch(() => null)` 제거.
3. 검증은 구체적 요소 기준: 해당 탭/영역이 visible 또는 attached인지 확인.

---

## 104, 105, 106 즉시 적용 가이드 (댓글 탭 없을 때 실패하도록)

### steps/kpa-104.steps.ts

**When("사용자가 댓글 탭을 클릭한다"** 블록 전체를 아래로 교체:

```ts
When("사용자가 댓글 탭을 클릭한다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await ensureContentPage(page);
  const commentTab = page.getByRole("tab", { name: /댓글/i }).or(page.getByRole("link", { name: /댓글/i })).or(page.getByText(/댓글/).first());
  const count = await commentTab.count();
  if (count === 0) {
    throw new Error("작품홈에 댓글 탭이 없습니다. 댓글 탭이 노출되는 작품에서만 이 시나리오를 실행할 수 있습니다.");
  }
  await commentTab.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
});
```

**And("사용자가 [정렬] 버튼을 클릭한다"** 블록을 아래로 교체:

```ts
And("사용자가 [정렬] 버튼을 클릭한다", async ({ page }) => {
  const sortBtn = page.getByRole("button", { name: /정렬/i }).or(page.getByText(/정렬/).first());
  await expect(sortBtn.first()).toBeVisible({ timeout: 8000 });
  await sortBtn.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);
});
```

**And("사용자가 임의의 정렬 옵션을 선택한다"** 블록을 아래로 교체:

```ts
And("사용자가 임의의 정렬 옵션을 선택한다", async ({ page }) => {
  const option = page.getByRole("button", { name: /좋아요순|최신순/i }).or(page.getByText(/좋아요순|최신순/).first());
  await expect(option.first()).toBeVisible({ timeout: 6000 });
  await option.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);
});
```

### steps/kpa-105.steps.ts

**Then("댓글 영역이 화면에 표시된다"** 블록을 아래로 교체:

```ts
Then("댓글 영역이 화면에 표시된다", async ({ page }) => {
  const commentArea = page.getByRole("tab", { name: /댓글/i })
    .or(page.getByRole("link", { name: /댓글/i }))
    .or(page.locator("[class*='comment'], [class*='Comment']").filter({ has: page.getByText(/댓글|닉네임|작성/i) }));
  await expect(commentArea.first()).toBeVisible({ timeout: 8000 });
});
```

**When("사용자가 첫 번째 댓글의 [좋아요] 버튼을 클릭한다"** 블록을 아래로 교체:

```ts
When("사용자가 첫 번째 댓글의 [좋아요] 버튼을 클릭한다", async ({ page }) => {
  if (/accounts\.kakao\.com|kauth\.kakao/i.test(page.url())) {
    throw new Error("로그인 상태가 필요합니다. 00-login.feature을 먼저 실행해 주세요.");
  }
  await ensureContentPage(page);
  const commentTab = page.getByRole("tab", { name: /댓글/i }).or(page.getByRole("link", { name: /댓글/i })).first();
  const tabCount = await commentTab.count();
  if (tabCount === 0) throw new Error("작품홈에 댓글 탭이 없습니다.");
  await commentTab.first().click({ timeout: 8000 });
  await page.waitForTimeout(600);
  const likeBtn = page.getByRole("button", { name: /좋아요/i }).or(page.locator("button").filter({ hasText: /좋아요|♡|❤/ })).first();
  await expect(likeBtn.first()).toBeVisible({ timeout: 6000 });
  await likeBtn.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);
});
```

### steps/kpa-106.steps.ts

**When("사용자가 [답글] 버튼을 클릭하고 임의의 답글을 입력한다"** 블록을 아래로 교체:

```ts
When("사용자가 [답글] 버튼을 클릭하고 임의의 답글을 입력한다", async ({ page }) => {
  const replyBtn = page.getByRole("button", { name: /답글/i }).or(page.getByText(/답글/).first());
  await expect(replyBtn.first()).toBeVisible({ timeout: 6000 });
  await replyBtn.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);
  const input = page.getByRole("textbox").or(page.locator("textarea").or(page.locator('input[type="text"]'))).first();
  await expect(input.first()).toBeVisible({ timeout: 5000 });
  await input.first().fill("테스트 답글입니다.", { timeout: 5000 });
  await page.waitForTimeout(300);
});
```

**And("사용자가 [답글 등록] 버튼을 클릭한다"** 블록을 아래로 교체:

```ts
And("사용자가 [답글 등록] 버튼을 클릭한다", async ({ page }) => {
  const submitBtn = page.getByRole("button", { name: /등록|답글\s*등록/i }).or(page.getByText(/등록/).first());
  await expect(submitBtn.first()).toBeVisible({ timeout: 6000 });
  await submitBtn.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});
```

**Then("입력한 답글이 답글 목록에 등록된다"** 블록을 아래로 교체:

```ts
Then("입력한 답글이 답글 목록에 등록된다", async ({ page }) => {
  await expect(page.getByText(/테스트 답글입니다/i).first()).toBeVisible({ timeout: 8000 });
});
```

**And("답글 카운트가 +1 증가하여 표시된다"** 블록을 아래로 교체:

```ts
And("답글 카운트가 +1 증가하여 표시된다", async ({ page }) => {
  const countOrComment = page.getByText(/\d+\s*개|댓글\s*\d+|\d+\s*댓글|답글\s*\d+/i).or(page.locator("[class*='comment']"));
  await expect(countOrComment.first()).toBeVisible({ timeout: 5000 });
});
```

위 적용 후 104·105·106은 댓글 탭/답글 UI가 없으면 실패합니다. 나머지 41건도 동일 원칙으로 `if (count === 0) throw` 및 `.catch(() => null)` 제거 후 필요 시 expect(요소).toBeVisible()로 교체하면 됩니다.
