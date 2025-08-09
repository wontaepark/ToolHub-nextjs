import toolsData from '@/data/tools.json';

export interface Tool {
  id: string;
  name: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  emoji: string;
  category: string;
  isCompleted: boolean;
  migrationStatus: 'completed' | 'pending' | 'in-progress';
  renderingMode: 'SSG' | 'SSR' | 'CSR';
  features: string[];
  seoKeywords: {
    ko: string;
    en: string;
    ja: string;
  };
}

export interface ToolPage {
  id: string;
  name: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  migrationStatus: 'completed' | 'pending' | 'in-progress';
  renderingMode: 'SSG' | 'SSR' | 'CSR';
}

export interface ToolCategory {
  name: {
    ko: string;
    en: string;
    ja: string;
  };
  icon: string;
  tools: string[];
}

export type Language = 'ko' | 'en' | 'ja';

// 도구 데이터 가져오기
export const getAllTools = (): Tool[] => {
  return toolsData.tools as Tool[];
};

export const getAllPages = (): ToolPage[] => {
  return toolsData.pages as ToolPage[];
};

export const getCategories = (): Record<string, ToolCategory> => {
  return toolsData.categories as Record<string, ToolCategory>;
};

// 특정 도구 가져오기
export const getToolById = (id: string): Tool | undefined => {
  return getAllTools().find(tool => tool.id === id);
};

export const getPageById = (id: string): ToolPage | undefined => {
  return getAllPages().find(page => page.id === id);
};

// 카테고리별 도구 가져오기
export const getToolsByCategory = (category: string): Tool[] => {
  return getAllTools().filter(tool => tool.category === category);
};

// 완료된 도구만 가져오기
export const getCompletedTools = (): Tool[] => {
  return getAllTools().filter(tool => tool.isCompleted);
};

// 대기 중인 도구 가져오기
export const getPendingTools = (): Tool[] => {
  return getAllTools().filter(tool => !tool.isCompleted);
};

// 다국어 텍스트 가져오기
export const getLocalizedText = (
  textObj: { ko: string; en: string; ja: string },
  language: Language = 'ko'
): string => {
  return textObj[language] || textObj.ko;
};

// 도구 검색
export const searchTools = (query: string, language: Language = 'ko'): Tool[] => {
  const lowercaseQuery = query.toLowerCase();
  
  return getAllTools().filter(tool => {
    const name = getLocalizedText(tool.name, language).toLowerCase();
    const description = getLocalizedText(tool.description, language).toLowerCase();
    const keywords = getLocalizedText(tool.seoKeywords, language).toLowerCase();
    
    return name.includes(lowercaseQuery) || 
           description.includes(lowercaseQuery) || 
           keywords.includes(lowercaseQuery);
  });
};

// 관련 도구 추천
export const getRelatedTools = (currentToolId: string, limit: number = 4): Tool[] => {
  const currentTool = getToolById(currentToolId);
  if (!currentTool) return [];

  // 같은 카테고리의 다른 도구들을 우선으로 추천
  const sameCategoryTools = getToolsByCategory(currentTool.category)
    .filter(tool => tool.id !== currentToolId && tool.isCompleted);

  // 같은 카테고리에 충분한 도구가 없으면 다른 카테고리에서도 가져오기
  if (sameCategoryTools.length < limit) {
    const otherTools = getCompletedTools()
      .filter(tool => tool.id !== currentToolId && tool.category !== currentTool.category);
    
    return [...sameCategoryTools, ...otherTools].slice(0, limit);
  }

  return sameCategoryTools.slice(0, limit);
};

// 도구 URL 생성
export const getToolUrl = (toolId: string): string => {
  return `/tools/${toolId}`;
};

export const getPageUrl = (pageId: string): string => {
  return `/${pageId}`;
};

// 도구 통계
export const getToolStats = () => {
  const allTools = getAllTools();
  const completedTools = getCompletedTools();
  const categories = getCategories();
  
  return {
    total: allTools.length,
    completed: completedTools.length,
    pending: allTools.length - completedTools.length,
    categories: Object.keys(categories).length,
    completionRate: Math.round((completedTools.length / allTools.length) * 100)
  };
};

// 카테고리별 통계
export const getCategoryStats = () => {
  const categories = getCategories();
  const stats: Record<string, { total: number; completed: number }> = {};
  
  Object.keys(categories).forEach(categoryId => {
    const categoryTools = getToolsByCategory(categoryId);
    const completedCategoryTools = categoryTools.filter(tool => tool.isCompleted);
    
    stats[categoryId] = {
      total: categoryTools.length,
      completed: completedCategoryTools.length
    };
  });
  
  return stats;
};

// SEO 메타데이터 생성
export const generateToolMetadata = (toolId: string, language: Language = 'ko') => {
  const tool = getToolById(toolId);
  if (!tool) return null;
  
  const name = getLocalizedText(tool.name, language);
  const description = getLocalizedText(tool.description, language);
  const keywords = getLocalizedText(tool.seoKeywords, language);
  
  return {
    title: `${name} | ToolHub.tools`,
    description,
    keywords,
    openGraph: {
      title: `${name} | ToolHub.tools`,
      description,
      url: `https://toolhub.tools${getToolUrl(toolId)}`,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | ToolHub.tools`,
      description
    }
  };
};

// 도구 유효성 검사
export const isValidToolId = (id: string): boolean => {
  return getAllTools().some(tool => tool.id === id);
};

export const isValidPageId = (id: string): boolean => {
  return getAllPages().some(page => page.id === id);
};

// 마이그레이션 상태 관리
export const getMigrationProgress = () => {
  const allItems = [...getAllTools(), ...getAllPages()];
  const completed = allItems.filter(item => item.migrationStatus === 'completed').length;
  const inProgress = allItems.filter(item => item.migrationStatus === 'in-progress').length;
  const pending = allItems.filter(item => item.migrationStatus === 'pending').length;
  
  return {
    total: allItems.length,
    completed,
    inProgress,
    pending,
    completionRate: Math.round((completed / allItems.length) * 100)
  };
};