export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          🚀 Next.js on Replit 테스트 성공!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Replit 환경에서 Next.js가 완벽하게 동작합니다.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-green-600">✅ SSR/SSG</h3>
            <p className="text-gray-600 dark:text-gray-400">
              서버사이드 렌더링과 정적 사이트 생성이 모두 지원됩니다.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">⚡ 성능</h3>
            <p className="text-gray-600 dark:text-gray-400">
              최적화된 번들링과 코드 분할로 빠른 로딩 속도를 제공합니다.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-purple-600">🎨 Tailwind</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tailwind CSS와 TypeScript도 완벽하게 통합됩니다.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            빌드 시간: 9.0초 | 번들 크기: 105kB | TypeScript ✓ | ESLint ✓
          </p>
        </div>
      </main>
    </div>
  );
}