export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  canonical: string;
  hreflang: Array<{ lang: string; href: string }>;
  structuredData?: any;
}

export interface ToolSEOData {
  id: string;
  metadata: {
    ko: SEOMetadata;
    en: SEOMetadata;
    ja: SEOMetadata;
    zh: SEOMetadata;
    es: SEOMetadata;
    fr: SEOMetadata;
    de: SEOMetadata;
    ru: SEOMetadata;
  };
}

// 도구별 SEO 메타데이터
export const toolsSEOData: ToolSEOData[] = [

  {
    id: 'pomodoro',
    metadata: {
      ko: {
        title: '포모도로 타이머 | 집중력 향상 도구 - ToolHub.tools',
        description: '무료 포모도로 타이머로 생산성을 높이세요. 25분 집중 + 5분 휴식으로 효율적인 시간 관리를 경험하세요.',
        keywords: ['포모도로 타이머', '집중력', '생산성', '시간관리', '공부 타이머', '업무 효율', '포모도로 테크닉'],
        ogTitle: '포모도로 타이머 - 집중력 향상 도구',
        ogDescription: '25분 집중 + 5분 휴식으로 생산성 극대화. 무료 포모도로 타이머.',
        canonical: 'https://toolhub.tools/pomodoro',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/pomodoro?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/pomodoro?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/pomodoro?lang=ja' }
        ]
      },
      en: {
        title: 'Pomodoro Timer | Focus & Productivity Tool - ToolHub.tools',
        description: 'Boost productivity with our free Pomodoro timer. Experience efficient time management with 25min focus + 5min break cycles.',
        keywords: ['pomodoro timer', 'focus', 'productivity', 'time management', 'study timer', 'work efficiency', 'pomodoro technique'],
        ogTitle: 'Pomodoro Timer - Focus & Productivity Tool',
        ogDescription: 'Maximize productivity with 25min focus + 5min break cycles. Free Pomodoro timer.',
        canonical: 'https://toolhub.tools/pomodoro',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/pomodoro?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/pomodoro?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/pomodoro?lang=ja' }
        ]
      },
      ja: {
        title: 'ポモドーロタイマー | 集中力・生産性向上ツール - ToolHub.tools',
        description: '無料ポモドーロタイマーで生産性を向上させましょう。25分集中+5分休憩で効率的な時間管理を体験してください。',
        keywords: ['ポモドーロタイマー', '集中力', '生産性', '時間管理', '勉強タイマー', '作業効率', 'ポモドーロテクニック'],
        ogTitle: 'ポモドーロタイマー - 集中力向上ツール',
        ogDescription: '25分集中+5分休憩で生産性最大化。無料ポモドーロタイマー。',
        canonical: 'https://toolhub.tools/pomodoro',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/pomodoro?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/pomodoro?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/pomodoro?lang=ja' }
        ]
      },
      zh: {
        title: '番茄工作法定时器 | 专注力提升工具 - ToolHub.tools',
        description: '使用免费番茄工作法定时器提高生产力。25分钟专注+5分钟休息，体验高效时间管理。',
        keywords: ['番茄工作法', '专注力', '生产力', '时间管理', '学习定时器', '工作效率', '番茄技术'],
        ogTitle: '番茄工作法定时器 - 专注力提升工具',
        ogDescription: '25分钟专注+5分钟休息最大化生产力。免费番茄工作法定时器。',
        canonical: 'https://toolhub.tools/pomodoro',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/pomodoro?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/pomodoro?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/pomodoro?lang=ja' }
        ]
      },
      es: {
        title: 'Temporizador Pomodoro | Herramienta de Concentración - ToolHub.tools',
        description: 'Aumenta la productividad con nuestro temporizador Pomodoro gratuito. 25min enfoque + 5min descanso para gestión eficiente del tiempo.',
        keywords: ['temporizador pomodoro', 'concentración', 'productividad', 'gestión del tiempo', 'temporizador de estudio', 'eficiencia laboral', 'técnica pomodoro'],
        ogTitle: 'Temporizador Pomodoro - Herramienta de Concentración',
        ogDescription: 'Maximiza productividad con ciclos de 25min enfoque + 5min descanso. Temporizador Pomodoro gratuito.',
        canonical: 'https://toolhub.tools/pomodoro',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/pomodoro?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/pomodoro?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/pomodoro?lang=ja' }
        ]
      },
      fr: {
        title: 'Minuteur Pomodoro | Outil de Concentration - ToolHub.tools',
        description: 'Augmentez la productivité avec notre minuteur Pomodoro gratuit. 25min concentration + 5min pause pour une gestion efficace du temps.',
        keywords: ['minuteur pomodoro', 'concentration', 'productivité', 'gestion du temps', 'minuteur d\'étude', 'efficacité au travail', 'technique pomodoro'],
        ogTitle: 'Minuteur Pomodoro - Outil de Concentration',
        ogDescription: 'Maximisez la productivité avec des cycles de 25min concentration + 5min pause. Minuteur Pomodoro gratuit.',
        canonical: 'https://toolhub.tools/pomodoro',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/pomodoro?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/pomodoro?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/pomodoro?lang=ja' }
        ]
      },
      de: {
        title: 'Pomodoro Timer | Konzentrations-Tool - ToolHub.tools',
        description: 'Steigern Sie die Produktivität mit unserem kostenlosen Pomodoro Timer. 25min Fokus + 5min Pause für effizientes Zeitmanagement.',
        keywords: ['pomodoro timer', 'konzentration', 'produktivität', 'zeitmanagement', 'lerntimer', 'arbeitseffizienz', 'pomodoro technik'],
        ogTitle: 'Pomodoro Timer - Konzentrations-Tool',
        ogDescription: 'Maximieren Sie Produktivität mit 25min Fokus + 5min Pause Zyklen. Kostenloser Pomodoro Timer.',
        canonical: 'https://toolhub.tools/pomodoro',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/pomodoro?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/pomodoro?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/pomodoro?lang=ja' }
        ]
      },
      ru: {
        title: 'Помодоро Таймер | Инструмент Концентрации - ToolHub.tools',
        description: 'Повысьте продуктивность с бесплатным таймером Помодоро. 25мин фокус + 5мин отдых для эффективного управления временем.',
        keywords: ['помодоро таймер', 'концентрация', 'продуктивность', 'управление временем', 'таймер для учебы', 'рабочая эффективность', 'техника помодоро'],
        ogTitle: 'Помодоро Таймер - Инструмент Концентрации',
        ogDescription: 'Максимизируйте продуктивность циклами 25мин фокус + 5мин отдых. Бесплатный таймер Помодоро.',
        canonical: 'https://toolhub.tools/pomodoro',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/pomodoro?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/pomodoro?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/pomodoro?lang=ja' }
        ]
      }
    }
  },
  {
    id: 'password',
    metadata: {
      ko: {
        title: '안전한 비밀번호 생성기 | 강력한 패스워드 만들기 - ToolHub.tools',
        description: '강력하고 안전한 비밀번호를 무료로 생성하세요. 맞춤형 옵션으로 해킹 방지용 랜덤 패스워드를 만들어보세요.',
        keywords: ['비밀번호 생성기', '패스워드 생성', '안전한 비밀번호', '강력한 패스워드', '랜덤 비밀번호', '보안 도구', '해킹 방지'],
        ogTitle: '안전한 비밀번호 생성기 - 강력한 패스워드',
        ogDescription: '해킹 방지용 강력한 비밀번호를 무료로 생성. 맞춤형 보안 옵션 제공.',
        canonical: 'https://toolhub.tools/password',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/password?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/password?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/password?lang=ja' }
        ]
      },
      en: {
        title: 'Secure Password Generator | Strong Password Creator - ToolHub.tools',
        description: 'Generate strong and secure passwords for free. Create hack-proof random passwords with customizable security options.',
        keywords: ['password generator', 'password creator', 'secure password', 'strong password', 'random password', 'security tool', 'hack proof'],
        ogTitle: 'Secure Password Generator - Strong Passwords',
        ogDescription: 'Generate hack-proof strong passwords for free. Customizable security options available.',
        canonical: 'https://toolhub.tools/password',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/password?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/password?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/password?lang=ja' }
        ]
      },
      ja: {
        title: '安全なパスワード生成器 | 強力なパスワード作成 - ToolHub.tools',
        description: '強力で安全なパスワードを無料で生成します。カスタマイズ可能なオプションでハッキング防止用ランダムパスワードを作成。',
        keywords: ['パスワード生成器', 'パスワード作成', '安全なパスワード', '強力なパスワード', 'ランダムパスワード', 'セキュリティツール', 'ハッキング防止'],
        ogTitle: '安全なパスワード生成器 - 強力なパスワード',
        ogDescription: 'ハッキング防止用強力パスワードを無料生成。カスタマイズ可能なセキュリティオプション。',
        canonical: 'https://toolhub.tools/password',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/password?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/password?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/password?lang=ja' }
        ]
      },
      zh: {
        title: '安全密码生成器 | 强密码创建工具 - ToolHub.tools',
        description: '免费生成强安全密码。使用可定制选项创建防黑客随机密码。',
        keywords: ['密码生成器', '密码创建', '安全密码', '强密码', '随机密码', '安全工具', '防黑客'],
        ogTitle: '安全密码生成器 - 强密码工具',
        ogDescription: '免费生成防黑客强密码。提供可定制安全选项。',
        canonical: 'https://toolhub.tools/password',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/password?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/password?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/password?lang=ja' }
        ]
      },
      es: {
        title: 'Generador de Contraseñas Seguras | Creador de Passwords - ToolHub.tools',
        description: 'Genere contraseñas fuertes y seguras gratis. Cree passwords aleatorias a prueba de hackers con opciones personalizables.',
        keywords: ['generador de contraseñas', 'creador de passwords', 'contraseña segura', 'contraseña fuerte', 'contraseña aleatoria', 'herramienta de seguridad', 'a prueba de hackers'],
        ogTitle: 'Generador de Contraseñas Seguras - Passwords Fuertes',
        ogDescription: 'Genere contraseñas fuertes a prueba de hackers gratis. Opciones de seguridad personalizables.',
        canonical: 'https://toolhub.tools/password',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/password?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/password?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/password?lang=ja' }
        ]
      },
      fr: {
        title: 'Générateur de Mots de Passe Sécurisés | Créateur - ToolHub.tools',
        description: 'Générez des mots de passe forts et sécurisés gratuitement. Créez des mots de passe aléatoires anti-piratage avec options personnalisables.',
        keywords: ['générateur de mot de passe', 'créateur de mot de passe', 'mot de passe sécurisé', 'mot de passe fort', 'mot de passe aléatoire', 'outil de sécurité', 'anti-piratage'],
        ogTitle: 'Générateur de Mots de Passe Sécurisés - Mots de Passe Forts',
        ogDescription: 'Générez des mots de passe forts anti-piratage gratuitement. Options de sécurité personnalisables.',
        canonical: 'https://toolhub.tools/password',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/password?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/password?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/password?lang=ja' }
        ]
      },
      de: {
        title: 'Sicherer Passwort-Generator | Starke Passwörter - ToolHub.tools',
        description: 'Generieren Sie starke und sichere Passwörter kostenlos. Erstellen Sie hack-sichere zufällige Passwörter mit anpassbaren Optionen.',
        keywords: ['passwort generator', 'passwort ersteller', 'sicheres passwort', 'starkes passwort', 'zufälliges passwort', 'sicherheitstool', 'hack-sicher'],
        ogTitle: 'Sicherer Passwort-Generator - Starke Passwörter',
        ogDescription: 'Generieren Sie hack-sichere starke Passwörter kostenlos. Anpassbare Sicherheitsoptionen verfügbar.',
        canonical: 'https://toolhub.tools/password',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/password?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/password?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/password?lang=ja' }
        ]
      },
      ru: {
        title: 'Генератор Безопасных Паролей | Создатель Паролей - ToolHub.tools',
        description: 'Генерируйте сильные и безопасные пароли бесплатно. Создавайте защищенные от взлома случайные пароли с настраиваемыми опциями.',
        keywords: ['генератор паролей', 'создатель паролей', 'безопасный пароль', 'сильный пароль', 'случайный пароль', 'инструмент безопасности', 'защита от взлома'],
        ogTitle: 'Генератор Безопасных Паролей - Сильные Пароли',
        ogDescription: 'Генерируйте защищенные от взлома сильные пароли бесплатно. Настраиваемые опции безопасности.',
        canonical: 'https://toolhub.tools/password',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/password?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/password?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/password?lang=ja' }
        ]
      }
    }
  },
  {
    id: 'mbti',
    metadata: {
      ko: {
        title: 'MBTI 성격유형 테스트 | 16가지 성격 분석 - ToolHub.tools',
        description: '무료 MBTI 성격유형 테스트로 당신의 성격을 알아보세요. 16가지 성격유형 중 나의 MBTI는? 정확한 심리 분석 제공.',
        keywords: ['MBTI 테스트', 'MBTI 성격유형', '16가지 성격', '성격 분석', '심리테스트', 'MBTI 검사', '무료 성격테스트', '성격유형 진단'],
        ogTitle: 'MBTI 성격유형 테스트 - 16가지 성격 분석',
        ogDescription: '나의 MBTI 성격유형을 알아보는 무료 테스트. 정확한 16가지 성격 분석 결과 제공.',
        canonical: 'https://toolhub.tools/mbti',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/mbti?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/mbti?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/mbti?lang=ja' }
        ]
      },
      en: {
        title: 'MBTI Personality Test | 16 Personality Types Analysis - ToolHub.tools',
        description: 'Discover your personality with our free MBTI personality test. Which of 16 personality types are you? Accurate psychological analysis provided.',
        keywords: ['MBTI test', 'MBTI personality', '16 personalities', 'personality analysis', 'psychological test', 'MBTI assessment', 'free personality test', 'personality type diagnosis'],
        ogTitle: 'MBTI Personality Test - 16 Personality Types',
        ogDescription: 'Free MBTI test to discover your personality type. Accurate 16 personality analysis results provided.',
        canonical: 'https://toolhub.tools/mbti',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/mbti?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/mbti?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/mbti?lang=ja' }
        ]
      },
      ja: {
        title: 'MBTI性格タイプテスト | 16の性格分析 - ToolHub.tools',
        description: '無料MBTI性格タイプテストであなたの性格を知りましょう。16の性格タイプの中で私のMBTIは？正確な心理分析を提供。',
        keywords: ['MBTIテスト', 'MBTI性格タイプ', '16の性格', '性格分析', '心理テスト', 'MBTI検査', '無料性格テスト', '性格タイプ診断'],
        ogTitle: 'MBTI性格タイプテスト - 16の性格分析',
        ogDescription: '私のMBTI性格タイプを知る無料テスト。正確な16の性格分析結果を提供。',
        canonical: 'https://toolhub.tools/mbti',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/mbti?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/mbti?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/mbti?lang=ja' }
        ]
      },
      zh: {
        title: 'MBTI人格类型测试 | 16种人格分析 - ToolHub.tools',
        description: '通过免费MBTI人格类型测试了解您的性格。16种人格类型中您是哪一种？提供准确的心理分析。',
        keywords: ['MBTI测试', 'MBTI人格类型', '16种人格', '性格分析', '心理测试', 'MBTI评估', '免费性格测试', '人格类型诊断'],
        ogTitle: 'MBTI人格类型测试 - 16种人格分析',
        ogDescription: '了解我的MBTI人格类型的免费测试。提供准确的16种人格分析结果。',
        canonical: 'https://toolhub.tools/mbti',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/mbti?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/mbti?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/mbti?lang=ja' }
        ]
      },
      es: {
        title: 'Test de Personalidad MBTI | Análisis 16 Personalidades - ToolHub.tools',
        description: 'Descubre tu personalidad con nuestro test MBTI gratuito. ¿Cuál de los 16 tipos de personalidad eres? Análisis psicológico preciso.',
        keywords: ['test MBTI', 'personalidad MBTI', '16 personalidades', 'análisis de personalidad', 'test psicológico', 'evaluación MBTI', 'test gratuito personalidad', 'diagnóstico tipo personalidad'],
        ogTitle: 'Test de Personalidad MBTI - 16 Tipos de Personalidad',
        ogDescription: 'Test MBTI gratuito para descubrir tu tipo de personalidad. Resultados precisos de análisis de 16 personalidades.',
        canonical: 'https://toolhub.tools/mbti',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/mbti?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/mbti?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/mbti?lang=ja' }
        ]
      },
      fr: {
        title: 'Test de Personnalité MBTI | Analyse 16 Personnalités - ToolHub.tools',
        description: 'Découvrez votre personnalité avec notre test MBTI gratuit. Lequel des 16 types de personnalité êtes-vous? Analyse psychologique précise.',
        keywords: ['test MBTI', 'personnalité MBTI', '16 personnalités', 'analyse de personnalité', 'test psychologique', 'évaluation MBTI', 'test gratuit personnalité', 'diagnostic type personnalité'],
        ogTitle: 'Test de Personnalité MBTI - 16 Types de Personnalité',
        ogDescription: 'Test MBTI gratuit pour découvrir votre type de personnalité. Résultats précis d\'analyse de 16 personnalités.',
        canonical: 'https://toolhub.tools/mbti',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/mbti?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/mbti?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/mbti?lang=ja' }
        ]
      },
      de: {
        title: 'MBTI Persönlichkeitstest | 16 Persönlichkeits-Analyse - ToolHub.tools',
        description: 'Entdecken Sie Ihre Persönlichkeit mit unserem kostenlosen MBTI-Test. Welcher der 16 Persönlichkeitstypen sind Sie? Präzise psychologische Analyse.',
        keywords: ['MBTI test', 'MBTI persönlichkeit', '16 persönlichkeiten', 'persönlichkeitsanalyse', 'psychologischer test', 'MBTI bewertung', 'kostenloser persönlichkeitstest', 'persönlichkeitstyp diagnose'],
        ogTitle: 'MBTI Persönlichkeitstest - 16 Persönlichkeitstypen',
        ogDescription: 'Kostenloser MBTI-Test zur Entdeckung Ihres Persönlichkeitstyps. Präzise Analyseergebnisse für 16 Persönlichkeiten.',
        canonical: 'https://toolhub.tools/mbti',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/mbti?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/mbti?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/mbti?lang=ja' }
        ]
      },
      ru: {
        title: 'Тест Личности MBTI | Анализ 16 Типов Личности - ToolHub.tools',
        description: 'Откройте свою личность с помощью бесплатного теста MBTI. Какой из 16 типов личности вы? Точный психологический анализ.',
        keywords: ['тест MBTI', 'личность MBTI', '16 личностей', 'анализ личности', 'психологический тест', 'оценка MBTI', 'бесплатный тест личности', 'диагностика типа личности'],
        ogTitle: 'Тест Личности MBTI - 16 Типов Личности',
        ogDescription: 'Бесплатный тест MBTI для открытия вашего типа личности. Точные результаты анализа 16 личностей.',
        canonical: 'https://toolhub.tools/mbti',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/mbti?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/mbti?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/mbti?lang=ja' }
        ]
      }
    }
  },
  {
    id: 'teto-egen',
    metadata: {
      ko: {
        title: '테토-에겐 성격유형 테스트 | 바이럴 성격 분석 - ToolHub.tools',
        description: '화제의 테토-에겐 성격유형 테스트! 당신은 테토형인가요, 에겐형인가요? 연애 스타일과 궁합까지 분석해드립니다.',
        keywords: ['테토-에겐 테스트', '테토에겐', '성격테스트', '바이럴 테스트', '연애 성향', '궁합 분석', '성격유형', '밈 테스트'],
        ogTitle: '테토-에겐 성격유형 테스트 - 바이럴 성격 분석',
        ogDescription: '화제의 테토-에겐 테스트로 나의 성격과 연애 스타일을 알아보세요. 궁합 분석까지!',
        canonical: 'https://toolhub.tools/teto-egen-test',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/teto-egen-test?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/teto-egen-test?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/teto-egen-test?lang=ja' }
        ]
      },
      en: {
        title: 'Teto-Egen Personality Test | Viral Personality Analysis - ToolHub.tools',
        description: 'Trending Teto-Egen personality test! Are you a Teto type or Egen type? Analyze your love style and compatibility too.',
        keywords: ['teto-egen test', 'teto egen', 'personality test', 'viral test', 'love style', 'compatibility analysis', 'personality type', 'meme test'],
        ogTitle: 'Teto-Egen Personality Test - Viral Analysis',
        ogDescription: 'Discover your personality and love style with the trending Teto-Egen test. Compatibility analysis included!',
        canonical: 'https://toolhub.tools/teto-egen-test',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/teto-egen-test?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/teto-egen-test?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/teto-egen-test?lang=ja' }
        ]
      },
      ja: {
        title: 'テト-エゲン性格タイプテスト | バイラル性格分析 - ToolHub.tools',
        description: '話題のテト-エゲン性格タイプテスト！あなたはテトタイプ？エゲンタイプ？恋愛スタイルと相性まで分析します。',
        keywords: ['テト-エゲンテスト', 'テトエゲン', '性格テスト', 'バイラルテスト', '恋愛傾向', '相性分析', '性格タイプ', 'ミームテスト'],
        ogTitle: 'テト-エゲン性格タイプテスト - バイラル分析',
        ogDescription: '話題のテト-エゲンテストで私の性格と恋愛スタイルを知りましょう。相性分析まで！',
        canonical: 'https://toolhub.tools/teto-egen-test',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/teto-egen-test?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/teto-egen-test?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/teto-egen-test?lang=ja' }
        ]
      },
      zh: {
        title: 'Teto-Egen人格类型测试 | 病毒式人格分析 - ToolHub.tools',
        description: '热门的Teto-Egen人格类型测试！您是Teto类型还是Egen类型？还分析您的恋爱风格和兼容性。',
        keywords: ['teto-egen测试', 'teto egen', '人格测试', '病毒式测试', '恋爱风格', '兼容性分析', '人格类型', '表情包测试'],
        ogTitle: 'Teto-Egen人格类型测试 - 病毒式分析',
        ogDescription: '通过热门的Teto-Egen测试了解您的人格和恋爱风格。包含兼容性分析！',
        canonical: 'https://toolhub.tools/teto-egen-test',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/teto-egen-test?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/teto-egen-test?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/teto-egen-test?lang=ja' }
        ]
      },
      es: {
        title: 'Test de Personalidad Teto-Egen | Análisis Viral - ToolHub.tools',
        description: '¡Test de personalidad Teto-Egen en tendencia! ¿Eres tipo Teto o tipo Egen? Analiza tu estilo amoroso y compatibilidad también.',
        keywords: ['test teto-egen', 'teto egen', 'test de personalidad', 'test viral', 'estilo amoroso', 'análisis compatibilidad', 'tipo personalidad', 'test meme'],
        ogTitle: 'Test de Personalidad Teto-Egen - Análisis Viral',
        ogDescription: 'Descubre tu personalidad y estilo amoroso con el test Teto-Egen en tendencia. ¡Análisis de compatibilidad incluido!',
        canonical: 'https://toolhub.tools/teto-egen-test',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/teto-egen-test?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/teto-egen-test?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/teto-egen-test?lang=ja' }
        ]
      },
      fr: {
        title: 'Test de Personnalité Teto-Egen | Analyse Virale - ToolHub.tools',
        description: 'Test de personnalité Teto-Egen tendance ! Êtes-vous type Teto ou type Egen ? Analysez aussi votre style amoureux et compatibilité.',
        keywords: ['test teto-egen', 'teto egen', 'test de personnalité', 'test viral', 'style amoureux', 'analyse compatibilité', 'type personnalité', 'test mème'],
        ogTitle: 'Test de Personnalité Teto-Egen - Analyse Virale',
        ogDescription: 'Découvrez votre personnalité et style amoureux avec le test Teto-Egen tendance. Analyse de compatibilité incluse !',
        canonical: 'https://toolhub.tools/teto-egen-test',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/teto-egen-test?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/teto-egen-test?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/teto-egen-test?lang=ja' }
        ]
      },
      de: {
        title: 'Teto-Egen Persönlichkeitstest | Virale Analyse - ToolHub.tools',
        description: 'Trendiger Teto-Egen Persönlichkeitstest! Sind Sie Teto-Typ oder Egen-Typ? Analysieren Sie auch Ihren Liebesstil und Kompatibilität.',
        keywords: ['teto-egen test', 'teto egen', 'persönlichkeitstest', 'viraler test', 'liebesstil', 'kompatibilitätsanalyse', 'persönlichkeitstyp', 'meme test'],
        ogTitle: 'Teto-Egen Persönlichkeitstest - Virale Analyse',
        ogDescription: 'Entdecken Sie Ihre Persönlichkeit und Liebesstil mit dem trendigen Teto-Egen Test. Kompatibilitätsanalyse inklusive!',
        canonical: 'https://toolhub.tools/teto-egen-test',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/teto-egen-test?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/teto-egen-test?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/teto-egen-test?lang=ja' }
        ]
      },
      ru: {
        title: 'Тест Личности Тето-Эген | Вирусный Анализ - ToolHub.tools',
        description: 'Трендовый тест личности Тето-Эген! Вы тип Тето или тип Эген? Анализируйте также свой стиль любви и совместимость.',
        keywords: ['тест тето-эген', 'тето эген', 'тест личности', 'вирусный тест', 'стиль любви', 'анализ совместимости', 'тип личности', 'мем тест'],
        ogTitle: 'Тест Личности Тето-Эген - Вирусный Анализ',
        ogDescription: 'Откройте свою личность и стиль любви с трендовым тестом Тето-Эген. Анализ совместимости включен!',
        canonical: 'https://toolhub.tools/teto-egen-test',
        hreflang: [
          { lang: 'ko', href: 'https://toolhub.tools/teto-egen-test?lang=ko' },
          { lang: 'en', href: 'https://toolhub.tools/teto-egen-test?lang=en' },
          { lang: 'ja', href: 'https://toolhub.tools/teto-egen-test?lang=ja' }
        ]
      }
    }
  }
];

