'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Seo } from '@/components/Seo';
import { AdBannerInline } from '@/components/AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Youtube, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { getRelatedTools } from '@/lib/tools';

interface ThumbnailData {
  videoId: string;
  title: string;
  thumbnails: {
    quality: string;
    url: string;
    width: number;
    height: number;
  }[];
}

export default function ThumbnailDownloaderPage() {
  const [url, setUrl] = useState('');
  const [thumbnailData, setThumbnailData] = useState<ThumbnailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  // 관련 도구 가져오기
  const relatedTools = getRelatedTools('thumbnail-downloader').map(tool => ({
    id: tool.id,
    name: tool.name.ko,
    emoji: tool.emoji,
    href: `/tools/${tool.id}`
  }));

  // YouTube URL에서 비디오 ID 추출
  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // YouTube URL 유효성 검사
  // const isValidYouTubeUrl = (url: string): boolean => {
  //   return extractVideoId(url) !== null;
  // };

  // 썸네일 데이터 생성
  const generateThumbnailData = (videoId: string): ThumbnailData => {
    const baseUrl = `https://img.youtube.com/vi/${videoId}`;
    
    return {
      videoId,
      title: `YouTube Video ${videoId}`,
      thumbnails: [
        {
          quality: 'Maximum Quality',
          url: `${baseUrl}/maxresdefault.jpg`,
          width: 1280,
          height: 720
        },
        {
          quality: 'High Quality',
          url: `${baseUrl}/hqdefault.jpg`,
          width: 480,
          height: 360
        },
        {
          quality: 'Medium Quality',
          url: `${baseUrl}/mqdefault.jpg`,
          width: 320,
          height: 180
        },
        {
          quality: 'Standard Definition',
          url: `${baseUrl}/sddefault.jpg`,
          width: 640,
          height: 480
        },
        {
          quality: 'Default',
          url: `${baseUrl}/default.jpg`,
          width: 120,
          height: 90
        }
      ]
    };
  };

  // 썸네일 가져오기
  const handleGetThumbnails = async () => {
    if (!url.trim()) {
      setError('YouTube URL을 입력해주세요.');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('올바른 YouTube URL을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // 실제 API 호출 대신 클라이언트에서 썸네일 URL 생성
      const data = generateThumbnailData(videoId);
      setThumbnailData(data);
    } catch {
      setError('썸네일을 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 썸네일 다운로드
  const handleDownload = async (thumbnailUrl: string, quality: string) => {
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `youtube-thumbnail-${quality.replace(/\s+/g, '-').toLowerCase()}-${thumbnailData?.videoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  // URL 복사
  const copyUrl = async (thumbnailUrl: string) => {
    try {
      await navigator.clipboard.writeText(thumbnailUrl);
      setCopiedUrl(thumbnailUrl);
      setTimeout(() => setCopiedUrl(''), 2000);
    } catch {
      // 복사 실패시 fallback
      const textArea = document.createElement('textarea');
      textArea.value = thumbnailUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUrl(thumbnailUrl);
      setTimeout(() => setCopiedUrl(''), 2000);
    }
  };

  // 입력 필드 초기화
  const handleReset = () => {
    setUrl('');
    setThumbnailData(null);
    setError('');
    setCopiedUrl('');
  };

  return (
    <>
      <Seo 
        title="유튜브 썸네일 다운로더 | ToolHub.tools"
        description="YouTube 동영상 썸네일을 고화질로 다운로드"
        keywords="유튜브썸네일,썸네일다운로드,YouTube,이미지다운로드"
        canonicalUrl="https://toolhub.tools/tools/thumbnail-downloader"
      />
      
      <ToolLayout
        title="유튜브 썸네일 다운로더"
        description="YouTube 동영상 썸네일을 고화질로 다운로드"
        category="media"
        relatedTools={relatedTools}
      >
        {/* URL 입력 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Youtube className="w-5 h-5 mr-2" />
              YouTube URL 입력
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="youtube-url">YouTube 동영상 URL</Label>
              <Input
                id="youtube-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... 또는 https://youtu.be/..."
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && handleGetThumbnails()}
              />
              <p className="text-sm text-gray-600 mt-1">
                지원 형식: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
              </p>
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={handleGetThumbnails}
                disabled={isLoading || !url.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    썸네일 가져오기
                  </>
                )}
              </Button>
              {(thumbnailData || error) && (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                >
                  초기화
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 썸네일 결과 */}
        {thumbnailData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                썸네일 다운로드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Badge variant="outline" className="mr-2">Video ID</Badge>
                  <span className="font-mono text-sm">{thumbnailData.videoId}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {thumbnailData.thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnail.url}
                        alt={`${thumbnail.quality} 썸네일`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="%23f3f4f6"/><text x="160" y="90" text-anchor="middle" fill="%236b7280">이미지 없음</text></svg>';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{thumbnail.quality}</h3>
                          <p className="text-sm text-gray-600">
                            {thumbnail.width} × {thumbnail.height}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          JPG
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleDownload(thumbnail.url, thumbnail.quality)}
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          다운로드
                        </Button>
                        <Button
                          onClick={() => copyUrl(thumbnail.url)}
                          size="sm"
                          variant="outline"
                          className={copiedUrl === thumbnail.url ? 'text-green-600' : ''}
                        >
                          <Copy className="w-4 h-4" />
                          {copiedUrl === thumbnail.url ? '복사됨' : 'URL'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 광고 */}
        <AdBannerInline />

        {/* 사용법 안내 */}
        <Card>
          <CardHeader>
            <CardTitle>사용법 및 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📱 지원하는 URL 형식</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>• https://youtu.be/VIDEO_ID</li>
                  <li>• https://youtube.com/embed/VIDEO_ID</li>
                  <li>• https://m.youtube.com/watch?v=VIDEO_ID</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🖼️ 썸네일 품질</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Maximum Quality:</strong> 1280×720 (HD)</li>
                  <li>• <strong>High Quality:</strong> 480×360</li>
                  <li>• <strong>Medium Quality:</strong> 320×180</li>
                  <li>• <strong>Standard:</strong> 640×480</li>
                  <li>• <strong>Default:</strong> 120×90</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                주의사항
              </h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• 다운로드한 썸네일의 저작권은 원본 동영상 제작자에게 있습니다</li>
                <li>• 상업적 용도로 사용하기 전에 저작권자의 허가를 받으세요</li>
                <li>• 일부 비공개 동영상의 썸네일은 접근이 제한될 수 있습니다</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    </>
  );
}