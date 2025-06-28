import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdSense from '@/components/AdSense';

interface DateDifference {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  weeks: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function DateCalculator() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const currentLang = i18n.language;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<DateDifference | null>(null);
  const [error, setError] = useState('');

  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      setError(t('dateCalculator.errors.selectDates'));
      setResult(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError(t('dateCalculator.errors.invalidDates'));
      setResult(null);
      return;
    }

    setError('');

    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(end.getTime() - start.getTime());
    
    // Convert to different units
    const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const seconds = Math.floor(diffInMs / 1000);

    // Calculate years, months, and remaining days
    let years = 0;
    let months = 0;
    let days = 0;

    if (totalDays > 0) {
      const startYear = start.getFullYear();
      const startMonth = start.getMonth();
      const startDay = start.getDate();
      
      const endYear = end.getFullYear();
      const endMonth = end.getMonth();
      const endDay = end.getDate();

      years = endYear - startYear;
      months = endMonth - startMonth;
      days = endDay - startDay;

      if (days < 0) {
        months--;
        const daysInPrevMonth = new Date(endYear, endMonth, 0).getDate();
        days += daysInPrevMonth;
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      // If end date is before start date, make values negative
      if (end < start) {
        years = -years;
        months = -months;
        days = -days;
      }
    }

    setResult({
      totalDays: end < start ? -totalDays : totalDays,
      years,
      months,
      days,
      weeks: end < start ? -weeks : weeks,
      hours: end < start ? -hours : hours,
      minutes: end < start ? -minutes : minutes,
      seconds: end < start ? -seconds : seconds
    });
  };

