import { notFound } from 'next/navigation';
import { getToolById, getAllTools, generateToolMetadata } from '@/lib/tools';
import type { Metadata } from 'next';

// 정적 생성을 위한 매개변수 생성
export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.id,
  }));
}

// 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const metadata = generateToolMetadata(slug);
  
  if (!metadata) {
    return {
      title: 'Tool Not Found | ToolHub.tools',
      description: 'The requested tool could not be found.'
    };
  }
  
  return metadata;
}

// 동적 도구 페이지 컴포넌트
export default async function DynamicToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolById(slug);
  
  if (!tool) {
    notFound();
  }

  // 도구별로 다른 컴포넌트를 렌더링
  const renderToolComponent = () => {
    switch (slug) {
      case 'pomodoro':
        // 포모도로 타이머는 이미 구현됨
        return <div>포모도로 타이머는 /tools/pomodoro 경로를 사용하세요.</div>;
      case 'mbti':
        // MBTI 테스트는 이미 구현됨
        return <div>MBTI 테스트는 /tools/mbti 경로를 사용하세요.</div>;
      case 'teto-egen':
        // 테토-에겐 테스트는 이미 구현됨
        return <div>테토-에겐 테스트는 /tools/teto-egen 경로를 사용하세요.</div>;
      default:
        return (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{tool.emoji}</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {tool.name.ko}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {tool.description.ko}
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                🚧 곧 출시됩니다!
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                이 도구는 현재 개발 중입니다. 곧 만나볼 수 있도록 열심히 준비하고 있어요!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderToolComponent()}
      </div>
    </div>
  );
}