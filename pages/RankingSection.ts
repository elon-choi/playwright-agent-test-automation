import type { Locator, Page } from "@playwright/test";

/**
 * 실시간 랭킹 영역 로케이터 및 1위 작품 링크 해석.
 * DOM 변경 시 이 파일만 수정하면 된다.
 */
const RANK_ONE_BADGE_SELECTOR = 'div[class*="font-small2-bold"]';
const RANK_ONE_TEXT = /^1$/;

/**
 * "기준" 텍스트(예: 26.02.24 00:00 기준)가 보일 때까지 대기한 뒤
 * 랭킹 영역 Locator를 반환한다. 실시간 랭킹 화면이 로드되기 전에 호출하면 대기한다.
 */
export async function waitForRankingArea(page: Page): Promise<Locator> {
  await page.getByText(/기준/i).first().waitFor({ state: "visible", timeout: 15000 });
  return getRankingArea(page);
}

/**
 * "기준" 텍스트가 있는 노드의 조상 중 /content/ 링크를 포함하는
 * 가장 가까운 요소를 랭킹 영역으로 사용한다. (실시간 랭킹 블록)
 */
export function getRankingArea(page: Page): Locator {
  const criteriaText = page.getByText(/기준/i).first();
  return criteriaText.locator("xpath=ancestor::*[.//a[contains(@href,\"/content/\")]][1]");
}

/**
 * 실시간 랭킹 1위 뱃지가 있는 행에서 작품 링크 Locator를 반환한다.
 * 1위 뱃지 또는 해당 행의 링크를 찾지 못하면 예외를 던진다.
 */
export async function getRankOneWorkLinkLocator(page: Page): Promise<Locator> {
  const rankingArea = await waitForRankingArea(page);
  const rankOneBadge = rankingArea.locator(RANK_ONE_BADGE_SELECTOR).filter({ hasText: RANK_ONE_TEXT }).first();
  await rankOneBadge.waitFor({ state: "visible", timeout: 15000 });

  const firstRankHref = await rankOneBadge.evaluate((el: Element) => {
    const selector = 'a[href*="/content/"]';
    let p: Element | null = el.parentElement;
    while (p) {
      const a = p.querySelector(selector);
      if (a) return (a as HTMLAnchorElement).href;
      p = p.parentElement;
    }
    return null;
  });

  if (!firstRankHref) {
    throw new Error("KPA-060: 실시간 랭킹 1위 뱃지 영역에서 작품 링크를 찾지 못했습니다. DOM 구조를 확인하세요.");
  }

  const pathname = new URL(firstRankHref).pathname;
  return rankingArea.locator(`a[href*="${pathname}"]`).first();
}
