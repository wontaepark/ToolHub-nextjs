'use client';

import { NextIntlClientProvider } from 'next-intl';

interface IntlProviderProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export default function IntlProvider({ children, locale, messages }: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children as any}
    </NextIntlClientProvider>
  );
}