import type { Locator, Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;
  protected readonly browserName: string;

  constructor(page: Page, browserName?: string) {
    this.page = page;
    this.browserName = (browserName ?? "chromium").toLowerCase();
  }

  protected isChromium() {
    return this.browserName === "chromium";
  }

  protected async smartClick(locator: Locator, description: string) {
    try {
      await locator.click({ timeout: 2000 });
    } catch {
      throw new Error(`"${description}" 클릭 실패: 로케이터를 찾지 못했습니다.`);
    }
  }
}
