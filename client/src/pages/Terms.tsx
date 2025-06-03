import { useTranslation } from 'react-i18next';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t('terms.title')}
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.section1.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('terms.section1.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.section2.title')}
              </h2>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• {t('terms.section2.item1')}</li>
                <li>• {t('terms.section2.item2')}</li>
                <li>• {t('terms.section2.item3')}</li>
                <li>• {t('terms.section2.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.section3.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('terms.section3.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.section4.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('terms.section4.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.section5.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('terms.section5.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.section6.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('terms.section6.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.section7.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('terms.section7.content')}
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('terms.lastUpdated')}: 2025년 6월 3일
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}