// Feature: KPA-136 - 무료 회차에서 작품홈으로 이동
// "사용자는 작품홈으로 이동한다"는 common.episode.steps.ts에 구현됨
import { And } from "./fixtures.js";

And("사용자가 \"작품홈 가기\" 영역을 클릭한다", async ({ page }) => {
  const btn = page.getByRole("button", { name: /작품홈\s*가기/i }).or(page.getByText(/작품홈\s*가기/i).first());
  if ((await btn.count()) > 0) await btn.click({ timeout: 8000 }).catch(() => null);
  await page.waitForTimeout(400).catch(() => null);
});
