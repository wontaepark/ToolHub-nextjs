import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, LinkIcon, ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ThumbnailData {
  videoId: string;
  title?: string;
  thumbnails: {
    quality: string;
    url: string;
    width: number;
    height: number;
  }[];
}

export default function ThumbnailDownloader() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [url, setUrl] = useState('');
  const [thumbnailData, setThumbnailData] = useState<ThumbnailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract YouTube video ID from various URL formats
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Generate thumbnail URLs for different qualities
  const generateThumbnailUrls = (videoId: string) => {
    return [
      { quality: '최대 해상도', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, width: 1280, height: 720 },
      { quality: '고화질', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, width: 480, height: 360 },
      { quality: '중간 화질', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, width: 320, height: 180 },
      { quality: '표준', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, width: 640, height: 480 },
      { quality: '기본', url: `https://img.youtube.com/vi/${videoId}/default.jpg`, width: 120, height: 90 }
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setThumbnailData(null);

    if (!url.trim()) {
      setError(t('thumbnail.errors.emptyUrl'));
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError(t('thumbnail.errors.invalidUrl'));
      return;
    }

    setLoading(true);

    try {
      const thumbnails = generateThumbnailUrls(videoId);
      setThumbnailData({
        videoId,
        thumbnails
      });
    } catch (err) {
      setError(t('thumbnail.errors.processingFailed'));
    } finally {
      setLoading(false);
    }
  };

  const downloadThumbnail = async (url: string, quality: string, videoId: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${videoId}_${quality.toLowerCase().replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(t('thumbnail.errors.downloadFailed'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('thumbnail.title')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t('thumbnail.description')}
          </p>
        </div>

        <Card className="mb-8 shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              {t('thumbnail.urlInput.title')}
            </CardTitle>
            <CardDescription>
              {t('thumbnail.urlInput.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder={t('thumbnail.urlInput.placeholder')}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  {loading ? t('thumbnail.buttons.processing') : t('thumbnail.buttons.fetch')}
                </Button>
              </div>
            </form>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {thumbnailData && (
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                {t('thumbnail.videoId')}: {thumbnailData.videoId}
              </Badge>
            </div>

            <div className="grid gap-6">
              {thumbnailData.thumbnails.map((thumbnail, index) => (
                <Card key={index} className="shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{thumbnail.quality}</CardTitle>
                        <CardDescription>
                          {thumbnail.width} × {thumbnail.height} {t('thumbnail.pixels')}
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => downloadThumbnail(thumbnail.url, thumbnail.quality, thumbnailData.videoId)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('thumbnail.buttons.download')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <img
                        src={thumbnail.url}
                        alt={`${thumbnail.quality} thumbnail`}
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const errorDiv = target.nextElementSibling as HTMLElement;
                          if (errorDiv) errorDiv.style.display = 'block';
                        }}
                      />
                      <div
                        style={{ display: 'none' }}
                        className="text-center text-gray-500 dark:text-gray-400 py-8"
                      >
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>{t('thumbnail.errors.unavailable')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {t('thumbnail.success')}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Card className="mt-8 shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t('thumbnail.instructions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>• {t('thumbnail.instructions.step1')}</p>
            <p>• {t('thumbnail.instructions.step2')}</p>
            <p>• {t('thumbnail.instructions.step3')}</p>
            <p>• {t('thumbnail.instructions.step4')}</p>
            <p>• {t('thumbnail.instructions.step5')}</p>
          </CardContent>
        </Card>

        {/* Detailed Content Section */}
        <div className="space-y-8 mt-12">
          {/* 썸네일 다운로더 소개 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '유튜브 썸네일 다운로더' : 
               currentLang === 'ja' ? 'YouTubeサムネイルダウンローダー' : 
               'YouTube Thumbnail Downloader'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {currentLang === 'ko' ? 
                '유튜브 동영상의 썸네일 이미지를 고화질로 다운로드할 수 있는 무료 온라인 도구입니다. 콘텐츠 제작, 블로그 작성, 프레젠테이션 등에 필요한 썸네일 이미지를 간단한 URL 입력만으로 빠르게 저장할 수 있습니다.' :
               currentLang === 'ja' ? 
                'YouTube動画のサムネイル画像を高画質でダウンロードできる無料オンラインツールです。コンテンツ制作、ブログ執筆、プレゼンテーションなどに必要なサムネイル画像を簡単なURL入力だけで素早く保存できます。' :
                'A free online tool that allows you to download YouTube video thumbnail images in high quality. You can quickly save thumbnail images needed for content creation, blog writing, presentations, etc. with just a simple URL input.'
              }
            </p>
          </section>

          {/* 주요 기능 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '주요 기능' : 
               currentLang === 'ja' ? '主要機能' : 
               'Main Features'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {currentLang === 'ko' ? '다양한 해상도 지원' : 
                   currentLang === 'ja' ? '様々な解像度サポート' : 
                   'Multiple Resolution Support'}
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '최대 해상도 (1280x720)' : 
                        currentLang === 'ja' ? '最大解像度 (1280x720)' : 
                        'Maximum Resolution (1280x720)'}</li>
                  <li>• {currentLang === 'ko' ? '고화질 (480x360)' : 
                        currentLang === 'ja' ? '高画質 (480x360)' : 
                        'High Quality (480x360)'}</li>
                  <li>• {currentLang === 'ko' ? '중간 화질 (320x180)' : 
                        currentLang === 'ja' ? '中画質 (320x180)' : 
                        'Medium Quality (320x180)'}</li>
                  <li>• {currentLang === 'ko' ? '기본 화질 (120x90)' : 
                        currentLang === 'ja' ? '基本画質 (120x90)' : 
                        'Standard Quality (120x90)'}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">편의 기능</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 원클릭 다운로드</li>
                  <li>• 미리보기 제공</li>
                  <li>• 동영상 정보 표시</li>
                  <li>• 모든 기기 지원</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 활용 예시 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '활용 예시' : 
               currentLang === 'ja' ? '活用例' : 
               'Usage Examples'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '콘텐츠 제작' : 
                   currentLang === 'ja' ? 'コンテンツ制作' : 
                   'Content Creation'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    '블로그 포스팅, 소셜미디어 콘텐츠, 프레젠테이션 자료 제작 시 참고 이미지나 설명용 이미지로 활용할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    'ブログ投稿、ソーシャルメディアコンテンツ、プレゼンテーション資料制作時に参考画像や説明用画像として活用できます。' :
                    'Perfect for blog posts, social media content, and presentation materials as reference or explanatory images.'
                  }
                </p>
              </div>
              <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '연구 및 분석' : 
                   currentLang === 'ja' ? '研究・分析' : 
                   'Research & Analysis'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    '마케팅 연구, 트렌드 분석, 경쟁사 분석 등의 목적으로 썸네일 디자인을 수집하고 분석할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    'マーケティング研究、トレンド分析、競合分析などの目的でサムネイルデザインを収集・分析できます。' :
                    'Collect and analyze thumbnail designs for marketing research, trend analysis, competitor analysis, and more.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* 사용 팁 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '사용 팁' : 
               currentLang === 'ja' ? '使用ヒント' : 
               'Usage Tips'}
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• 저작권을 준수하여 개인적인 용도로만 사용하세요</li>
              <li>• 고화질이 필요한 경우 최대 해상도를 선택하세요</li>
              <li>• 정확한 유튜브 URL을 입력해야 정상 작동합니다</li>
              <li>• 일부 비공개 동영상은 썸네일을 가져올 수 없습니다</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}