// 언어별 메인 페이지 SEO 데이터
export const mainPageSEO = {
  ko: {
    title: 'ToolHub.tools | 무료 온라인 도구 모음 - 계산기, 타이머, 성격테스트',
    description: 'ToolHub.tools에서 계산기, 포모도로 타이머, 비밀번호 생성기, MBTI 테스트 등 유용한 온라인 도구를 무료로 사용하세요. 모든 기기에서 바로 실행 가능합니다.',
    keywords: ['온라인 도구', '무료 도구', '웹 도구', '계산기', '타이머', 'MBTI 테스트', '비밀번호 생성기', '유틸리티', '생산성 도구'],
    ogTitle: 'ToolHub.tools - 무료 온라인 도구 모음',
    ogDescription: '계산기부터 성격테스트까지, 일상에 필요한 모든 도구를 한 곳에서. 무료, 빠름, 간편함.',
    canonical: 'https://toolhub.tools/'
  },
  en: {
    title: 'ToolHub.tools | Free Online Tools Collection - Calculator, Timer, Tests',
    description: 'Use useful online tools like calculator, pomodoro timer, password generator, MBTI test for free at ToolHub.tools. Ready to run on all devices.',
    keywords: ['online tools', 'free tools', 'web tools', 'calculator', 'timer', 'MBTI test', 'password generator', 'utilities', 'productivity tools'],
    ogTitle: 'ToolHub.tools - Free Online Tools Collection',
    ogDescription: 'From calculators to personality tests, all essential tools in one place. Free, fast, simple.',
    canonical: 'https://toolhub.tools/'
  },
  ja: {
    title: 'ToolHub.tools | 無料オンラインツール集 - 電卓、タイマー、テスト',
    description: 'ToolHub.toolsで電卓、ポモドーロタイマー、パスワード生成器、MBTIテストなど便利なオンラインツールを無料で使用。全デバイスですぐに実行可能。',
    keywords: ['オンラインツール', '無料ツール', 'ウェブツール', '電卓', 'タイマー', 'MBTIテスト', 'パスワード生成器', 'ユーティリティ', '生産性ツール'],
    ogTitle: 'ToolHub.tools - 無料オンラインツール集',
    ogDescription: '電卓から性格テストまで、日常に必要な全ツールを一箇所で。無料、高速、簡単。',
    canonical: 'https://toolhub.tools/'
  }
};

