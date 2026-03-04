import type { Locator, Page } from "@playwright/test";

type AiOptions = Record<string, unknown>;
type AiFn = (prompt: string, options?: AiOptions) => Promise<unknown>;

export class BasePage {
  protected readonly page: Page;
  protected readonly ai: AiFn;
  protected readonly browserName: string;

  constructor(page: Page, ai: AiFn, browserName?: string) {
    this.page = page;
    this.ai = ai;
    this.browserName = (browserName ?? "chromium").toLowerCase();
  }

  protected isChromium() {
    return this.browserName === "chromium";
  }

  protected isAiEnabled() {
    if (!this.isChromium()) {
      return false;
    }
    if (process.env.ENABLE_ZEROSTEP_AI === "false") {
      return false;
    }
    return Boolean(process.env.ZEROSTEP_TOKEN);
  }

  /**
   * Zerostep AI 실행. 실패 시 null 반환.
   * - "No valid target found" (TaskId 포함): AI가 프롬프트에 맞는 클릭/입력 대상을 찾지 못함.
   *   (예: KPA-002에서 프로필 아이콘 미노출, 로그인 버튼 셀렉터 변경 등)
   */
  protected async safeAi(prompt: string, options?: AiOptions) {
    if (!this.isAiEnabled()) {
      console.warn(`[Skipped AI] "${prompt}" is skipped on ${this.browserName}.`);
      return null;
    }
    try {
      return await this.ai(prompt, options);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/No valid target found|zerostep\.error/i.test(msg)) {
        return null;
      }
      throw e;
    }
  }

  protected async smartClick(locator: Locator, description: string) {
    try {
      await locator.click({ timeout: 2000 });
    } catch (error) {
      if (this.isAiEnabled()) {
        await this.ai(`${description} 클릭해줘`);
        return;
      }
      throw new Error(
        `"${description}" 클릭 실패: WebKit/Firefox에서는 AI fallback을 사용할 수 없습니다.`
      );
    }
  }
}
