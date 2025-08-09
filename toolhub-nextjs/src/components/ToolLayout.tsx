'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { AdBannerInline } from './AdBanner';

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  category?: string;
  relatedTools?: Array<{
    id: string;
    name: string;
    emoji: string;
    href: string;
  }>;
}

export default function ToolLayout({ 
  children, 
  title, 
  description,
  category,
  relatedTools = []
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 브레드크럼 네비게이션 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              href="/" 
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              홈
            </Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            {category && (
              <>
                <span className="text-gray-500 dark:text-gray-400 capitalize">
                  {category}
                </span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
              </>
            )}
            <span className="text-gray-900 dark:text-white font-medium">
              {title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 도구 헤더 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  도구 목록으로 돌아가기
                </Link>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h1>
              
              {description && (
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>

            {/* 도구 콘텐츠 */}
            <div className="space-y-8">
              {children}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* 광고 */}
              <AdBannerInline />

              {/* 관련 도구 */}
              {relatedTools.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    관련 도구
                  </h3>
                  <div className="space-y-3">
                    {relatedTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors group"
                      >
                        <span className="text-2xl mr-3">{tool.emoji}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {tool.name}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 도움말 */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  💡 도움이 필요하신가요?
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                  도구 사용 중 문제가 발생하거나 개선 아이디어가 있으시면 언제든 문의해주세요.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
                >
                  문의하기 →
                </Link>
              </div>

              {/* 더 많은 도구 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🛠️ 더 많은 도구
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  ToolHub.tools에는 다양한 유용한 도구들이 준비되어 있습니다.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
                >
                  전체 도구 보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}