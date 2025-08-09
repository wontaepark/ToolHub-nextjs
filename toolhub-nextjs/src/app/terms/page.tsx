'use client';

import React from 'react';
import { Seo } from '@/components/Seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Shield, AlertTriangle, Scale, Globe, Mail, Calendar } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = '2025년 8월 9일';

  return (
    <>
      <Seo 
        title="이용약관 | ToolHub.tools"
        description="ToolHub.tools 서비스 이용약관 및 사용자 권리와 의무에 대한 안내"
        keywords="이용약관,서비스약관,사용조건,이용규칙"
        canonicalUrl="https://toolhub.tools/terms"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              서비스 이용약관
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
            {/* 제1조 목적 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-5 h-5 mr-2" />
                  제1조 (목적)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  이 약관은 ToolHub.tools(이하 &quot;서비스&quot;)가 제공하는 온라인 도구 서비스의 이용조건 및 절차, 
                  서비스와 이용자 간의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">서비스 개요</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• 웹 기반 무료 유틸리티 도구 제공</li>
                    <li>• 포모도로 타이머, MBTI 테스트, 단위 변환기 등</li>
                    <li>• 회원가입 없이 즉시 이용 가능</li>
                    <li>• 모든 기능 완전 무료 제공</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 제2조 정의 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  제2조 (정의)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-semibold mb-1">&quot;서비스&quot;</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ToolHub.tools가 제공하는 웹사이트(https://toolhub.tools) 및 관련 응용프로그램을 의미합니다.
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                    <h4 className="font-semibold mb-1">&quot;이용자&quot;</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      이 약관에 따라 서비스를 이용하는 개인 또는 법인을 의미합니다.
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                    <h4 className="font-semibold mb-1">&quot;콘텐츠&quot;</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      서비스 내에서 제공되는 모든 정보, 텍스트, 이미지, 동영상, 소프트웨어 등을 의미합니다.
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                    <h4 className="font-semibold mb-1">&quot;개인정보&quot;</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      이용자를 식별할 수 있는 정보를 의미하며, 본 서비스는 개인정보를 수집하지 않습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 제3조 서비스 제공 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  제3조 (서비스의 제공)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 제공 서비스</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h5 className="font-medium mb-1">생산성 도구</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• 포모도로 타이머</li>
                        <li>• 범용 타이머</li>
                        <li>• 번호 추첨기</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h5 className="font-medium mb-1">유틸리티 도구</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• 단위 변환기</li>
                        <li>• 날짜 계산기</li>
                        <li>• 비밀번호 생성기</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h5 className="font-medium mb-1">엔터테인먼트</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• MBTI 성격유형 테스트</li>
                        <li>• 테토-에겐 성격유형 테스트</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h5 className="font-medium mb-1">미디어 도구</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• 유튜브 썸네일 다운로더</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. 서비스 특징</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 24시간 연중무휴 서비스 제공 (점검 시간 제외)</li>
                    <li>• 회원가입 없이 즉시 이용 가능</li>
                    <li>• 모든 기능 완전 무료 제공</li>
                    <li>• 개인정보 수집 없음</li>
                    <li>• 다국어 지원 (한국어, 영어, 일본어)</li>
                    <li>• 모바일 및 데스크톱 지원</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 제4조 서비스 이용 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  제4조 (서비스 이용)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 이용 조건</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 본 약관에 동의한 누구나 자유롭게 이용 가능</li>
                    <li>• 회원가입이나 개인정보 제공 불필요</li>
                    <li>• 인터넷에 연결된 기기에서 웹브라우저를 통해 접속</li>
                    <li>• 서비스는 현재 상태(&quot;as-is&quot;)로 제공됨</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. 이용 제한</h4>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200 mb-2 font-medium">
                      다음 행위는 금지됩니다:
                    </p>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• 서비스의 안정적 운영을 방해하는 행위</li>
                      <li>• 과도한 서버 요청이나 자동화된 접속</li>
                      <li>• 서비스 코드의 무단 복제, 수정, 배포</li>
                      <li>• 타인의 권리를 침해하는 행위</li>
                      <li>• 불법적이거나 부적절한 목적으로의 이용</li>
                      <li>• 서비스 내 광고나 스팸 게시</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 제5조 저작권 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  제5조 (저작권 및 지적재산권)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 서비스 저작권</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 서비스 내 모든 콘텐츠의 저작권은 ToolHub.tools에 귀속</li>
                    <li>• 이용자는 개인적, 비상업적 목적으로만 서비스 이용 가능</li>
                    <li>• 서비스의 전부 또는 일부를 무단으로 복제, 전송, 배포할 수 없음</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. 이용자 생성 콘텐츠</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 서비스 이용 시 생성되는 데이터는 이용자에게 귀속</li>
                    <li>• 개인정보를 포함하지 않는 익명 사용 통계는 서비스 개선에 활용</li>
                    <li>• 이용자가 입력한 데이터는 서버에 저장되지 않음</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. 제3자 콘텐츠</h4>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      유튜브 썸네일 다운로더 등을 통해 접근하는 제3자 콘텐츠의 저작권은 
                      해당 콘텐츠의 원 저작권자에게 있으며, 이용자는 관련 법률과 
                      원 저작권자의 이용약관을 준수해야 합니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 제6조 책임 제한 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  제6조 (책임의 제한)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 서비스 제공자의 책임 제한</h4>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                      <li>• 서비스는 현재 상태로 제공되며, 완전성이나 정확성을 보장하지 않음</li>
                      <li>• 서비스 이용으로 인한 직간접적 손해에 대해 책임지지 않음</li>
                      <li>• 천재지변, 서버 장애 등 불가항력적 사유로 인한 서비스 중단 시 책임 제한</li>
                      <li>• 무료 서비스 특성상 가용성이나 지속성을 보장하지 않음</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. 이용자의 책임</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 서비스 이용에 따른 모든 책임은 이용자 본인에게 있음</li>
                    <li>• 중요한 데이터는 별도로 백업하여 보관할 것</li>
                    <li>• 서비스 결과를 맹신하지 말고 참고용으로만 활용</li>
                    <li>• 제3자의 권리를 침해하지 않도록 주의</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. 손해 배상</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    이용자가 본 약관을 위반하여 서비스에 손해를 입힌 경우, 
                    해당 이용자는 그에 대한 모든 손해를 배상할 책임이 있습니다.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 제7조 서비스 변경 및 중단 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  제7조 (서비스의 변경 및 중단)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 서비스 변경</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 서비스 개선을 위해 기능을 추가, 변경, 삭제할 수 있음</li>
                    <li>• 중요한 변경사항은 사전에 공지함</li>
                    <li>• 이용자가 변경에 동의하지 않을 경우 서비스 이용을 중단할 수 있음</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. 서비스 중단</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 정기 점검, 서버 교체, 시스템 업그레이드 등을 위한 일시 중단</li>
                    <li>• 천재지변, 정전, 서버 장애 등 불가항력적 사유로 인한 중단</li>
                    <li>• 운영상의 이유로 서비스를 종료할 경우 30일 전 공지</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 제8조 광고 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  제8조 (광고 게재)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 광고 게재</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 무료 서비스 제공을 위해 Google AdSense 등의 광고를 게재</li>
                    <li>• 광고는 서비스 이용에 방해가 되지 않는 범위에서 게재</li>
                    <li>• 부적절한 광고를 발견할 경우 즉시 신고해 주시기 바람</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. 광고 책임</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      게재된 광고의 내용이나 광고주와의 거래에서 발생하는 문제에 대해서는 
                      서비스 제공자가 책임지지 않습니다. 광고를 통한 거래는 이용자 본인의 
                      판단과 책임 하에 이루어져야 합니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 제9조 준거법 및 관할 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-5 h-5 mr-2" />
                  제9조 (준거법 및 관할법원)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 준거법</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    본 약관 및 서비스 이용과 관련된 제반 사항은 대한민국 법령에 따라 규율됩니다.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. 관할법원</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    서비스 이용과 관련하여 분쟁이 발생할 경우, 서비스 제공자의 주소지를 
                    관할하는 법원을 전속관할법원으로 합니다.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. 분쟁 해결</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 분쟁 발생 시 우선적으로 상호 협의를 통한 해결 노력</li>
                    <li>• 협의가 어려운 경우 관련 법령에 따른 조정 및 중재 절차 활용</li>
                    <li>• 최종적으로 법원의 판단에 따름</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 연락처 및 기타 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  제10조 (기타)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. 문의 및 신고</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      서비스 이용 관련 문의사항이나 신고사항은 다음 연락처로 문의해 주시기 바랍니다:
                    </p>
                    <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <p>• 이메일: contact@toolhub.tools</p>
                      <p>• 웹사이트: https://toolhub.tools/contact</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. 약관의 효력</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• 본 약관의 일부가 무효가 되어도 나머지 조항은 유효함</li>
                    <li>• 약관에 명시되지 않은 사항은 관련 법령에 따름</li>
                    <li>• 약관 변경 시 7일 전 공지하며, 계속 이용 시 동의한 것으로 간주</li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-semibold mb-1">공고일자 및 시행일자</p>
                    <p>• 공고일자: 2025년 8월 2일</p>
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