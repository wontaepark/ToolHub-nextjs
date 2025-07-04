import fs from "fs";
import path from "path";

// 기본 SSR 페이지 콘텐츠 생성
export function generateStaticHTML(url: string, lang: string = 'ko'): string {
  const baseTitle = "ToolHub.tools - 간편하고 강력한 웹 도구 모음";
  const baseDescription = "포모도로 타이머, 번호 추첨기, 유튜브 썸네일 다운로더, 비밀번호 생성기, 단위 변환기, 날짜 계산기 등 일상과 업무에 필요한 웹 도구를 한 곳에 모은 무료 서비스입니다.";

  // 페이지별 메타데이터 설정
  const pageMetadata = getPageMetadata(url, lang);
  
  // 기본 HTML 구조 생성
  const staticContent = generatePageContent(url, lang);
  
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-KWT7R5SCPD"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-KWT7R5SCPD");
    </script>

    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageMetadata.title}</title>
    <meta name="description" content="${pageMetadata.description}" />
    <meta name="keywords" content="${pageMetadata.keywords}" />
    <meta name="author" content="ToolHub Team" />
    <meta name="google-site-verification" content="WgkXO34MHVi2ZTxj0Xw9L8x9ufgY3Y09rTGUXv6lt10" />

    <!-- Open Graph -->
    <meta property="og:title" content="${pageMetadata.title}" />
    <meta property="og:description" content="${pageMetadata.description}" />
    <meta property="og:image" content="https://toolhub.tools/og-image.png" />
    <meta property="og:url" content="https://toolhub.tools${url}" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageMetadata.title}" />
    <meta name="twitter:description" content="${pageMetadata.description}" />
    <meta name="twitter:image" content="https://toolhub.tools/og-image.png" />

    <!-- 구조화된 데이터 -->
    <script type="application/ld+json">
      ${JSON.stringify(pageMetadata.structuredData)}
    </script>

    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5553606229740788" crossorigin="anonymous"></script>
    
    <!-- 초기 스타일링 -->
    <style>
      body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #ffffff; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .header { background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
      .nav { display: flex; justify-content: space-between; align-items: center; }
      .logo { font-size: 1.5rem; font-weight: bold; color: #1f2937; }
      .main-content { padding: 2rem 0; min-height: 60vh; }
      .tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
      .tool-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; }
      .tool-title { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem; }
      .tool-description { color: #6b7280; font-size: 0.875rem; }
      .hero { text-align: center; margin-bottom: 3rem; }
      .hero h1 { font-size: 2.5rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem; }
      .hero p { font-size: 1.125rem; color: #6b7280; max-width: 600px; margin: 0 auto; }
      .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 2rem 0; margin-top: 3rem; text-align: center; }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="header">
        <div class="container">
          <nav class="nav">
            <div class="logo">ToolHub.tools</div>
            <div>
              <a href="/" style="margin-right: 1rem; text-decoration: none; color: #6b7280;">홈</a>
              <a href="/sitemap" style="margin-right: 1rem; text-decoration: none; color: #6b7280;">사이트맵</a>
              <a href="/contact" style="text-decoration: none; color: #6b7280;">문의하기</a>
            </div>
          </nav>
        </div>
      </div>
      
      <main class="main-content">
        <div class="container">
          ${staticContent}
        </div>
      </main>
      
      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 ToolHub.tools. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
    
    <!-- React 앱 로드 -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

// 페이지별 메타데이터 생성
function getPageMetadata(url: string, lang: string) {
  const baseData = {
    title: "ToolHub.tools - 간편하고 강력한 웹 도구 모음",
    description: "포모도로 타이머, 번호 추첨기, 유튜브 썸네일 다운로더, 비밀번호 생성기, 단위 변환기, 날짜 계산기 등 일상과 업무에 필요한 웹 도구를 한 곳에 모은 무료 서비스입니다.",
    keywords: "웹 도구, 포모도로 타이머, 번호 추첨기, 썸네일 다운로더, 비밀번호 생성기, 단위 변환기, 날짜 계산기, 날씨 정보, QR 코드 생성기, toolhub, 무료 유틸리티, 온라인 도구"
  };

  // 페이지별 커스텀 메타데이터
  const pageSpecificData: Record<string, typeof baseData> = {
    '/pomodoro': {
      title: "포모도로 타이머 - 생산성 향상을 위한 시간 관리 도구 | ToolHub.tools",
      description: "25분 집중 + 5분 휴식의 포모도로 기법으로 생산성을 높이세요. 커스텀 설정, 사운드 알림, 작업 기록 기능이 포함된 무료 포모도로 타이머입니다.",
      keywords: "포모도로 타이머, 시간 관리, 생산성, 집중력, 뽀모도로, 포모도로 기법, 타이머"
    },
    '/timer': {
      title: "범용 타이머 - 다양한 용도의 시간 측정 도구 | ToolHub.tools",
      description: "요리, 운동, 공부 등 다양한 용도로 사용할 수 있는 범용 타이머입니다. 알람 설정, 반복 타이머, 사운드 효과 등 편리한 기능을 제공합니다.",
      keywords: "타이머, 알람, 시간 측정, 요리 타이머, 운동 타이머, 공부 타이머"
    },
    '/raffle': {
      title: "번호 추첨기 - 공정한 랜덤 번호 생성 도구 | ToolHub.tools",
      description: "이벤트, 추첨, 게임 등에 사용할 수 있는 공정한 랜덤 번호 생성 도구입니다. 1부터 원하는 최대 번호까지 설정 가능하며, 중복 없는 추첨을 보장합니다.",
      keywords: "번호 추첨기, 랜덤 번호, 추첨, 이벤트, 게임, 번호 생성"
    },
    '/thumbnail': {
      title: "유튜브 썸네일 다운로더 - 고화질 썸네일 무료 다운로드 | ToolHub.tools",
      description: "유튜브 비디오의 썸네일을 고화질로 다운로드할 수 있는 무료 도구입니다. 다양한 해상도 옵션을 제공하며, 간단한 URL 입력만으로 썸네일을 저장할 수 있습니다.",
      keywords: "유튜브 썸네일, 썸네일 다운로드, 유튜브 이미지, 고화질 썸네일, 유튜브 도구"
    },
    '/password': {
      title: "비밀번호 생성기 - 안전한 강력한 비밀번호 생성 도구 | ToolHub.tools",
      description: "해킹으로부터 안전한 강력한 비밀번호를 생성하는 도구입니다. 길이, 문자 유형, 특수문자 포함 여부를 설정할 수 있으며, 비밀번호 강도를 실시간으로 확인할 수 있습니다.",
      keywords: "비밀번호 생성기, 강력한 비밀번호, 보안, 패스워드, 암호 생성, 해킹 방지"
    },
    '/converter': {
      title: "단위 변환기 - 길이, 무게, 온도 등 다양한 단위 변환 도구 | ToolHub.tools",
      description: "길이, 무게, 온도, 면적, 부피 등 다양한 단위를 빠르고 정확하게 변환할 수 있는 도구입니다. 미터법, 야드파운드법 등 국제 단위 시스템을 지원합니다.",
      keywords: "단위 변환기, 길이 변환, 무게 변환, 온도 변환, 면적 변환, 부피 변환, 단위 계산"
    },
    '/date-calculator': {
      title: "날짜 계산기 - 날짜 간 차이 계산 및 날짜 연산 도구 | ToolHub.tools",
      description: "두 날짜 사이의 차이를 계산하거나 특정 날짜에서 일/월/년을 더하고 빼는 계산을 할 수 있는 도구입니다. 업무일 계산, 기간 계산 등에 유용합니다.",
      keywords: "날짜 계산기, 날짜 차이, 날짜 연산, 기간 계산, 업무일 계산, 디데이 계산"
    },
    '/mbti': {
      title: "MBTI 성격유형 테스트 - 16가지 성격유형 진단 도구 | ToolHub.tools",
      description: "과학적으로 검증된 MBTI 성격유형 검사로 자신의 성격을 정확히 파악해보세요. 16가지 성격유형 중 당신은 어떤 유형인지 알아보고, 성격별 특성과 적합한 직업을 확인할 수 있습니다.",
      keywords: "MBTI 테스트, 성격유형 검사, 16가지 성격유형, 성격 진단, 심리테스트, 성격 분석"
    },
    '/teto-egen-test': {
      title: "테토-에겐 성격유형 테스트 - 나는 테토형? 에겐형? | ToolHub.tools",
      description: "화제의 테토-에겐 성격유형 테스트로 나의 성향을 알아보세요. 테토형과 에겐형 중 어느 쪽에 가까운지 확인하고, 친구들과 결과를 공유해보세요.",
      keywords: "테토 에겐 테스트, 테토형, 에겐형, 성격 테스트, 심리 테스트, 바이럴 테스트"
    }
  };

  const pageData = pageSpecificData[url] || baseData;

  return {
    ...pageData,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ToolHub.tools",
      "description": pageData.description,
      "url": `https://toolhub.tools${url}`,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web Browser",
      "publisher": {
        "@type": "Organization",
        "name": "ToolHub Team",
        "url": "https://toolhub.tools"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "inLanguage": ["ko", "en", "ja"],
      "isAccessibleForFree": true
    }
  };
}

// 페이지별 정적 콘텐츠 생성
function generatePageContent(url: string, lang: string): string {
  switch (url) {
    case '/':
      return `
        <div class="hero">
          <h1>무료 웹 도구 모음</h1>
          <p>일상과 업무에 필요한 다양한 도구를 한 곳에서 무료로 사용하세요</p>
        </div>
        <div class="tool-grid">
          <div class="tool-card">
            <h3 class="tool-title">포모도로 타이머</h3>
            <p class="tool-description">25분 집중 + 5분 휴식의 포모도로 기법으로 생산성을 높이세요</p>
          </div>
          <div class="tool-card">
            <h3 class="tool-title">범용 타이머</h3>
            <p class="tool-description">요리, 운동, 공부 등 다양한 용도로 사용할 수 있는 타이머</p>
          </div>
          <div class="tool-card">
            <h3 class="tool-title">번호 추첨기</h3>
            <p class="tool-description">이벤트나 추첨에 사용할 수 있는 공정한 랜덤 번호 생성 도구</p>
          </div>
          <div class="tool-card">
            <h3 class="tool-title">유튜브 썸네일 다운로더</h3>
            <p class="tool-description">유튜브 비디오의 썸네일을 고화질로 다운로드</p>
          </div>
          <div class="tool-card">
            <h3 class="tool-title">비밀번호 생성기</h3>
            <p class="tool-description">해킹으로부터 안전한 강력한 비밀번호 생성</p>
          </div>
          <div class="tool-card">
            <h3 class="tool-title">단위 변환기</h3>
            <p class="tool-description">길이, 무게, 온도 등 다양한 단위를 빠르고 정확하게 변환</p>
          </div>
          <div class="tool-card">
            <h3 class="tool-title">날짜 계산기</h3>
            <p class="tool-description">날짜 간 차이 계산 및 날짜 연산 도구</p>
          </div>
          <div class="tool-card">
            <h3 class="tool-title">MBTI 성격유형 테스트</h3>
            <p class="tool-description">16가지 성격유형 중 당신은 어떤 유형인지 알아보세요</p>
          </div>
          <div class="tool-card">
            <h3 class="tool-title">테토-에겐 성격유형 테스트</h3>
            <p class="tool-description">화제의 테토-에겐 성격유형 테스트로 나의 성향을 알아보세요</p>
          </div>
        </div>
      `;
    
    case '/pomodoro':
      return `
        <div class="hero">
          <h1>포모도로 타이머</h1>
          <p>25분 집중 + 5분 휴식의 포모도로 기법으로 생산성을 높이세요</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>포모도로 기법이란?</h2>
          <p>포모도로 기법은 1980년대 후반 프란체스코 시릴로가 개발한 시간 관리 방법입니다. 25분 동안 집중해서 일하고, 5분 휴식을 취하는 것을 한 세트로 하여 반복하는 방식입니다.</p>
          <h3>포모도로 기법의 장점</h3>
          <ul>
            <li>집중력 향상</li>
            <li>작업 효율성 증대</li>
            <li>정신적 피로 감소</li>
            <li>시간 관리 능력 향상</li>
          </ul>
        </div>
      `;
    
    case '/timer':
      return `
        <div class="hero">
          <h1>범용 타이머</h1>
          <p>요리, 운동, 공부 등 다양한 용도로 사용할 수 있는 타이머</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>다양한 용도의 타이머</h2>
          <p>일상생활에서 시간 관리가 필요한 모든 순간에 활용할 수 있는 범용 타이머입니다.</p>
          <h3>활용 예시</h3>
          <ul>
            <li>요리 시간 측정</li>
            <li>운동 인터벌 타이머</li>
            <li>공부 시간 관리</li>
            <li>회의 시간 제한</li>
          </ul>
        </div>
      `;
    
    case '/raffle':
      return `
        <div class="hero">
          <h1>번호 추첨기</h1>
          <p>이벤트나 추첨에 사용할 수 있는 공정한 랜덤 번호 생성 도구</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>공정한 랜덤 번호 생성</h2>
          <p>이벤트, 추첨, 게임 등에 사용할 수 있는 완전히 무작위적인 번호 생성 도구입니다.</p>
          <h3>특징</h3>
          <ul>
            <li>1부터 원하는 최대 번호까지 설정 가능</li>
            <li>중복 없는 추첨 보장</li>
            <li>시각적인 애니메이션 효과</li>
            <li>추첨 결과 기록 및 관리</li>
          </ul>
        </div>
      `;
    
    case '/thumbnail':
      return `
        <div class="hero">
          <h1>유튜브 썸네일 다운로더</h1>
          <p>유튜브 비디오의 썸네일을 고화질로 다운로드</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>고화질 썸네일 다운로드</h2>
          <p>유튜브 URL만 입력하면 해당 비디오의 썸네일을 다양한 해상도로 다운로드할 수 있습니다.</p>
          <h3>지원 해상도</h3>
          <ul>
            <li>최고화질 (1280x720)</li>
            <li>고화질 (640x480)</li>
            <li>표준화질 (480x360)</li>
            <li>기본 썸네일 (120x90)</li>
          </ul>
        </div>
      `;
    
    case '/password':
      return `
        <div class="hero">
          <h1>비밀번호 생성기</h1>
          <p>해킹으로부터 안전한 강력한 비밀번호 생성</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>안전한 비밀번호 생성</h2>
          <p>해킹과 무차별 대입 공격으로부터 안전한 강력한 비밀번호를 생성합니다.</p>
          <h3>비밀번호 보안 팁</h3>
          <ul>
            <li>최소 12자 이상 사용</li>
            <li>대문자, 소문자, 숫자, 특수문자 조합</li>
            <li>개인정보 포함 금지</li>
            <li>사이트별로 다른 비밀번호 사용</li>
          </ul>
        </div>
      `;
    
    case '/converter':
      return `
        <div class="hero">
          <h1>단위 변환기</h1>
          <p>길이, 무게, 온도 등 다양한 단위를 빠르고 정확하게 변환</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>다양한 단위 변환</h2>
          <p>일상생활과 업무에서 필요한 다양한 단위를 정확하게 변환할 수 있습니다.</p>
          <h3>지원 단위</h3>
          <ul>
            <li>길이: 미터, 킬로미터, 인치, 피트, 야드</li>
            <li>무게: 그램, 킬로그램, 온스, 파운드</li>
            <li>온도: 섭씨, 화씨, 켈빈</li>
            <li>면적: 제곱미터, 제곱킬로미터, 평, 에이커</li>
          </ul>
        </div>
      `;
    
    case '/date-calculator':
      return `
        <div class="hero">
          <h1>날짜 계산기</h1>
          <p>날짜 간 차이 계산 및 날짜 연산 도구</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>정확한 날짜 계산</h2>
          <p>두 날짜 사이의 차이를 계산하거나 특정 날짜에서 일/월/년을 더하고 빼는 계산을 할 수 있습니다.</p>
          <h3>주요 기능</h3>
          <ul>
            <li>날짜 간 차이 계산 (일, 주, 월, 년)</li>
            <li>날짜 더하기/빼기 계산</li>
            <li>업무일 계산</li>
            <li>기념일 및 디데이 계산</li>
          </ul>
        </div>
      `;
    
    case '/mbti':
      return `
        <div class="hero">
          <h1>MBTI 성격유형 테스트</h1>
          <p>16가지 성격유형 중 당신은 어떤 유형인지 알아보세요</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>MBTI 성격유형 검사</h2>
          <p>과학적으로 검증된 MBTI 성격유형 검사로 자신의 성격을 정확히 파악해보세요.</p>
          <h3>16가지 성격유형</h3>
          <p>MBTI는 4가지 선호 지표를 조합하여 16가지 성격유형으로 분류합니다:</p>
          <ul>
            <li>외향(E) vs 내향(I)</li>
            <li>감각(S) vs 직관(N)</li>
            <li>사고(T) vs 감정(F)</li>
            <li>판단(J) vs 인식(P)</li>
          </ul>
        </div>
      `;
    
    case '/teto-egen-test':
      return `
        <div class="hero">
          <h1>테토-에겐 성격유형 테스트</h1>
          <p>화제의 테토-에겐 성격유형 테스트로 나의 성향을 알아보세요</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>테토형 vs 에겐형</h2>
          <p>최근 소셜미디어에서 화제가 되고 있는 테토-에겐 성격유형 테스트입니다.</p>
          <h3>테스트 특징</h3>
          <ul>
            <li>간단한 10개 질문</li>
            <li>성별별 결과 제공</li>
            <li>궁합 분석 포함</li>
            <li>소셜 공유 기능</li>
          </ul>
        </div>
      `;
    
    case '/sitemap':
      return `
        <div class="hero">
          <h1>사이트맵</h1>
          <p>ToolHub.tools의 모든 페이지를 한눈에 확인하세요</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>전체 도구 목록</h2>
          <div class="tool-grid">
            <div class="tool-card">
              <h3 class="tool-title">생산성 도구</h3>
              <ul>
                <li>포모도로 타이머</li>
                <li>범용 타이머</li>
              </ul>
            </div>
            <div class="tool-card">
              <h3 class="tool-title">유틸리티 도구</h3>
              <ul>
                <li>번호 추첨기</li>
                <li>유튜브 썸네일 다운로더</li>
                <li>비밀번호 생성기</li>
              </ul>
            </div>
            <div class="tool-card">
              <h3 class="tool-title">계산 도구</h3>
              <ul>
                <li>단위 변환기</li>
                <li>날짜 계산기</li>
              </ul>
            </div>
            <div class="tool-card">
              <h3 class="tool-title">테스트 도구</h3>
              <ul>
                <li>MBTI 성격유형 테스트</li>
                <li>테토-에겐 성격유형 테스트</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    
    case '/contact':
      return `
        <div class="hero">
          <h1>문의하기</h1>
          <p>ToolHub.tools에 대한 문의사항이 있으시면 언제든지 연락해주세요</p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; margin-bottom: 2rem;">
          <h2>연락처 정보</h2>
          <p>새로운 도구 제안, 버그 신고, 협업 문의 등 모든 문의를 환영합니다.</p>
          <h3>문의 방법</h3>
          <ul>
            <li>이메일: contact@toolhub.tools</li>
            <li>GitHub: https://github.com/toolhub-tools</li>
            <li>응답 시간: 영업일 기준 1-2일 이내</li>
          </ul>
        </div>
      `;
    
    default:
      return `
        <div class="hero">
          <h1>페이지를 찾을 수 없습니다</h1>
          <p>요청하신 페이지가 존재하지 않습니다. 홈페이지로 돌아가서 다른 도구를 이용해보세요.</p>
        </div>
      `;
  }
}