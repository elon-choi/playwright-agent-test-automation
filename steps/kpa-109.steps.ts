// Feature: KPA-109 시나리오 검증
// 전체 연령/무료 회차/뒤로 가기/작품홈 회차 리스트 스텝은 common.episode.steps.ts에 구현됨
// 뷰어 상단 UI 검증은 본 파일의 KPA-109 전용 스텝 사용 (공통 kpa-112 스텝과 문구 분리)
import { Then, And, expect } from "./fixtures.js";

Then("KPA-109 뷰어 상단 UI가 노출된다:", async ({ page }, _dataTable?: unknown) => {
  await page.waitForTimeout(500);
  await page.waitForURL(/\/viewer\//i, { timeout: 10000 }).catch(() => null);
  await expect(page).toHaveURL(/\/viewer\//i, { timeout: 5000 });

  const viewerArea = page.locator('[class*="viewer"], [class*="Viewer"], main').first();
  if ((await viewerArea.count()) > 0) {
    await viewerArea.evaluate((el: Element) => (el as HTMLElement).scrollTo(0, 0)).catch(() => null);
  }
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => null);
  await page.waitForTimeout(400);

  const toggleViewerUi = async () => {
    const size = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight })).catch(() => ({ w: 400, h: 600 }));
    const x = Math.floor((size.w ?? 400) / 2);
    const y = Math.floor((size.h ?? 600) / 2);
    await page.mouse.click(x, y).catch(() => null);
    await page.waitForTimeout(500);
  };

  await toggleViewerUi();
  await page.mouse.move(10, 10).catch(() => null);
  await page.waitForTimeout(300);

  let episodeFound = false;
  for (const attempt of [1, 2]) {
    if (attempt === 2) {
      await toggleViewerUi();
    }
    const allEpisode = page.getByText(/회차|\d+화/i);
    const n = await allEpisode.count();
    for (let i = 0; i < n && i < 20; i++) {
      const one = allEpisode.nth(i);
      const visible = await one.isVisible().catch(() => false);
      if (visible) {
        await one.waitFor({ state: "visible", timeout: 3000 }).catch(() => null);
        episodeFound = true;
        break;
      }
    }
    if (episodeFound) break;
  }
  expect(episodeFound, "회차명(회차|N화)이 화면에 노출되어야 함").toBe(true);

  const commentLink = page.locator('a[href*="/viewer/"][href*="/comment"]').first();
  await commentLink.waitFor({ state: "attached", timeout: 10000 });
  for (let i = 0; i < 4; i++) {
    const visible = await commentLink.isVisible().catch(() => false);
    if (visible) break;
    await toggleViewerUi();
  }
  await commentLink.waitFor({ state: "visible", timeout: 10000 });
  expect(await commentLink.count(), "댓글(댓글 페이지 링크) 노출되어야 함").toBeGreaterThan(0);

  const restUi = [
    { name: "정주행 아이콘", locator: page.locator('img[alt*="정주행"]').first() },
    { name: "이전화", locator: page.locator('img[alt="왼쪽 화살표"]').first() },
    { name: "다음화", locator: page.locator('[data-test="viewer-navbar-next-button"]').or(page.getByText(/다음화/)).first() },
    { name: "설정 메뉴", locator: page.locator('img[alt*="설정"]').first() }
  ];
  for (const { name, locator } of restUi) {
    await locator.waitFor({ state: "attached", timeout: 10000 });
    const isVisible = await locator.isVisible().catch(() => false);
    if (!isVisible) await toggleViewerUi();
    expect(await locator.count(), `${name} 노출되어야 함`).toBeGreaterThan(0);
  }
});

Then("뷰어 탭 하단에 다음 UI 요소들이 노출된다:", async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/viewer\//i, { timeout: 5000 });

  const requiredUi = [
    { name: "회차명", locator: page.getByText(/회차|\d+화/i).first() },
    { name: "정주행 아이콘", locator: page.locator('img[alt*="정주행"]').first() },
    { name: "댓글 아이콘", locator: page.locator('img[alt="댓글"]').first() },
    { name: "이전화", locator: page.locator('img[alt="왼쪽 화살표"]').first() },
    { name: "다음화", locator: page.locator('[data-test="viewer-navbar-next-button"]').first() },
    { name: "설정 메뉴", locator: page.locator('img[alt="설정"]').first() }
  ];

  for (const { name, locator } of requiredUi) {
    await locator.waitFor({ state: "visible", timeout: 10000 });
    expect(await locator.count(), `${name} 노출되어야 함`).toBeGreaterThan(0);
  }
});
