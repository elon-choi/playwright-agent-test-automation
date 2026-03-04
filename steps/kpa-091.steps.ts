// Feature: KPA-091 시나리오 검증
// Scenario: 회차 정렬 기능 검증
import { Given, When, Then, expect } from "./fixtures.js";

When('사용자가 "첫화부터" 정렬 옵션을 클릭한다', async ({ page }) => {
  const optionCandidates = [
    page.getByRole("option", { name: /첫화부터/i }),
    page.getByRole("button", { name: /첫화부터/i }),
    page.getByText(/^첫화부터$/)
  ];
  for (const locator of optionCandidates) {
    if (await locator.count()) {
      await locator.first().click({ force: true });
      // 정렬 클릭 후 리스트 재렌더링 대기
      await page.waitForTimeout(800);
      return;
    }
  }
  throw new Error("첫화부터 정렬 옵션을 찾지 못했습니다.");
});

Then('"첫화부터" 옵션이 화면에 노출된다', async ({ page }) => {
  const sortTrigger = page.getByRole("button", { name: /첫화부터|최신순/i });
  if (await sortTrigger.count()) {
    await sortTrigger.first().click({ force: true });
  }
  await expect(page.getByText(/첫화부터/i).first()).toBeVisible();
  // 드롭다운을 닫아 다음 스텝의 에피소드 목록 확인에 영향 주지 않도록
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
});

Then("회차가 1화부터 순서대로 정렬되어 화면에 노출된다", async ({ page }) => {
  const episodeLinks = page.locator('a[href*="/viewer/"]');
  const count = await episodeLinks.count();
  if (count === 0) {
    throw new Error("회차 목록을 찾지 못했습니다.");
  }
  const sampleCount = Math.min(count, 5);
  const titles: string[] = [];
  for (let i = 0; i < sampleCount; i += 1) {
    titles.push(await episodeLinks.nth(i).innerText());
  }
  const firstIndex = titles.findIndex((text) => /1화/.test(text));
  const secondIndex = titles.findIndex((text) => /2화/.test(text));
  if (firstIndex === -1) {
    throw new Error("1화 항목을 찾지 못했습니다.");
  }
  if (secondIndex !== -1) {
    expect(firstIndex).toBeLessThan(secondIndex);
  }
});

Then("회차명이 오름차순 정렬되어 화면에 노출된다", async ({ page }) => {
  const episodeLinks = page.locator('a[href*="/viewer/"]');
  const count = await episodeLinks.count();
  if (count === 0) {
    throw new Error("회차 목록을 찾지 못했습니다.");
  }
  const sampleCount = Math.min(count, 5);
  const titles: string[] = [];
  for (let i = 0; i < sampleCount; i += 1) {
    titles.push(await episodeLinks.nth(i).innerText());
  }
  const firstIndex = titles.findIndex((text) => /1화/.test(text));
  const secondIndex = titles.findIndex((text) => /2화/.test(text));
  if (firstIndex === -1) {
    throw new Error("1화 항목을 찾지 못했습니다.");
  }
  if (secondIndex !== -1) {
    expect(firstIndex).toBeLessThan(secondIndex);
  }
});
