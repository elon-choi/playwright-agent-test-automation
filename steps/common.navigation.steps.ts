import { Given, expect } from "./fixtures.js";

Given("사용자가 {string} 사이트에 접속한다", async ({ page, loginPage }, url: string) => {
  await loginPage.goto(url);
  if (/\/content\/|\/landing\/series\//i.test(url)) {
    await expect(page).toHaveURL(/\/content\/|\/landing\/series\//i);
    return;
  }
  if (/page\.kakao\.com/i.test(url)) {
    await expect(page).toHaveURL(/page\.kakao\.com/i);
    return;
  }
  await expect(page).toHaveURL(url);
});
