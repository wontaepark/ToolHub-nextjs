'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Clock, Star, TrendingUp } from 'lucide-react';
import toolsData from '@/data/tools.json';

export default function SitemapPage() {
  // 도구들을 카테고리별로 분류
  const categorizedTools = toolsData.tools.reduce((acc, tool) => {
    const category = tool.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, typeof toolsData.tools>);

  // 카테고리 한국어 이름
  const categoryNames: Record<string, { name: string; icon: string; description: string }> = {
    productivity: {
      name: '생산성 도구',
      icon: '⚡',
      description: '업무와 학습 효율을 높이는 도구들'
    },
    entertainment: {
      name: '엔터테인먼트',
      icon: '🎮',
      description: '재미있고 흥미로운 테스트와 게임'
    },
    utility: {
      name: '유틸리티',
      icon: '🔧',
      description: '일상에서 유용한 계산과 변환 도구들'
    },
    media: {
      name: '미디어',
      icon: '📱',
      description: '이미지, 동영상 관련 도구들'
    }
  };

  // 정보 페이지들
  const infoPages = [
    {
      name: '홈페이지',
      href: '/',
      description: 'ToolHub.tools 메인 페이지'
    },
    {
      name: '문의하기',
      href: '/contact',
      description: '버그 신고, 기능 제안, 일반 문의'
    },
    {
      name: '개인정보처리방침',
      href: '/privacy',
      description: '개인정보 수집 및 이용에 관한 정책'
    },
    {
      name: '이용약관',
      href: '/terms',
      description: '서비스 이용 조건 및 규칙'
    },
    {
      name: '사이트맵',
      href: '/sitemap',
      description: '전체 페이지 구조 안내'
    }
  ];

  // 통계 데이터
  const stats = {
    totalTools: toolsData.tools.length,
    totalPages: toolsData.tools.length + infoPages.length,
    categories: Object.keys(categorizedTools).length,
    lastUpdated: '2025년 8월 9일'
  };

  return (
    <>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <Map className="w-8 h-8 mr-3 text-blue-600" />
              사이트맵
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              ToolHub.tools의 모든 도구와 페이지를 한눈에 확인하고 
              원하는 기능을 빠르게 찾아보세요.
            </p>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalTools}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">개 도구</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.categories}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">개 카테고리</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalPages}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">개 페이지</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold text-orange-600">최신 업데이트</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{stats.lastUpdated}</div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* 도구 카테고리별 목록 */}
            {Object.entries(categorizedTools).map(([category, categoryTools]) => {
              const categoryInfo = categoryNames[category];
              if (!categoryInfo) return null;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-2xl mr-3">{categoryInfo.icon}</span>
                      <div>
                        <div className="flex items-center space-x-3">
                          {categoryInfo.name}
                          <Badge variant="secondary">{categoryTools.length}개</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-normal mt-1">
                          {categoryInfo.description}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryTools.map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.id}`}
                          className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{tool.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {tool.name.ko}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {tool.description.ko}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                {tool.id === 'pomodoro' && (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    타이머
                                  </Badge>
                                )}
                                {(tool.id === 'mbti' || tool.id === 'teto-egen') && (
                                  <Badge variant="outline" className="text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    인기
                                  </Badge>
                                )}
                                {tool.id === 'unit-converter' && (
                                  <Badge variant="outline" className="text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    신규
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* 정보 페이지 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  <div>
                    <div className="flex items-center space-x-3">
                      정보 페이지
                      <Badge variant="secondary">{infoPages.length}개</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-normal mt-1">
                      서비스 이용과 관련된 중요한 정보들
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {infoPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          {page.name === '홈페이지' && '🏠'}
                          {page.name === '문의하기' && '📧'}
                          {page.name === '개인정보처리방침' && '🔒'}
                          {page.name === '이용약관' && '📋'}
                          {page.name === '사이트맵' && '🗺️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {page.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {page.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 도구 검색 도움말 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">💡</span>
                  도구 찾기 팁
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">카테고리별 찾기</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <li>• <strong>생산성:</strong> 업무, 학습, 시간 관리 도구</li>
                      <li>• <strong>유틸리티:</strong> 계산, 변환, 일상 도구</li>
                      <li>• <strong>엔터테인먼트:</strong> 게임, 테스트, 재미있는 도구</li>
                      <li>• <strong>미디어:</strong> 이미지, 동영상 관련 도구</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">인기 도구</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <li>• <strong>포모도로 타이머:</strong> 집중 시간 관리</li>
                      <li>• <strong>MBTI 테스트:</strong> 성격 유형 분석</li>
                      <li>• <strong>단위 변환기:</strong> 다양한 단위 변환</li>
                      <li>• <strong>비밀번호 생성기:</strong> 안전한 비밀번호 생성</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 업데이트 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🔄</span>
                  최신 업데이트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        Next.js 마이그레이션 완료
                      </h4>
                      <Badge variant="outline">2025.08.09</Badge>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      더 빠른 로딩 속도와 향상된 SEO를 위해 Next.js로 완전 마이그레이션하였습니다.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                        새로운 도구 추가
                      </h4>
                      <Badge variant="outline">2025.08.09</Badge>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      단위 변환기와 날짜 계산기가 새롭게 추가되었습니다.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                        UI/UX 개선
                      </h4>
                      <Badge variant="outline">2025.08.09</Badge>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      더 깔끔하고 직관적인 인터페이스로 사용자 경험을 개선했습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}