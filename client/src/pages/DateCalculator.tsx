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
  const { t } = useTranslation();
  const { toast } = useToast();
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
        </div>
      </div>
    </div>
  );
}