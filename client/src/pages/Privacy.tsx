import { useTranslation } from 'react-i18next';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t('privacy.title')}
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.section1.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section1.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.section2.title')}
              </h2>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• {t('privacy.section2.item1')}</li>
                <li>• {t('privacy.section2.item2')}</li>
                <li>• {t('privacy.section2.item3')}</li>
                <li>• {t('privacy.section2.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.section3.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {t('privacy.section3.content')}
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• {t('privacy.section3.item1')}</li>
                <li>• {t('privacy.section3.item2')}</li>
                <li>• {t('privacy.section3.item3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.section4.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section4.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.section5.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section5.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.section6.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section6.content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.section7.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.section7.content')}
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('privacy.lastUpdated')}: {t('privacy.lastUpdatedDate')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}