// 구조화된 데이터 생성 함수
export function generateStructuredData(toolId: string, language: string): any {
  const tool = toolsSEOData.find(t => t.id === toolId);
  if (!tool) return null;

  const metadata = tool.metadata[language as keyof typeof tool.metadata];
  
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": metadata.title,
    "description": metadata.description,
    "url": metadata.canonical,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "permissions": "browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "ToolHub.tools"
    },
    "keywords": metadata.keywords.join(", ")
  };
}

// SEO 메타데이터를 가져오는 함수
export function getSEOMetadata(toolId?: string, language: string = 'ko'): SEOMetadata {
  if (!toolId) {
    // 메인 페이지
    const mainSEO = mainPageSEO[language as keyof typeof mainPageSEO] || mainPageSEO.ko;
    return {
      ...mainSEO,
      keywords: [],
      hreflang: [
        { lang: 'ko', href: 'https://toolhub.tools/?lang=ko' },
        { lang: 'en', href: 'https://toolhub.tools/?lang=en' },
        { lang: 'ja', href: 'https://toolhub.tools/?lang=ja' }
      ]
    };
  }

  const tool = toolsSEOData.find(t => t.id === toolId);
  if (!tool) {
    return getSEOMetadata(undefined, language);
  }

  const metadata = tool.metadata[language as keyof typeof tool.metadata];
  return {
    ...metadata,
    structuredData: generateStructuredData(toolId, language)
  };
}