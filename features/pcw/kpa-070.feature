Feature: KPA-070 시나리오 검증 (PCW)

  # PC Web에서는 더보기 레이어가 MW와 동일하지 않아 검증 불가. 스킵 처리.
  Scenario: 더보기 레이어 팝업 (PC Web 미지원)
    Given KPA-070은 PC Web에서 검증하지 않는다
