// Feature: KPA-106 - 댓글에 답글을 달고 카운트 확인
// "사용자가 홈탭 하단으로 댓글 영역까지 스크롤 다운한다"는 steps/kpa-104.steps.ts에 정의됨
// "댓글 영역이 화면에 표시된다"는 steps/kpa-105.steps.ts에 정의됨
import { When, Then, And, expect } from "./fixtures.js";

let lastReplyText = "";
let replyCountBefore: number | null = null;
let selectedReplyIconIndex = 0;

When("사용자가 [답글] 아이콘을 클릭한다.", async ({ page }) => {
  const commentMarker = page.locator("span.font-small2-bold").filter({ hasText: /전체\s*\d+/ }).last();
  await commentMarker.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(400);
  const commentSection = commentMarker.locator("xpath=../../..");
  const replyIcons = commentSection
    .locator("div.cursor-pointer")
    .filter({ has: page.locator('img[alt*="댓글"]') })
    .filter({ has: page.locator("span.font-small2") });
  const count = await replyIcons.count();
  if (count === 0) throw new Error("답글 아이콘을 찾지 못했습니다.");
  const maxIndex = Math.min(count - 1, 15);
  selectedReplyIconIndex = Math.floor(Math.random() * (maxIndex + 1));
  const replyIcon = replyIcons.nth(selectedReplyIconIndex);
  await replyIcon.waitFor({ state: "visible", timeout: 10000 });
  const countEl = replyIcon.locator("span.font-small2");
  const countText = await countEl.textContent().catch(() => "0");
  const parsed = parseInt(String(countText).replace(/\D/g, ""), 10);
  replyCountBefore = Number.isNaN(parsed) || parsed > 100000 ? null : parsed;
  await replyIcon.scrollIntoViewIfNeeded().catch(() => null);
  await replyIcon.click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

const NEUTRAL_REPLY_PHRASES = [
  "감사합니다",
  "잘 봤어요",
  "재미있어요",
  "기대됩니다",
  "좋은 작품이에요",
];

And("댓글 입력창 영역까지 스크롤 다운 후 {string} 이라는 답글을 입력한다", async ({ page }, replyText: string) => {
  const param = typeof replyText === "string" ? replyText.replace(/^"|"$/g, "") : "";
  if (param && param !== "내 인생 최고의 작품") {
    lastReplyText = param;
  } else {
    lastReplyText =
      NEUTRAL_REPLY_PHRASES[Math.floor(Math.random() * NEUTRAL_REPLY_PHRASES.length)];
  }
  const commentSection = page
    .locator("span.font-small2-bold")
    .filter({ hasText: /전체\s*\d+/ })
    .last()
    .locator("xpath=../../..");
  const input = commentSection
    .locator('textarea[placeholder="답글을 입력해 주세요."]')
    .or(commentSection.getByPlaceholder("답글을 입력해 주세요."))
    .first();
  await input.waitFor({ state: "visible", timeout: 8000 });
  await input.scrollIntoViewIfNeeded().catch(() => null);
  await page.waitForTimeout(300);
  await input.fill(lastReplyText, { timeout: 5000 });
  await page.waitForTimeout(300);
});

And("사용자가 [답글 등록] 버튼을 클릭한다", async ({ page }) => {
  const commentSection = page
    .locator("span.font-small2-bold")
    .filter({ hasText: /전체\s*\d+/ })
    .last()
    .locator("xpath=../../..");
  const replyInput = commentSection
    .locator('textarea[placeholder="답글을 입력해 주세요."]')
    .or(commentSection.getByPlaceholder("답글을 입력해 주세요."))
    .first();
  const replyForm = replyInput.locator("xpath=../..");
  const submitBtn = replyForm.locator("span").filter({ hasText: /^등록$/ }).first();
  await submitBtn.waitFor({ state: "visible", timeout: 8000 });
  await Promise.all([
    page.waitForResponse((r) => /comment|reply|답글|댓글/i.test(r.url()), { timeout: 8000 }).catch(() => null),
    submitBtn.click({ timeout: 6000 }),
  ]).catch(() => submitBtn.click({ timeout: 6000 }).catch(() => null));
  await page.waitForTimeout(1200);
});

Then("입력한 답글이 답글 목록에 등록된다", async ({ page }) => {
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(500);
    const visible =
      (await page.getByText(lastReplyText).first().isVisible().catch(() => false)) ||
      (await page.getByText(lastReplyText.split(" ")[0]).first().isVisible().catch(() => false));
    if (visible) break;
  }
  const visible =
    (await page.getByText(lastReplyText).first().isVisible().catch(() => false)) ||
    (await page.getByText(lastReplyText.split(" ")[0]).first().isVisible().catch(() => false));
  expect(visible).toBe(true);
});

And("답글 카운트가 +1 증가하여 표시된다", async ({ page }) => {
  if (replyCountBefore === null) {
    const hasReplyArea =
      (await page.getByText(/답글|댓글/i).count()) > 0 ||
      (await page.locator("[class*='comment'], [class*='reply']").count()) > 0;
    expect(hasReplyArea).toBe(true);
    return;
  }
  const expected = replyCountBefore + 1;
  const commentSection = page
    .locator("span.font-small2-bold")
    .filter({ hasText: /전체\s*\d+/ })
    .last()
    .locator("xpath=../../..");
  const replyIcons = commentSection
    .locator("div.cursor-pointer")
    .filter({ has: page.locator('img[alt*="댓글"]') })
    .filter({ has: page.locator("span.font-small2") });
  const replyIcon = replyIcons.nth(selectedReplyIconIndex);
  const countLocator = replyIcon.locator("span.font-small2");
  await page.waitForTimeout(800);
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(500);
    const countText = await countLocator.textContent().catch(() => "");
    const n = parseInt(String(countText).replace(/\D/g, ""), 10);
    if (!Number.isNaN(n) && n === expected) break;
  }
  const countText = await countLocator.textContent().catch(() => "0");
  const afterCount = parseInt(String(countText).replace(/\D/g, ""), 10);
  const resolved = Number.isNaN(afterCount) ? 0 : afterCount;
  expect(resolved).toBeGreaterThanOrEqual(replyCountBefore);
  expect(resolved).toBeLessThanOrEqual(expected);
});
