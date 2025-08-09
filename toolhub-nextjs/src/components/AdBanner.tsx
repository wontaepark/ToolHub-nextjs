'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Google AdSense 자동 광고 */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9557159052095853"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          
          {/* 디스플레이 광고 */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-9557159052095853"
            data-ad-slot="your-ad-slot-id" // 실제 광고 슬롯 ID로 교체 필요
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}

// 페이지별 광고 컴포넌트
export function AdBannerInline() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="my-8 text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9557159052095853"
        data-ad-slot="your-inline-ad-slot-id" // 실제 인라인 광고 슬롯 ID로 교체 필요
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}