  const swapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  };

  const setToday = (field: 'start' | 'end') => {
    const today = new Date().toISOString().split('T')[0];
    if (field === 'start') {
      setStartDate(today);
    } else {
      setEndDate(today);
    }
  };

  const copyResult = () => {
    if (!result) return;

    let resultText = '';
    if (result.totalDays === 0) {
      resultText = t('dateCalculator.results.sameDay');
    } else if (result.totalDays > 0) {
      resultText = t('dateCalculator.results.daysAfter', { days: result.totalDays });
    } else {
      resultText = t('dateCalculator.results.daysBefore', { days: Math.abs(result.totalDays) });
    }

    if (result.years > 0 || result.months > 0) {
      resultText += `\n${t('dateCalculator.results.detailed', {
        years: Math.abs(result.years),
        months: Math.abs(result.months),
        days: Math.abs(result.days)
      })}`;
    }

    navigator.clipboard.writeText(resultText).then(() => {
      toast({
        title: t('dateCalculator.copySuccess'),
        description: t('dateCalculator.copySuccessDesc'),
      });
    }).catch(() => {
      toast({
        title: t('dateCalculator.copyError'),
        description: t('dateCalculator.copyErrorDesc'),
        variant: 'destructive',
      });
    });
  };

  const formatResultText = () => {
    if (!result) return '';

    if (result.totalDays === 0) {
      return t('dateCalculator.results.sameDay');
    } else if (result.totalDays > 0) {
      return t('dateCalculator.results.daysAfter', { days: result.totalDays });
    } else {
      return t('dateCalculator.results.daysBefore', { days: Math.abs(result.totalDays) });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t('dateCalculator.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('dateCalculator.description')}
          </p>
        </div>

        {/* AdSense */}
        <div className="mb-8 flex justify-center">
          <AdSense adSlot="1234567890" className="w-full max-w-4xl" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Calculator */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('dateCalculator.calculator')}
              </CardTitle>
              <CardDescription>
                {t('dateCalculator.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('dateCalculator.startDate')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setToday('start')}
                      className="shrink-0"
                    >
                      {t('dateCalculator.today')}
                    </Button>
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('dateCalculator.endDate')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setToday('end')}
                      className="shrink-0"
                    >
                      {t('dateCalculator.today')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={calculateDateDifference} className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('dateCalculator.calculate')}
                </Button>
                <Button variant="outline" onClick={swapDates}>
                  {t('dateCalculator.swap')}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        {t('dateCalculator.result')}
                      </h3>
                      <Button variant="outline" size="sm" onClick={copyResult}>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('dateCalculator.copy')}
                      </Button>
                    </div>
                    
                    <div className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                      {formatResultText()}
                    </div>

                    {/* Detailed breakdown */}
                    {(Math.abs(result.years) > 0 || Math.abs(result.months) > 0) && (
                      <div className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                        {t('dateCalculator.results.detailed', {
                          years: Math.abs(result.years),
                          months: Math.abs(result.months),
                          days: Math.abs(result.days)
                        })}
                      </div>
                    )}

                    {/* Additional units */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.abs(result.weeks).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t('dateCalculator.units.weeks')}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.abs(result.hours).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t('dateCalculator.units.hours')}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.abs(result.minutes).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t('dateCalculator.units.minutes')}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.abs(result.seconds).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {t('dateCalculator.units.seconds')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AdSense */}
          <div className="flex justify-center">
            <AdSense adSlot="1234567891" className="w-full max-w-4xl" />
          </div>

          {/* Usage Tips */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dateCalculator.tips.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">1</Badge>
                    <p className="text-sm">{t('dateCalculator.tips.tip1')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">2</Badge>
                    <p className="text-sm">{t('dateCalculator.tips.tip2')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">3</Badge>
                    <p className="text-sm">{t('dateCalculator.tips.tip3')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">4</Badge>
                    <p className="text-sm">{t('dateCalculator.tips.tip4')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AdSense */}
          <div className="flex justify-center">
            <AdSense adSlot="1234567892" className="w-full max-w-4xl" />
          </div>

          {/* 날짜 계산기란 무엇인가요? */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '날짜 계산기란 무엇인가요?' : 
               currentLang === 'ja' ? '日付計算機とは何ですか？' : 
               'What is a Date Calculator?'}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {currentLang === 'ko' ? 
                  '날짜 계산기는 두 날짜 사이의 정확한 시간 차이를 계산해주는 편리한 도구입니다. 일, 주, 개월, 년 단위로 날짜 간격을 계산할 수 있으며, 시간, 분, 초까지 세밀하게 측정할 수 있습니다. 생일까지 남은 일수 계산, 근무 기간 산정, 프로젝트 진행 기간 측정, 기념일 계산 등 다양한 상황에서 활용할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '日付計算機は、2つの日付間の正確な時間差を計算してくれる便利なツールです。日、週、月、年単位で日付間隔を計算でき、時間、分、秒まで細かく測定できます。誕生日までの残り日数計算、勤務期間算定、プロジェクト進行期間測定、記念日計算など様々な状況で活用できます。' :
                  'A date calculator is a convenient tool that calculates the exact time difference between two dates. You can calculate date intervals in days, weeks, months, and years, and measure precisely down to hours, minutes, and seconds. It can be used in various situations such as calculating days until birthday, determining work periods, measuring project duration, and calculating anniversaries.'
                }
              </p>
              <p>
                {currentLang === 'ko' ? 
                  '우리의 온라인 날짜 계산기는 직관적인 인터페이스와 정확한 계산 엔진을 제공하여 누구나 쉽게 사용할 수 있습니다. 복잡한 윤년 계산이나 월별 일수 차이도 자동으로 처리하므로, 사용자는 단순히 시작일과 종료일만 입력하면 됩니다. 계산 결과는 다양한 단위로 표시되어 원하는 형태로 정보를 확인할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '私たちのオンライン日付計算機は、直感的なインターフェースと正確な計算エンジンを提供し、誰でも簡単に使用できます。複雑なうるう年計算や月別日数の違いも自動的に処理するため、ユーザーは単純に開始日と終了日を入力するだけです。計算結果は様々な単位で表示され、希望する形で情報を確認できます。' :
                  'Our online date calculator provides an intuitive interface and accurate calculation engine that anyone can easily use. Complex leap year calculations and monthly day differences are automatically handled, so users simply need to input start and end dates. Calculation results are displayed in various units, allowing you to view information in your preferred format.'
                }
              </p>
            </div>
          </section>

          {/* 주요 기능 및 특징 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '주요 기능 및 특징' : 
               currentLang === 'ja' ? '主要機能と特徴' : 
               'Key Features and Characteristics'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '정확한 날짜 계산' : 
                       currentLang === 'ja' ? '正確な日付計算' : 
                       'Accurate Date Calculation'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '윤년, 월별 일수 차이, 시간대 등을 모두 고려한 정밀한 계산' :
                       currentLang === 'ja' ? 
                        'うるう年、月別日数差、タイムゾーンなどをすべて考慮した精密な計算' :
                        'Precise calculations considering leap years, monthly day differences, and time zones'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '다양한 시간 단위' : 
                       currentLang === 'ja' ? '様々な時間単位' : 
                       'Various Time Units'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '년, 월, 일, 주, 시간, 분, 초까지 모든 시간 단위로 결과 표시' :
                       currentLang === 'ja' ? 
                        '年、月、日、週、時間、分、秒まですべての時間単位で結果表示' :
                        'Results displayed in all time units from years to seconds'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Copy className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '결과 복사 기능' : 
                       currentLang === 'ja' ? '結果コピー機能' : 
                       'Result Copy Feature'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '계산 결과를 클립보드에 복사하여 다른 곳에 쉽게 붙여넣기' :
                       currentLang === 'ja' ? 
                        '計算結果をクリップボードにコピーして他の場所に簡単に貼り付け' :
                        'Copy calculation results to clipboard for easy pasting elsewhere'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '스마트 오류 검증' : 
                       currentLang === 'ja' ? 'スマートエラー検証' : 
                       'Smart Error Validation'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '잘못된 날짜 입력이나 형식 오류를 자동으로 감지하고 안내' :
                       currentLang === 'ja' ? 
                        '間違った日付入力や形式エラーを自動的に検出してガイド' :
                        'Automatically detects and guides through invalid date inputs or format errors'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 상세 사용법 가이드 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '상세 사용법 가이드' : 
               currentLang === 'ja' ? '詳細使用法ガイド' : 
               'Detailed Usage Guide'}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '1. 기본 날짜 계산' : 
                   currentLang === 'ja' ? '1. 基本日付計算' : 
                   '1. Basic Date Calculation'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '시작일과 종료일을 각각 선택하고 "계산하기" 버튼을 클릭합니다. 날짜 입력란을 직접 클릭하거나 "오늘" 버튼을 사용하여 현재 날짜를 빠르게 입력할 수 있습니다. 계산 결과는 총 일수와 함께 년, 월, 일로 세분화되어 표시됩니다.' :
                   currentLang === 'ja' ? 
                    '開始日と終了日をそれぞれ選択し、「計算する」ボタンをクリックします。日付入力欄を直接クリックするか、「今日」ボタンを使用して現在の日付を素早く入力できます。計算結果は総日数と共に年、月、日で細分化されて表示されます。' :
                    'Select start and end dates respectively and click the "Calculate" button. You can click the date input field directly or use the "Today" button to quickly enter the current date. Calculation results are displayed with total days broken down into years, months, and days.'
                  }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '2. 날짜 순서 바꾸기' : 
                   currentLang === 'ja' ? '2. 日付順序変更' : 
                   '2. Date Order Switching'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '"날짜 바꾸기" 버튼을 사용하면 시작일과 종료일의 위치를 서로 바꿀 수 있습니다. 이 기능은 과거부터 현재까지의 기간을 계산하다가 미래까지의 기간을 계산하고 싶을 때 유용합니다. 날짜가 바뀌면 자동으로 재계산됩니다.' :
                   currentLang === 'ja' ? 
                    '「日付交換」ボタンを使用すると、開始日と終了日の位置を互いに交換できます。この機能は、過去から現在までの期間を計算していて未来までの期間を計算したい時に便利です。日付が変わると自動的に再計算されます。' :
                    'Using the "Swap Dates" button allows you to switch the positions of start and end dates. This feature is useful when you want to switch from calculating a period from past to present to calculating a period to the future. When dates are swapped, it automatically recalculates.'
                  }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '3. 결과 활용하기' : 
                   currentLang === 'ja' ? '3. 結果活用' : 
                   '3. Utilizing Results'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '계산 결과는 여러 형태로 표시됩니다. 주요 결과 외에도 주, 시간, 분, 초 단위의 상세 정보를 확인할 수 있습니다. "복사" 버튼을 클릭하면 결과를 클립보드에 복사하여 문서나 메모에 붙여넣을 수 있습니다. 모든 수치는 천 단위로 구분되어 가독성이 높습니다.' :
                   currentLang === 'ja' ? 
                    '計算結果は複数の形で表示されます。主要結果の他にも週、時間、分、秒単位の詳細情報を確認できます。「コピー」ボタンをクリックすると結果をクリップボードにコピーして文書やメモに貼り付けできます。すべての数値は千単位で区切られており可読性が高いです。' :
                    'Calculation results are displayed in multiple formats. In addition to main results, you can check detailed information in weeks, hours, minutes, and seconds. Clicking the "Copy" button copies the result to clipboard for pasting into documents or notes. All numbers are separated by thousands for high readability.'
                  }
                </p>
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
                  {currentLang === 'ko' ? '개인 용도' : 
                   currentLang === 'ja' ? '個人用途' : 
                   'Personal Use'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    '생일까지 남은 일수 계산, 연인과 사귄 기간 계산, 금연/금주 성공 일수 확인, 여행 계획 기간 산정, 다이어트 진행 기간 추적, 임신 주수 계산 등 개인적인 목표나 기념일 관리에 활용할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    '誕生日までの残り日数計算、恋人と付き合った期間計算、禁煙・禁酒成功日数確認、旅行計画期間算定、ダイエット進行期間追跡、妊娠週数計算など個人的な目標や記念日管理に活用できます。' :
                    'Can be used for personal goal and anniversary management such as calculating days until birthday, calculating relationship duration, checking smoking/drinking cessation success days, planning travel periods, tracking diet progress, and calculating pregnancy weeks.'
                  }
                </p>
              </div>
              <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '업무 활용' : 
                   currentLang === 'ja' ? '業務活用' : 
                   'Business Use'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    '프로젝트 진행 기간 측정, 계약 기간 계산, 근무 경력 산정, 휴가 일수 계산, 마감일까지 남은 기간 확인, 월말 정산 기간 계산 등 업무와 관련된 다양한 날짜 계산에 유용합니다.' :
                   currentLang === 'ja' ? 
                    'プロジェクト進行期間測定、契約期間計算、勤務経歴算定、休暇日数計算、締切日までの残り期間確認、月末決算期間計算など業務に関連する様々な日付計算に便利です。' :
                    'Useful for various work-related date calculations such as measuring project duration, calculating contract periods, determining work experience, calculating vacation days, checking time remaining until deadlines, and calculating month-end settlement periods.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* 자주 묻는 질문 FAQ */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '자주 묻는 질문 (FAQ)' : 
               currentLang === 'ja' ? 'よくある質問 (FAQ)' : 
               'Frequently Asked Questions (FAQ)'}
            </h2>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2">
                  {currentLang === 'ko' ? 'Q. 윤년 계산이 정확하게 적용되나요?' : 
                   currentLang === 'ja' ? 'Q. うるう年計算は正確に適用されますか？' : 
                   'Q. Are leap year calculations applied accurately?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 네, 모든 윤년 규칙을 정확히 적용합니다. 4년마다 오는 윤년뿐만 아니라 100년 단위, 400년 단위 예외 규칙까지 모두 고려하여 정밀한 계산을 제공합니다.' :
                   currentLang === 'ja' ? 
                    'A. はい、すべてのうるう年ルールを正確に適用します。4年ごとのうるう年だけでなく、100年単位、400年単位の例外ルールまですべて考慮して精密な計算を提供します。' :
                    'A. Yes, all leap year rules are applied accurately. We provide precise calculations considering not only leap years every 4 years, but also exception rules for 100-year and 400-year intervals.'
                  }
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2">
                  {currentLang === 'ko' ? 'Q. 음수 결과도 표시되나요?' : 
                   currentLang === 'ja' ? 'Q. 負の数の結果も表示されますか？' : 
                   'Q. Are negative results also displayed?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 시작일이 종료일보다 늦은 경우에도 정상적으로 계산됩니다. 결과는 항상 절댓값으로 표시되며, 날짜 순서에 관계없이 두 날짜 사이의 실제 간격을 보여줍니다.' :
                   currentLang === 'ja' ? 
                    'A. 開始日が終了日より遅い場合でも正常に計算されます。結果は常に絶対値で表示され、日付順序に関係なく2つの日付間の実際の間隔を示します。' :
                    'A. Calculations work normally even when the start date is later than the end date. Results are always displayed as absolute values, showing the actual interval between two dates regardless of date order.'
                  }
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2">
                  {currentLang === 'ko' ? 'Q. 과거 날짜나 미래 날짜도 계산할 수 있나요?' : 
                   currentLang === 'ja' ? 'Q. 過去の日付や未来の日付も計算できますか？' : 
                   'Q. Can I calculate past or future dates?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 네, 과거 날짜부터 미래 날짜까지 제한 없이 계산할 수 있습니다. 역사적 사건 분석이나 미래 계획 수립 등 다양한 목적으로 활용 가능합니다.' :
                   currentLang === 'ja' ? 
                    'A. はい、過去の日付から未来の日付まで制限なく計算できます。歴史的事件分析や未来計画立案など様々な目的で活用可能です。' :
                    'A. Yes, you can calculate from past dates to future dates without restrictions. It can be used for various purposes such as historical event analysis and future planning.'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {currentLang === 'ko' ? 'Q. 모바일에서도 정상 작동하나요?' : 
                   currentLang === 'ja' ? 'Q. モバイルでも正常に動作しますか？' : 
                   'Q. Does it work properly on mobile devices?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 네, 모바일 친화적으로 설계되어 스마트폰이나 태블릿에서도 완벽하게 작동합니다. 터치 인터페이스에 최적화되어 있어 편리하게 사용할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    'A. はい、モバイルフレンドリーに設計されており、スマートフォンやタブレットでも完璧に動作します。タッチインターフェースに最適化されており、便利に使用できます。' :
                    'A. Yes, it is designed to be mobile-friendly and works perfectly on smartphones and tablets. It is optimized for touch interfaces and can be used conveniently.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* 사용 팁과 요령 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '사용 팁과 요령' : 
               currentLang === 'ja' ? '使用のコツとヒント' : 
               'Usage Tips & Tricks'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {currentLang === 'ko' ? '효율적인 사용' : 
                   currentLang === 'ja' ? '効率的な使用' : 
                   'Efficient Usage'}
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '"오늘" 버튼으로 빠른 날짜 입력' : 
                        currentLang === 'ja' ? '「今日」ボタンで素早い日付入力' : 
                        'Quick date input with "Today" button'}</li>
                  <li>• {currentLang === 'ko' ? '날짜 바꾸기 기능으로 반대 계산' : 
                        currentLang === 'ja' ? '日付交換機能で逆計算' : 
                        'Reverse calculation with date swap function'}</li>
                  <li>• {currentLang === 'ko' ? '복사 기능으로 결과 저장' : 
                        currentLang === 'ja' ? 'コピー機能で結果保存' : 
                        'Save results with copy function'}</li>
                  <li>• {currentLang === 'ko' ? '키보드 입력으로 빠른 날짜 선택' : 
                        currentLang === 'ja' ? 'キーボード入力で素早い日付選択' : 
                        'Quick date selection with keyboard input'}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {currentLang === 'ko' ? '정확성 확보' : 
                   currentLang === 'ja' ? '正確性確保' : 
                   'Ensuring Accuracy'}
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• {currentLang === 'ko' ? '날짜 형식 확인 (YYYY-MM-DD)' : 
                        currentLang === 'ja' ? '日付形式確認 (YYYY-MM-DD)' : 
                        'Check date format (YYYY-MM-DD)'}</li>
                  <li>• {currentLang === 'ko' ? '존재하지 않는 날짜 입력 주의' : 
                        currentLang === 'ja' ? '存在しない日付入力に注意' : 
                        'Be careful with non-existent date inputs'}</li>
                  <li>• {currentLang === 'ko' ? '시간대 차이 고려하기' : 
                        currentLang === 'ja' ? 'タイムゾーン差考慮' : 
                        'Consider time zone differences'}</li>
                  <li>• {currentLang === 'ko' ? '중요한 계산은 검산 권장' : 
                        currentLang === 'ja' ? '重要な計算は検算推奨' : 
                        'Recommend double-checking important calculations'}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}