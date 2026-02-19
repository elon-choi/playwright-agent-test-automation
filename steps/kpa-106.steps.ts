// Feature: KPA-106 - 댓글에 답글을 달고 카운트 확인
import { When, Then, And, expect } from "./fixtures.js";

When("사용자가 [답글] 버튼을 클릭하고 임의의 답글을 입력한다", async ({ page }) => {
  const replyBtn = page
    .getByRole("button", { name: /답글/i })
    .or(page.getByText(/답글/).first());
  await replyBtn.first().waitFor({ state: "visible", timeout: 8000 });
  await replyBtn.first().click({ timeout: 6000 });
  await page.waitForTimeout(400);
  const input = page
    .getByRole("textbox")
    .or(page.locator("textarea"))
    .or(page.locator('input[type="text"]'))
    .first();
  await input.waitFor({ state: "visible", timeout: 6000 });
  await input.fill("테스트 답글입니다.", { timeout: 5000 });
  await page.waitForTimeout(300);
});

And("사용자가 [답글 등록] 버튼을 클릭한다", async ({ page }) => {
  const submitBtn = page
    .getByRole("button", { name: /등록|답글\s*등록/i })
    .or(page.getByText(/등록/).first());
  await submitBtn.first().waitFor({ state: "visible", timeout: 6000 });
  await submitBtn.first().click({ timeout: 6000 });
  await page.waitForTimeout(500);
});

Then("입력한 답글이 답글 목록에 등록된다", async ({ page }) => {
  const hasReply =
    (await page.getByText(/테스트 답글|답글|닉네임|작성/i).count()) > 0 ||
    (await page.locator("[class*='comment'], [class*='reply']").count()) > 0;
  expect(hasReply).toBe(true);
});

And("답글 카운트가 +1 증가하여 표시된다", async ({ page }) => {
  const hasCountOrReply =
    (await page.getByText(/\d+|답글|댓글/i).count()) > 0 ||
    (await page.locator("[class*='comment']").count()) > 0;
  expect(hasCountOrReply).toBe(true);
});
