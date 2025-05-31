import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  const handleContactForm = () => {
    // Google Form 링크 - 실제 사용 시 여기에 생성한 Google Form URL을 입력하세요
    const googleFormUrl = 'https://forms.gle/NAXfD8CqYD3UsxyP7';
    window.open(googleFormUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('contact.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('contact.description')}
        </p>
      </div>

      {/* 메인 연락처 카드 */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            {t('contact.form.title')}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {t('contact.form.subtitle')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 포함 항목 안내 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                {t('contact.form.includes')}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {t('contact.form.field1')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {t('contact.form.field2')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {t('contact.form.field3')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {t('contact.form.field4')}
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                {t('contact.response.title')}
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>{t('contact.response.time')}</p>
                <p>{t('contact.response.method')}</p>
              </div>
            </div>
          </div>

          {/* 문의하기 버튼 */}
          <div className="text-center pt-6">
            <Button 
              onClick={handleContactForm}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {t('contact.form.button')}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              {t('contact.form.notice')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 추가 정보 카드들 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">
              {t('contact.tips.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• {t('contact.tips.tip1')}</p>
            <p>• {t('contact.tips.tip2')}</p>
            <p>• {t('contact.tips.tip3')}</p>
            <p>• {t('contact.tips.tip4')}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-lg text-purple-600">
              {t('contact.faq.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">{t('contact.faq.q1')}</p>
              <p>{t('contact.faq.a1')}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">{t('contact.faq.q2')}</p>
              <p>{t('contact.faq.a2')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}