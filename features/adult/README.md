# 성인 전용 시나리오 (features/adult)

이 폴더에는 **성인 인증 계정**으로만 실행하는 feature 파일을 둡니다.

- 시나리오 추가 시 `features/adult/kpa-xxx.feature` 형태로 작성
- `playwright.config.ts`의 `defineBddConfig.features` 배열에 경로 추가 (예: `"features/adult/kpa-xxx.feature"`)
- steps는 `steps/` 아래에 기존처럼 `kpa-xxx.steps.ts` 또는 성인 전용 steps 파일 사용

실행 방법:
- 일반 시나리오만: `npm run test -- --project=chromium` (adult 제외)
- 성인 시나리오만: `npm run test -- --project=chromium-adult`
