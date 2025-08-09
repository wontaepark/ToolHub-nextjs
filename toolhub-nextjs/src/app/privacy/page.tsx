'use client';

import React from 'react';
import { Seo } from '@/components/Seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Database, Cookie, Globe, Mail, Calendar } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = '2025년 8월 9일';

  return (
    <>
      <Seo 
        title="개인정보처리방침 | ToolHub.tools"
        description="ToolHub.tools의 개인정보 수집, 이용, 보호 정책에 대한 상세 안내"
        keywords="개인정보처리방침,프라이버시,데이터보호,개인정보보호"
        canonicalUrl="https://toolhub.tools/privacy"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              개인정보처리방침
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                최종 업데이트: {lastUpdated}
              </div>
              <Badge variant="outline">v2.0</Badge>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* 개요 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  개인정보처리방침 개요
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  ToolHub.tools(&apos;https://toolhub.tools&apos;, 이하 &apos;서비스&apos;)는 사용자의 개인정보를 중요하게 생각하며, 
                  「개인정보보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 
                  개인정보보호 관련 법령을 준수하고 있습니다.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">핵심 원칙</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• 개인정보를 최소한으로 수집합니다</li>
                    <li>• 수집된 정보는 명시된 목적으로만 사용합니다</li>
                    <li>• 사용자의 동의 없이 제3자에게 제공하지 않습니다</li>
                    <li>• 안전한 기술적 보호조치를 적용합니다</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 수집하지 않는 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Lock className="w-5 h-5 mr-2" />
                  수집하지 않는 개인정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 font-medium mb-3">
                    ToolHub.tools는 다음과 같은 개인정보를 수집하지 않습니다:
                  </p>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• 이름, 이메일 주소, 전화번호 등 개인 식별 정보</li>
                    <li>• 주민등록번호, 여권번호 등 민감한 개인정보</li>
                    <li>• 사용자 계정 정보 (회원가입 불필요)</li>
                    <li>• 결제 정보 (모든 서비스 무료 제공)</li>
                    <li>• 위치 정보 (GPS, IP 기반 위치 등)</li>
                    <li>• 연락처, 사진, 파일 등 디바이스 정보</li>
                  </ul>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  모든 도구는 클라이언트 사이드에서 작동하므로, 입력한 데이터는 서버로 전송되지 않습니다.
                </p>
              </CardContent>
            </Card>

            {/* 자동 수집 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  자동으로 수집되는 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">웹사이트 방문 정보</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                      <li>• 방문 페이지 URL</li>
                      <li>• 방문 시간 및 체류 시간</li>
                      <li>• 브라우저 종류 및 버전</li>
                      <li>• 운영체제 정보</li>
                      <li>• 화면 해상도</li>
                      <li>• 언어 설정</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">
                      * 이 정보는 Google Analytics를 통해 익명화되어 수집됩니다
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">로컬 스토리지 데이터</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                      <li>• 사용자 설정 (테마, 언어 등)</li>
                      <li>• 도구 사용 히스토리 (브라우저 내에만 저장)</li>
                      <li>• 즐겨찾기 도구 목록</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">
                      * 이 데이터는 사용자의 브라우저에만 저장되며 서버로 전송되지 않습니다
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 쿠키 및 추적 기술 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cookie className="w-5 h-5 mr-2" />
                  쿠키 및 추적 기술
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">필수 쿠키</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      웹사이트의 기본 기능을 위해 사용됩니다:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                      <li>• 테마 설정 (다크모드/라이트모드)</li>
                      <li>• 언어 설정</li>
                      <li>• 세션 유지</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">분석 쿠키 (Google Analytics)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      웹사이트 개선을 위한 익명 통계 수집:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                      <li>• 방문자 수 및 페이지 조회수</li>
                      <li>• 사용자 행동 패턴 분석</li>
                      <li>• 인기 도구 및 기능 파악</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">광고 쿠키 (Google AdSense)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      관련성 높은 광고 제공을 위해 사용:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                      <li>• 개인화된 광고 표시</li>
                      <li>• 광고 효과 측정</li>
                      <li>• 중복 광고 방지</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">쿠키 설정 관리</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    브라우저 설정에서 쿠키를 비활성화할 수 있습니다. 
                    단, 일부 기능(테마 설정, 언어 설정 등)이 제한될 수 있습니다.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 정보 이용 목적 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  정보 이용 목적
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">서비스 제공</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• 웹사이트 기본 기능 제공</li>
                      <li>• 사용자 설정 저장</li>
                      <li>• 다국어 지원</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">서비스 개선</h4>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>• 웹사이트 성능 최적화</li>
                      <li>• 새로운 도구 개발</li>
                      <li>• 사용자 경험 향상</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">보안 유지</h4>
                    <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                      <li>• 악성 활동 탐지</li>
                      <li>• 시스템 보안 강화</li>
                      <li>• 오류 및 버그 수정</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">광고 서비스</h4>
                    <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                      <li>• 적절한 광고 표시</li>
                      <li>• 광고 효과 분석</li>
                      <li>• 무료 서비스 지속 제공</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 제3자 제공 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  제3자 정보 제공
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-900 dark:text-red-100">기본 원칙</h4>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    ToolHub.tools는 사용자의 개인정보를 제3자에게 제공하지 않습니다.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">예외 상황</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    다음의 경우에만 제한적으로 정보가 제공될 수 있습니다:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 법령에 의한 요구가 있는 경우</li>
                    <li>• 수사기관의 수사목적으로 법령에 정해진 절차와 방법에 따라 요구가 있는 경우</li>
                    <li>• 사용자의 생명이나 안전에 급박한 위험이 확인되어 이를 해소하기 위한 경우</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">서비스 제공업체</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    서비스 운영을 위해 다음 업체의 서비스를 이용합니다:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• Google Analytics (웹사이트 분석) - Google LLC</li>
                    <li>• Google AdSense (광고 서비스) - Google LLC</li>
                    <li>• Replit (웹사이트 호스팅) - Replit Inc.</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    * 각 업체는 자체 개인정보처리방침에 따라 데이터를 처리합니다
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 보유 및 이용기간 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  정보 보유 및 이용기간
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-semibold mb-1">웹사이트 분석 데이터</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Google Analytics: 26개월 (Google 정책에 따름)
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                    <h4 className="font-semibold mb-1">로컬 스토리지 데이터</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      사용자가 직접 삭제하기 전까지 브라우저에 보존
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                    <h4 className="font-semibold mb-1">쿠키 데이터</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      쿠키별 만료 기간에 따라 자동 삭제 (최대 2년)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 사용자 권리 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  사용자의 권리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">열람 권리</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      처리되고 있는 개인정보에 대한 열람을 요구할 권리
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">정정·삭제 권리</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      개인정보의 정정이나 삭제를 요구할 권리
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">처리정지 권리</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      개인정보 처리 정지를 요구할 권리
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">손해배상 권리</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      개인정보 침해로 인한 피해 구제를 요구할 권리
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">권리 행사 방법</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    아래 연락처로 요청하시면 지체 없이 조치하겠습니다:
                  </p>
                  <div className="flex items-center text-sm text-blue-800 dark:text-blue-200">
                    <Mail className="w-4 h-4 mr-2" />
                    contact@toolhub.tools
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 연락처 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  개인정보 관련 문의
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">개인정보보호책임자</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>• 이메일: privacy@toolhub.tools</p>
                    <p>• 처리현황 신고: contact@toolhub.tools</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">개인정보 침해신고센터</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>• 웹사이트: privacy.go.kr</p>
                    <p>• 전화: 국번없이 182</p>
                    <p>• 주소: (03171) 서울특별시 종로구 세종대로 209 정부서울청사 4층</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">개인정보 분쟁조정위원회</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>• 웹사이트: privacy.go.kr</p>
                    <p>• 전화: 국번없이 1833-6972</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 방침 변경 */}
            <Card>
              <CardHeader>
                <CardTitle>개인정보처리방침 변경</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
                  변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>• 시행일자: 2025년 8월 9일</p>
                    <p>• 이전 버전: 2025년 1월 24일 ~ 2025년 8월 8일</p>
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