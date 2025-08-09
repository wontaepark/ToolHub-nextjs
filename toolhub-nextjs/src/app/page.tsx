'use client';

import { Seo, SeoPresets } from '@/components/Seo';
import { AdBannerInline } from '@/components/AdBanner';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Seo {...SeoPresets.home} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 히어로 섹션 */}
        <div className="text-center py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ToolHub.tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            일상과 업무에 필요한 다양한 웹 도구를 한 곳에서 무료로 제공합니다.
            포모도로 타이머, 성격 테스트, 유틸리티 도구 등을 쉽고 빠르게 사용해보세요.
          </p>
          <button
            onClick={() => {
              const toolsSection = document.getElementById('tools-section');
              toolsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            지금 바로 인기 도구 사용하기
          </button>
        </div>

        {/* 광고 */}
        <AdBannerInline />

        {/* 주요 도구 섹션 */}
        <section id="tools-section" className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            인기 도구
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 포모도로 타이머 */}
            <Link href="/tools/pomodoro" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="text-4xl mb-4">🍅</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  포모도로 타이머
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  25분 집중 + 5분 휴식으로 생산성을 높이는 시간 관리 도구
                </p>
                <div className="text-blue-600 dark:text-blue-400 font-medium">
                  바로 시작하기 →
                </div>
              </div>
            </Link>

            {/* MBTI 테스트 */}
            <Link href="/tools/mbti" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  MBTI 성격유형 테스트
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  16가지 성격유형 중 나는 어떤 타입일까요? 정확한 테스트로 알아보세요
                </p>
                <div className="text-blue-600 dark:text-blue-400 font-medium">
                  테스트 시작하기 →
                </div>
              </div>
            </Link>

            {/* 테토-에겐 테스트 */}
            <Link href="/tools/teto-egen" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  테토-에겐 성격유형 테스트
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  화제의 테토-에겐 테스트! 나는 테토? 아니면 에겐?
                </p>
                <div className="text-blue-600 dark:text-blue-400 font-medium">
                  궁금해요 →
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 사회적 증거 섹션 */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              많은 사용자들이 선택한 ToolHub
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  10,000+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  월 활성 사용자
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  50,000+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  월 사용 횟수
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  98%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  사용자 만족도
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 사이트 소개 섹션 */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
              ToolHub.tools가 특별한 이유
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🚀 빠르고 간편하게
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  복잡한 설치나 가입 없이 브라우저에서 바로 사용할 수 있습니다. 
                  모든 도구는 직관적이고 사용하기 쉽게 설계되었습니다.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  💯 완전 무료
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  모든 도구를 무료로 제공합니다. 숨겨진 비용이나 제한 없이 
                  언제든지 자유롭게 사용하세요.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📱 모든 기기에서
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  PC, 스마트폰, 태블릿 등 어떤 기기에서든 완벽하게 작동합니다. 
                  반응형 디자인으로 최적의 사용 경험을 제공합니다.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🔄 지속적인 업데이트
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  사용자 피드백을 바탕으로 기존 도구를 개선하고 
                  새로운 유용한 도구들을 계속 추가하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}