# ToolHub.tools

## Overview
ToolHub.tools is a web application hub offering a collection of useful tools, built with React and TypeScript. It includes a Pomodoro Timer, Range Timer, Number Raffler, YouTube Thumbnail Downloader, Password Generator, Unit Converter, Date Calculator, advanced weather page, an MBTI personality test with 10 style options, and the viral Teto-Egen personality test. The platform provides full multilingual support (Korean, English, Japanese) and real-time weather data for a global user experience. It operates as a live service monetized through Google AdSense. The project aims to develop viral content, particularly targeting Korean Gen Z/millennials, utilizing memes like the Teto-Egen test to drive traffic and foster virality through social sharing and compatibility analysis features.

## User Preferences
- 수익화 중심의 바이럴 콘텐츠 개발 선호
- 한국 Gen Z/밀레니얼 타겟 콘텐츠 집중
- 테토-에겐 밈 기반 성격테스트로 트래픽 유입 전략
- 소셜 공유 기능과 궁합 분석을 통한 바이럴 확산 추구

## System Architecture
- Frontend: React + TypeScript + Vite
- UI Framework: Tailwind CSS + shadcn/ui components
- Routing: Wouter (lightweight routing)
- State Management: React hooks + React Query
- Backend: Express.js + TypeScript
- SSR: Custom hybrid rendering (Bot detection + Static HTML generation)
- Internationalization: react-i18next (Korean, English, Japanese) with middleware-based automatic language detection and `[locale]` routing.
- Styling: Dark/Light theme support with ThemeProvider and a custom ThemeToggle component.
- Core Features: Teto-Egen personality test with gender selection, 10 questions, and 4 results (Teto-Male/Female, Egen-Male/Female), including viral elements like social sharing, rarity display, and compatibility analysis. MBTI test scoring has been improved for reliability, supporting all 16 types.
- System Design: Implemented a hybrid SSR system that serves full HTML to crawler bots (e.g., Google AdSense) and a React app to regular users. Features optimized internal linking with related tools, breadcrumbs, and footer links. AdSense optimization includes controlling SSR based on environment and detailed robots.txt configuration for AdSense bots.
- UI/UX Decisions: Clean UI by removing "Coming Soon" sections, improved CTA buttons with scroll functionality, added social proof section, and full multilingual support for UI elements and content. Console logs are removed for production build.

## External Dependencies
- Google AdSense: For monetization through ad placement, specifically targeting results pages.
- next-intl: Used for i18n system providing Korean, English, and Japanese language support (though the project has recently simplified to a basic theme system for build stability, the i18n infrastructure remains a core part of its design).
- Express.js: Backend server.