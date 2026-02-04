import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type Target = {
  name: string;
  url: string;
  waitForSelector?: string;
};

const TARGET_URLS: Target[] = [
  { name: "home", url: "https://page.kakao.com/" },
  { name: "login", url: "https://page.kakao.com/login" },
  {
    name: "kakao-account-login",
    url: "https://accounts.kakao.com/login?continue=https%3A%2F%2Fpage.kakao.com%2F",
    waitForSelector: "input"
  }
];

const OUTPUT_DIR = path.resolve(process.cwd(), "dom_dumps");

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const target of TARGET_URLS) {
    await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (target.waitForSelector) {
      await page.waitForSelector(target.waitForSelector, { timeout: 15000 });
    }

    const html = await page.evaluate(() => {
      const root = document.documentElement.cloneNode(true) as HTMLElement;
      root.querySelectorAll("script, style, svg, noscript, template").forEach((el) => {
        el.remove();
      });
      return root.innerHTML;
    });

    const outputPath = path.join(OUTPUT_DIR, `${target.name}.html`);
    await writeFile(outputPath, html, "utf-8");
  }

  await browser.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
