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

        {/* Comprehensive Content Section */}
        <div className="space-y-8 mt-12">
          {/* YouTube 썸네일 다운로더 소개 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <i className="ri-download-line text-primary"></i>
                {currentLang === 'ko' ? 'YouTube 썸네일 다운로더 소개' :
                 currentLang === 'ja' ? 'YouTubeサムネイルダウンローダー紹介' :
                 'YouTube Thumbnail Downloader Introduction'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {currentLang === 'ko' ? 
                    'ToolHub.tools의 YouTube 썸네일 다운로더는 YouTube 동영상에서 고품질 썸네일 이미지를 간단하고 빠르게 추출할 수 있는 전문적인 온라인 도구입니다. 콘텐츠 크리에이터, 마케터, 연구자, 디자이너들이 YouTube 썸네일을 분석하고 활용할 수 있도록 설계된 이 도구는 복잡한 과정 없이 URL 입력만으로 다양한 해상도의 썸네일을 즉시 다운로드할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    'ToolHub.toolsのYouTubeサムネイルダウンローダーは、YouTube動画から高品質サムネイル画像を簡単かつ迅速に抽出できる専門的なオンラインツールです。コンテンツクリエイター、マーケター、研究者、デザイナーがYouTubeサムネイルを分析・活用できるよう設計されたこのツールは、複雑な過程なくURL入力だけで様々な解像度のサムネイルを即座にダウンロードできます。' :
                    'ToolHub.tools YouTube Thumbnail Downloader is a professional online tool that allows you to easily and quickly extract high-quality thumbnail images from YouTube videos. Designed for content creators, marketers, researchers, and designers to analyze and utilize YouTube thumbnails, this tool enables instant download of thumbnails in various resolutions with just URL input, without any complex processes.'
                  }
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    {currentLang === 'ko' ? '핵심 장점' :
                     currentLang === 'ja' ? '主要メリット' :
                     'Key Benefits'}
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• {currentLang === 'ko' ? '무료 사용 - 별도 회원가입이나 결제 없이 완전 무료' :
                            currentLang === 'ja' ? '無料使用 - 別途会員登録や決済なしで完全無料' :
                            'Free to use - completely free without registration or payment'}</li>
                    <li>• {currentLang === 'ko' ? '빠른 처리 - URL 입력 후 몇 초 내 썸네일 추출 완료' :
                            currentLang === 'ja' ? '高速処理 - URL入力後数秒でサムネイル抽出完了' :
                            'Fast processing - thumbnail extraction completed within seconds of URL input'}</li>
                    <li>• {currentLang === 'ko' ? '다양한 품질 - 최대 1920×1080 Full HD까지 지원' :
                            currentLang === 'ja' ? '様々な品質 - 最大1920×1080 Full HDまでサポート' :
                            'Various qualities - supports up to 1920×1080 Full HD'}</li>
                    <li>• {currentLang === 'ko' ? '저작권 준수 - 적법한 범위 내에서 안전한 사용' :
                            currentLang === 'ja' ? '著作権遵守 - 適法な範囲内で安全な使用' :
                            'Copyright compliant - safe use within legal boundaries'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <h3 className="text-lg font-semibold mb-3">
                  {currentLang === 'ko' ? '편의 기능' : 
                   currentLang === 'ja' ? '便利機能' : 
                   'Convenience Features'}
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '원클릭 다운로드' : 
                        currentLang === 'ja' ? 'ワンクリックダウンロード' : 
                        'One-Click Download'}</li>
                  <li>• {currentLang === 'ko' ? '미리보기 제공' : 
                        currentLang === 'ja' ? 'プレビュー提供' : 
                        'Preview Available'}</li>
                  <li>• {currentLang === 'ko' ? '동영상 정보 표시' : 
                        currentLang === 'ja' ? '動画情報表示' : 
                        'Video Information Display'}</li>
                  <li>• {currentLang === 'ko' ? '모든 기기 지원' : 
                        currentLang === 'ja' ? '全デバイス対応' : 
                        'All Device Support'}</li>
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
              <li>• {currentLang === 'ko' ? '저작권을 준수하여 개인적인 용도로만 사용하세요' : 
                     currentLang === 'ja' ? '著作権を遵守して個人的な用途でのみご利用ください' : 
                     'Please respect copyright and use only for personal purposes'}</li>
              <li>• {currentLang === 'ko' ? '고화질이 필요한 경우 최대 해상도를 선택하세요' : 
                     currentLang === 'ja' ? '高画質が必要な場合は最大解像度を選択してください' : 
                     'Select maximum resolution when high quality is needed'}</li>
              <li>• {currentLang === 'ko' ? '정확한 유튜브 URL을 입력해야 정상 작동합니다' : 
                     currentLang === 'ja' ? '正確なYouTube URLを入力する必要があります' : 
                     'Enter accurate YouTube URL for proper functionality'}</li>
              <li>• {currentLang === 'ko' ? '일부 비공개 동영상은 썸네일을 가져올 수 없습니다' : 
                     currentLang === 'ja' ? '一部の非公開動画はサムネイルを取得できません' : 
                     'Some private videos may not allow thumbnail retrieval'}</li>
            </ul>
          </section>

          {/* YouTube 썸네일의 중요성과 역할 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <i className="ri-image-line text-yellow-500"></i>
                {currentLang === 'ko' ? 'YouTube 썸네일의 중요성과 역할' :
                 currentLang === 'ja' ? 'YouTubeサムネイルの重要性と役割' :
                 'Importance and Role of YouTube Thumbnails'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <i className="ri-marketing-line text-red-500"></i>
                    {currentLang === 'ko' ? '디지털 마케팅에서의 썸네일' :
                     currentLang === 'ja' ? 'デジタルマーケティングでのサムネイル' :
                     'Thumbnails in Digital Marketing'}
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-3 rounded-lg border border-red-200/50 dark:border-red-800/30">
                      <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                        {currentLang === 'ko' ? '첫인상 결정 요소' :
                         currentLang === 'ja' ? '第一印象決定要素' :
                         'First Impression Determiner'}
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {currentLang === 'ko' ? 'YouTube에서 썸네일은 시청자가 영상을 클릭할지 결정하는 가장 중요한 요소 중 하나입니다. 연구에 따르면 사용자는 썸네일을 보고 0.05초 내에 클릭 여부를 결정하며, 효과적인 썸네일은 클릭률(CTR)을 300% 이상 향상시킬 수 있습니다.' :
                         currentLang === 'ja' ? 'YouTubeでサムネイルは視聴者が動画をクリックするかどうかを決定する最も重要な要素の一つです。研究によると、ユーザーはサムネイルを見て0.05秒以内にクリックするかどうかを決定し、効果的なサムネイルはクリック率（CTR）を300%以上向上させることができます。' :
                         'On YouTube, thumbnails are one of the most important factors in determining whether viewers click on a video. Research shows users decide whether to click within 0.05 seconds of seeing a thumbnail, and effective thumbnails can improve click-through rates (CTR) by over 300%.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <i className="ri-strategy-line text-green-500"></i>
                    {currentLang === 'ko' ? '콘텐츠 전략에서의 활용' :
                     currentLang === 'ja' ? 'コンテンツ戦略での活用' :
                     'Utilization in Content Strategy'}
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-lg border border-green-200/50 dark:border-green-800/30">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                        {currentLang === 'ko' ? '경쟁 분석' :
                         currentLang === 'ja' ? '競合分析' :
                         'Competitive Analysis'}
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {currentLang === 'ko' ? '동일한 니치나 주제의 인기 동영상 썸네일을 분석하여 트렌드를 파악하고, 어떤 요소가 시청자의 관심을 끄는지 연구할 수 있습니다.' :
                         currentLang === 'ja' ? '同じニッチやトピックの人気動画サムネイルを分析してトレンドを把握し、どの要素が視聴者の関心を引くかを研究できます。' :
                         'By analyzing thumbnails of popular videos in the same niche or topic, you can identify trends and study which elements attract viewer attention.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상세 사용법 가이드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <i className="ri-guide-line text-primary"></i>
                {currentLang === 'ko' ? '상세 사용법 가이드' :
                 currentLang === 'ja' ? '詳細使用法ガイド' :
                 'Detailed Usage Guide'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center">1</span>
                    {currentLang === 'ko' ? '기본 다운로드 과정' :
                     currentLang === 'ja' ? '基本ダウンロード過程' :
                     'Basic Download Process'}
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                        {currentLang === 'ko' ? 'URL 복사 및 입력' :
                         currentLang === 'ja' ? 'URLコピーと入力' :
                         'URL Copy and Input'}
                      </h4>
                      <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                        <li>1. {currentLang === 'ko' ? 'YouTube 접속: 원하는 동영상 페이지로 이동' :
                               currentLang === 'ja' ? 'YouTube接続: 希望する動画ページに移動' :
                               'YouTube access: Navigate to desired video page'}</li>
                        <li>2. {currentLang === 'ko' ? 'URL 복사: 브라우저 주소창의 전체 URL 복사 (Ctrl+L → Ctrl+C)' :
                               currentLang === 'ja' ? 'URLコピー: ブラウザアドレスバーの全URLコピー（Ctrl+L → Ctrl+C）' :
                               'URL copy: Copy full URL from browser address bar (Ctrl+L → Ctrl+C)'}</li>
                        <li>3. {currentLang === 'ko' ? '입력창 붙여넣기: ToolHub 입력 필드에 URL 붙여넣기 (Ctrl+V)' :
                               currentLang === 'ja' ? '入力欄貼り付け: ToolHub入力フィールドにURL貼り付け（Ctrl+V）' :
                               'Input field paste: Paste URL into ToolHub input field (Ctrl+V)'}</li>
                        <li>4. {currentLang === 'ko' ? 'URL 확인: 정확한 YouTube URL인지 자동 검증' :
                               currentLang === 'ja' ? 'URL確認: 正確なYouTube URLかどうか自動検証' :
                               'URL verification: Automatic validation of correct YouTube URL'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full text-sm flex items-center justify-center">2</span>
                    {currentLang === 'ko' ? '품질 최적화 선택' :
                     currentLang === 'ja' ? '品質最適化選択' :
                     'Quality Optimization Selection'}
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-lg border border-green-200/50 dark:border-green-800/30">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                        {currentLang === 'ko' ? '용도별 최적 해상도 가이드' :
                         currentLang === 'ja' ? '用途別最適解像度ガイド' :
                         'Purpose-based Optimal Resolution Guide'}
                      </h4>
                      <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                        <li>• {currentLang === 'ko' ? '블로그 포스팅: 1280×720 (HD) - 로딩 속도와 품질 균형' :
                                currentLang === 'ja' ? 'ブログ投稿: 1280×720（HD）- ロード速度と品質のバランス' :
                                'Blog posting: 1280×720 (HD) - Balance of loading speed and quality'}</li>
                        <li>• {currentLang === 'ko' ? '소셜미디어: 640×480 (SD) - 플랫폼별 권장 크기 고려' :
                                currentLang === 'ja' ? 'ソーシャルメディア: 640×480（SD）- プラットフォーム別推奨サイズ考慮' :
                                'Social media: 640×480 (SD) - Consider platform-specific recommended sizes'}</li>
                        <li>• {currentLang === 'ko' ? '프레젠테이션: 1920×1080 (Full HD) - 대형 화면에서 선명함' :
                                currentLang === 'ja' ? 'プレゼンテーション: 1920×1080（Full HD）- 大型画面での鮮明さ' :
                                'Presentation: 1920×1080 (Full HD) - Clarity on large screens'}</li>
                        <li>• {currentLang === 'ko' ? '참고 자료: 480×360 (Low) - 빠른 확인과 저장 공간 절약' :
                                currentLang === 'ja' ? '参考資料: 480×360（Low）- 高速確認と保存スペース節約' :
                                'Reference material: 480×360 (Low) - Quick verification and storage space savings'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 다양한 활용 분야와 실제 사례 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <i className="ri-rocket-line text-orange-500"></i>
                {currentLang === 'ko' ? '다양한 활용 분야와 실제 사례' :
                 currentLang === 'ja' ? '様々な活用分野と実際の事例' :
                 'Various Application Fields and Real Cases'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <i className="ri-video-line text-red-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {currentLang === 'ko' ? '콘텐츠 크리에이션' :
                     currentLang === 'ja' ? 'コンテンツクリエーション' :
                     'Content Creation'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentLang === 'ko' ? 'YouTube 크리에이터를 위한 썸네일 분석과 스타일 연구' :
                     currentLang === 'ja' ? 'YouTubeクリエイターのためのサムネイル分析とスタイル研究' :
                     'Thumbnail analysis and style research for YouTube creators'}
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• {currentLang === 'ko' ? '교육 채널: 깔끔한 텍스트와 밝은 배경 트렌드 분석' :
                            currentLang === 'ja' ? '教育チャンネル: 清潔なテキストと明るい背景トレンド分析' :
                            'Educational channels: Clean text and bright background trend analysis'}</li>
                    <li>• {currentLang === 'ko' ? '게임 채널: 역동적인 스크린샷과 과장된 표정 효과성 연구' :
                            currentLang === 'ja' ? 'ゲームチャンネル: 動的スクリーンショットと誇張表情効果性研究' :
                            'Gaming channels: Dynamic screenshot and exaggerated expression effectiveness study'}</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <i className="ri-bar-chart-line text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {currentLang === 'ko' ? '마케팅 및 광고 분야' :
                     currentLang === 'ja' ? 'マーケティング・広告分野' :
                     'Marketing and Advertising'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentLang === 'ko' ? '디지털 마케팅 전문가를 위한 트렌드 분석' :
                     currentLang === 'ja' ? 'デジタルマーケティング専門家のためのトレンド分析' :
                     'Trend analysis for digital marketing professionals'}
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• {currentLang === 'ko' ? '브랜드 모니터링: 경쟁 브랜드의 YouTube 광고 썸네일 스타일 분석' :
                            currentLang === 'ja' ? 'ブランドモニタリング: 競合ブランドのYouTube広告サムネイルスタイル分析' :
                            'Brand monitoring: Competitor brand YouTube ad thumbnail style analysis'}</li>
                    <li>• {currentLang === 'ko' ? '인플루언서 선별: 썸네일 품질과 일관성을 통한 파트너 평가' :
                            currentLang === 'ja' ? 'インフルエンサー選別: サムネイル品質と一貫性によるパートナー評価' :
                            'Influencer selection: Partner evaluation through thumbnail quality and consistency'}</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <i className="ri-book-line text-green-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {currentLang === 'ko' ? '교육 및 연구 분야' :
                     currentLang === 'ja' ? '教育・研究分野' :
                     'Education and Research'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentLang === 'ko' ? '학술 연구자를 위한 데이터 수집과 분석' :
                     currentLang === 'ja' ? '学術研究者のためのデータ収集と分析' :
                     'Data collection and analysis for academic researchers'}
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• {currentLang === 'ko' ? '시각적 수사학 연구: 썸네일 색상, 구도, 텍스트가 감정에 미치는 영향' :
                            currentLang === 'ja' ? '視覚的修辞学研究: サムネイル色、構図、テキストが感情に与える影響' :
                            'Visual rhetoric research: Impact of thumbnail color, composition, text on emotions'}</li>
                    <li>• {currentLang === 'ko' ? '문화 연구: 지역별, 언어별 썸네일 스타일의 문화적 차이 분석' :
                            currentLang === 'ja' ? '文化研究: 地域別、言語別サムネイルスタイルの文化的差異分析' :
                            'Cultural research: Analysis of cultural differences in thumbnail styles by region/language'}</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <i className="ri-briefcase-line text-purple-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {currentLang === 'ko' ? '비즈니스 분석' :
                     currentLang === 'ja' ? 'ビジネス分析' :
                     'Business Analysis'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentLang === 'ko' ? '기업의 마케팅 팀을 위한 경쟁사 분석' :
                     currentLang === 'ja' ? '企業のマーケティングチームのための競合分析' :
                     'Competitive analysis for corporate marketing teams'}
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• {currentLang === 'ko' ? '브랜드 포지셔닝: 경쟁사 대비 자사 브랜드의 시각적 차별화 포인트 발견' :
                            currentLang === 'ja' ? 'ブランドポジショニング: 競合他社比較で自社ブランドの視覚的差別化ポイント発見' :
                            'Brand positioning: Discover visual differentiation points compared to competitors'}</li>
                    <li>• {currentLang === 'ko' ? '타겟 오디언스: 특정 타겟을 겨냥한 썸네일 전략 벤치마킹' :
                            currentLang === 'ja' ? 'ターゲットオーディエンス: 特定ターゲットを狙ったサムネイル戦略ベンチマーキング' :
                            'Target audience: Benchmarking thumbnail strategies targeting specific audiences'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 저작권과 윤리적 사용 가이드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <i className="ri-shield-user-line text-red-500"></i>
                {currentLang === 'ko' ? '저작권과 윤리적 사용 가이드' :
                 currentLang === 'ja' ? '著作権と倫理的使用ガイド' :
                 'Copyright and Ethical Usage Guide'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <i className="ri-scales-line text-blue-500"></i>
                    {currentLang === 'ko' ? '저작권법 준수사항' :
                     currentLang === 'ja' ? '著作権法遵守事項' :
                     'Copyright Law Compliance'}
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200/50 dark:border-green-800/30">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                        {currentLang === 'ko' ? '허용되는 사용 범위' :
                         currentLang === 'ja' ? '許可される使用範囲' :
                         'Permitted Usage Scope'}
                      </h4>
                      <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                        <li>• {currentLang === 'ko' ? '교육 목적: 수업 자료나 학술 연구의 참고 자료' :
                                currentLang === 'ja' ? '教育目的: 授業資料や学術研究の参考資料' :
                                'Educational purposes: Class materials or academic research references'}</li>
                        <li>• {currentLang === 'ko' ? '비평과 리뷰: 동영상 내용을 분석하거나 리뷰하는 글의 삽화' :
                                currentLang === 'ja' ? '批評とレビュー: 動画内容を分析またはレビューする文章の挿図' :
                                'Criticism and review: Illustrations for articles analyzing or reviewing video content'}</li>
                        <li>• {currentLang === 'ko' ? '뉴스 보도: 관련 동영상을 소개하는 기사의 참고 이미지' :
                                currentLang === 'ja' ? 'ニュース報道: 関連動画を紹介する記事の参考画像' :
                                'News reporting: Reference images for articles introducing related videos'}</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-4 rounded-lg border border-red-200/50 dark:border-red-800/30">
                      <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                        {currentLang === 'ko' ? '금지되는 사용' :
                         currentLang === 'ja' ? '禁止される使用' :
                         'Prohibited Usage'}
                      </h4>
                      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                        <li>• {currentLang === 'ko' ? '상업적 재사용: 썸네일을 자신의 상업적 콘텐츠에 무단 사용' :
                                currentLang === 'ja' ? '商業的再使用: サムネイルを自分の商業コンテンツに無断使用' :
                                'Commercial reuse: Unauthorized use of thumbnails in own commercial content'}</li>
                        <li>• {currentLang === 'ko' ? '브랜드 침해: 다른 채널의 썸네일을 모방하여 혼동 유발' :
                                currentLang === 'ja' ? 'ブランド侵害: 他チャンネルのサムネイルを模倣して混乱誘発' :
                                'Brand infringement: Copying other channels\' thumbnails causing confusion'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <i className="ri-heart-line text-green-500"></i>
                    {currentLang === 'ko' ? '윤리적 사용 가이드라인' :
                     currentLang === 'ja' ? '倫理的使用ガイドライン' :
                     'Ethical Usage Guidelines'}
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                        {currentLang === 'ko' ? '출처 명시 원칙' :
                         currentLang === 'ja' ? '出典明示原則' :
                         'Source Attribution Principle'}
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {currentLang === 'ko' ? '썸네일을 사용할 때는 항상 원본 동영상의 출처를 명확히 표시해야 합니다. 채널명, 동영상 제목, URL을 함께 기재하여 원작자에 대한 적절한 크레딧을 제공하세요.' :
                         currentLang === 'ja' ? 'サムネイルを使用する際は常に元動画の出典を明確に表示する必要があります。チャンネル名、動画タイトル、URLを一緒に記載して原作者に適切なクレジットを提供してください。' :
                         'When using thumbnails, always clearly indicate the source of the original video. Provide appropriate credit to the original creator by including channel name, video title, and URL.'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 p-4 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                      <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">
                        {currentLang === 'ko' ? '상업적 사용 시 주의사항' :
                         currentLang === 'ja' ? '商業的使用時の注意事項' :
                         'Commercial Use Precautions'}
                      </h4>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        {currentLang === 'ko' ? '상업적 목적으로 썸네일을 사용하고자 할 때는 반드시 원작자의 사전 허가를 받아야 합니다. 이메일이나 YouTube 메시지를 통해 정중하게 사용 허가를 요청하고, 서면 동의를 받은 후 사용하는 것이 안전합니다.' :
                         currentLang === 'ja' ? '商業目的でサムネイルを使用したい場合は必ず原作者の事前許可を得る必要があります。メールやYouTubeメッセージを通じて丁寧に使用許可を要請し、書面同意を得てから使用することが安全です。' :
                         'When using thumbnails for commercial purposes, you must obtain prior permission from the original creator. It is safe to politely request usage permission via email or YouTube messages and use only after receiving written consent.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 마무리 섹션 */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-8 border border-blue-200/50 dark:border-blue-800/30">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {currentLang === 'ko' ? '효율적인 YouTube 썸네일 활용의 시작' :
               currentLang === 'ja' ? '効率的なYouTubeサムネイル活用の始まり' :
               'The Beginning of Efficient YouTube Thumbnail Utilization'}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
              {currentLang === 'ko' ? 'ToolHub.tools YouTube 썸네일 다운로더와 함께 디지털 콘텐츠의 새로운 가능성을 탐험해보세요. 고품질 썸네일로 여러분의 프로젝트를 한층 더 전문적으로 만들어보세요.' :
               currentLang === 'ja' ? 'ToolHub.tools YouTubeサムネイルダウンローダーと一緒にデジタルコンテンツの新しい可能性を探検してください。高品質サムネイルであなたのプロジェクトをより専門的にしてみてください。' :
               'Explore new possibilities in digital content with ToolHub.tools YouTube Thumbnail Downloader. Make your projects more professional with high-quality thumbnails.'}
            </p>
            <div className="flex justify-center">
              <div className="animate-pulse">
                <i className="ri-download-cloud-line text-primary text-4xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}