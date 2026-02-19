// Feature: KPA-008 시나리오 검증
// Scenario: 비로그인 상태에서 프로필 아이콘 클릭 시 로그인 페이지로 이동
import { When, Then, expect } from "./fixtures.js";

When("사용자가 우측 상단의 프로필 아이콘을 클릭한다", async ({ ai }) => {
  await ai("우측 상단의 프로필 아이콘을 클릭한다");
});

Then(
  "로그인 페이지의 URL이 {string}인지 확인한다",
  async ({ page }, expectedUrl: string) => {
    await expect(page).toHaveURL(new RegExp(expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
);
