import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | ToolHub.tools',
    default: 'ToolHub.tools - 무료 웹 도구 모음'
  },
  description: '포모도로 타이머, MBTI 테스트, 비밀번호 생성기 등 일상에 필요한 무료 온라인 도구를 한 곳에서 제공합니다.',
  keywords: '웹 도구, 포모도로 타이머, MBTI 테스트, 무료 유틸리티, 온라인 도구',
  authors: [{ name: 'ToolHub Team' }],
  creator: 'ToolHub Team',
  publisher: 'ToolHub Team',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'ToolHub.tools - 무료 웹 도구 모음',
    description: '포모도로 타이머, MBTI 테스트, 비밀번호 생성기 등 일상에 필요한 무료 온라인 도구를 한 곳에서 제공합니다.',
    url: 'https://toolhub.tools',
    siteName: 'ToolHub.tools',
    images: [
      {
        url: 'https://toolhub.tools/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolHub.tools - 무료 웹 도구 모음',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolHub.tools - 무료 웹 도구 모음',
    description: '포모도로 타이머, MBTI 테스트, 비밀번호 생성기 등 일상에 필요한 무료 온라인 도구를 한 곳에서 제공합니다.',
    images: ['https://toolhub.tools/og-image.png'],
  },
  alternates: {
    canonical: 'https://toolhub.tools',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}