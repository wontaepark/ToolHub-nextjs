'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AdBanner } from './AdBanner';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export default function Layout({ 
  children, 
  title = "ToolHub.tools - 무료 웹 도구 모음",
  description = "포모도로 타이머, MBTI 테스트, 테토-에겐 테스트 등 일상과 업무에 필요한 웹 도구를 한 곳에 모은 무료 서비스입니다.",
  keywords = "웹 도구, 포모도로 타이머, MBTI 테스트, 테토-에겐 테스트, 무료 유틸리티, 온라인 도구",
  ogImage = "https://toolhub.tools/og-image.png"
}: LayoutProps) {
  return (
    <>
      <Head>
        {/* 기본 메타 태그 */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Toolhub Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="WgkXO34MHVi2ZTxj0Xw9L8x9ufgY3Y09rTGUXv6lt10" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://toolhub.tools" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        

      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* 헤더 */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  🛠️ ToolHub.tools
                </h1>
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  홈
                </Link>
                <Link href="/sitemap" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  사이트맵
                </Link>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  문의하기
                </Link>
                <div className="ml-4">
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1">
          {children}
        </main>

        {/* 광고 배너 */}
        <AdBanner />

        {/* 푸터 */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* 사이트 정보 */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  ToolHub.tools
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  일상과 업무에 필요한 다양한 웹 도구를 한 곳에서 무료로 제공합니다.
                  포모도로 타이머, 성격 테스트, 유틸리티 도구 등을 쉽고 빠르게 사용해보세요.
                </p>
              </div>

              {/* 인기 도구 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  인기 도구
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/tools/pomodoro" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      포모도로 타이머
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools/mbti" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      MBTI 테스트
                    </Link>
                  </li>
                  <li>
                    <Link href="/tools/teto-egen" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      테토-에겐 테스트
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 링크 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  더 보기
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      개인정보처리방침
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      이용약관
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      문의하기
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                © 2025 ToolHub.tools. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}