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
  const { t } = useTranslation();
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
      setError('YouTube URL을 입력해주세요');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('유효하지 않은 YouTube URL입니다. 올바른 YouTube 동영상 URL을 입력해주세요.');
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
                          {thumbnail.width} × {thumbnail.height} 픽셀
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => downloadThumbnail(thumbnail.url, thumbnail.quality, thumbnailData.videoId)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        다운로드
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
                        <p>이 화질의 썸네일을 사용할 수 없습니다</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                썸네일을 성공적으로 불러왔습니다! 원하는 해상도의 다운로드 버튼을 클릭하세요.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Card className="mt-8 shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">사용 방법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>• 브라우저에서 YouTube 동영상 URL을 복사하세요</p>
            <p>• 위의 입력 필드에 붙여넣으세요</p>
            <p>• "썸네일 가져오기"를 클릭하여 모든 해상도를 불러오세요</p>
            <p>• 원하는 화질을 선택하고 "다운로드"를 클릭하세요</p>
            <p>• youtube.com, youtu.be, YouTube Shorts URL을 지원합니다</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}