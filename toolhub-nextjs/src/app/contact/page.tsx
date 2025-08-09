'use client';

import React, { useState } from 'react';
import { Seo } from '@/components/Seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Send, Github, CheckCircle, AlertCircle, Globe } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const categories = [
    { value: 'bug', label: '버그 신고', icon: '🐛' },
    { value: 'feature', label: '기능 제안', icon: '💡' },
    { value: 'support', label: '사용 문의', icon: '❓' },
    { value: 'business', label: '비즈니스 문의', icon: '💼' },
    { value: 'other', label: '기타', icon: '📝' }
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.category || !form.subject || !form.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 실제 서비스에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setForm({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: ''
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    return category ? category.icon : '📝';
  };

  return (
    <>
      <Seo 
        title="문의하기 | ToolHub.tools"
        description="ToolHub.tools에 대한 문의, 버그 신고, 기능 제안을 보내주세요"
        keywords="문의하기,고객지원,버그신고,기능제안,연락처"
        canonicalUrl="https://toolhub.tools/contact"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              문의하기
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              ToolHub.tools에 대한 문의사항, 버그 신고, 기능 제안 등을 보내주세요. 
              빠른 시간 내에 답변드리겠습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 연락처 정보 */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    연락처 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">이메일</div>
                      <div className="text-sm text-gray-600">contact@toolhub.tools</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5 text-gray-900 dark:text-white" />
                    <div>
                      <div className="font-semibold">GitHub</div>
                      <div className="text-sm text-gray-600">
                        <a 
                          href="https://github.com/toolhub-tools" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          github.com/toolhub-tools
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold">웹사이트</div>
                      <div className="text-sm text-gray-600">
                        <a 
                          href="https://toolhub.tools" 
                          className="text-blue-600 hover:underline"
                        >
                          toolhub.tools
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 문의 카테고리 안내 */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>문의 카테고리</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.value} className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-sm text-gray-600">
                            {category.value === 'bug' && '오류나 버그를 발견했을 때'}
                            {category.value === 'feature' && '새로운 기능을 제안하고 싶을 때'}
                            {category.value === 'support' && '도구 사용법이나 기능에 대한 질문'}
                            {category.value === 'business' && '광고, 제휴, 협업 관련 문의'}
                            {category.value === 'other' && '기타 문의사항'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 문의 양식 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    문의 양식
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 dark:text-green-200">
                          문의가 성공적으로 전송되었습니다. 빠른 시간 내에 답변드리겠습니다.
                        </span>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-red-800 dark:text-red-200">
                          전송 중 오류가 발생했습니다. 모든 필드를 올바르게 입력했는지 확인해주세요.
                        </span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">이름 *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={form.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="홍길동"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">이메일 *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="example@email.com"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">문의 카테고리 *</Label>
                      <Select value={form.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="문의 카테고리를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center space-x-2">
                                <span>{category.icon}</span>
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">제목 *</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={form.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder={form.category ? `${getCategoryIcon(form.category)} 제목을 입력해주세요` : '제목을 입력해주세요'}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">내용 *</Label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="문의 내용을 자세히 작성해주세요. 버그 신고의 경우 재현 방법을 포함해주시면 도움이 됩니다."
                        required
                        rows={8}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="text-red-500">*</span> 필수 입력 항목
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            전송 중...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            문의 보내기
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>자주 묻는 질문</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">Q. 모든 도구가 무료인가요?</h4>
                      <p className="text-sm text-gray-600">네, ToolHub.tools의 모든 도구는 완전 무료로 제공됩니다.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Q. 개인정보는 어떻게 보호되나요?</h4>
                      <p className="text-sm text-gray-600">저희는 사용자의 개인정보를 수집하지 않으며, 모든 계산은 브라우저에서 이루어집니다.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Q. 새로운 도구 추가 요청은 어떻게 하나요?</h4>
                      <p className="text-sm text-gray-600">&apos;기능 제안&apos; 카테고리로 문의해주시면 검토 후 추가를 고려해드립니다.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Q. 모바일에서도 사용할 수 있나요?</h4>
                      <p className="text-sm text-gray-600">네, 모든 도구는 모바일 친화적으로 설계되어 스마트폰과 태블릿에서도 완벽하게 작동합니다.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}