import type { Locator, Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async smartClick(locator: Locator, description: string) {
    try {
      await locator.click({ timeout: 2000 });
    } catch {
      throw new Error(`"${description}" 클릭 실패: 로케이터를 찾지 못했습니다.`);
    }
  }
}
