# ToolHub.tools

## Project Overview
ToolHub.tools는 다양한 유용한 도구들을 모아놓은 웹 애플리케이션 허브입니다. React와 TypeScript를 활용하여 구현되었으며, 계산기, 포모도로 타이머, 범위 타이머, 번호 추첨기, 유튜브 썸네일 다운로더, 비밀번호 생성기, 단위 변환기, 날짜 계산기, 고급 날씨 정보 페이지, 10가지 스타일 선택이 가능한 MBTI 성격유형 테스트, 그리고 화제의 테토-에겐 성격유형 테스트를 포함합니다. 완전한 다국어 지원(한국어, 영어, 일본어)과 실시간 기상 데이터로 국제적인 사용자 경험을 제공하며, Google AdSense 광고를 통해 수익화되는 실제 서비스로 운영됩니다.

## User Preferences
- 수익화 중심의 바이럴 콘텐츠 개발 선호
- 한국 Gen Z/밀레니얼 타겟 콘텐츠 집중
- 테토-에겐 밈 기반 성격테스트로 트래픽 유입 전략
- 소셜 공유 기능과 궁합 분석을 통한 바이럴 확산 추구

## Project Architecture
- Frontend: React + TypeScript + Vite
- UI Framework: Tailwind CSS + shadcn/ui components
- Routing: Wouter (lightweight routing)
- State Management: React hooks + React Query
- Backend: Express.js + TypeScript
- Internationalization: react-i18next (Korean, English, Japanese)
- Styling: Dark/Light theme support with ThemeProvider

### Key Features Added (2025-01-24)
- 테토-에겐 성격유형 테스트 (/teto-egen-test)
  - 성별 선택 → 10개 질문 → 4가지 결과 (테토남/테토녀/에겐남/에겐녀)
  - 바이럴 요소: 소셜 공유, 희귀도 표시, 궁합 분석
  - 수익화 Hook: 결과 페이지 최적화, 재테스트 유도
- MBTI 테스트 스코어링 개선으로 신뢰성 향상

## Recent Changes
- 테토-에겐 성격유형 테스트 신규 추가 (2025-01-24)
  - 10개 질문으로 구성된 테토/에겐 분류 시스템
  - 성별별 4가지 결과 유형 (테토남/테토녀/에겐남/에겐녀)
  - 소셜 공유 기능, 궁합 분석, 연애 성향 분석 포함
  - 바이럴 확산을 위한 "친구들은 어떤 유형일까?" 훅 구현
- MBTI 테스트 스코어링 알고리즘 개선으로 다양한 결과 도출
- 16가지 모든 MBTI 성격유형 데이터 완성 및 신뢰성 향상

## Monetization Strategy
- Google AdSense 광고 배치 (결과 페이지 하단)
- 소셜 공유를 통한 트래픽 확산
- 이메일 수집을 통한 리타겟팅 가능성
- 궁합 분석 기반 추천 콘텐츠 연결

## Development Notes
- 모든 새로운 페이지는 SEO 최적화된 메타데이터 포함
- 바이럴 요소 (공유 텍스트, 희귀도, 궁합) 강조
- 모바일 친화적 UI/UX 우선 설계
- 빠른 로딩과 즉시 결과 제공으로 이탈률 최소화