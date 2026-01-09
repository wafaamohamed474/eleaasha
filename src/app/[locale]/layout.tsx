import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Cairo, Poppins } from "next/font/google";
import "./globals.css";
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import { Toaster } from "@/components/ui/sonner";
import { AuthDialog } from '@/components/ui/AuthDialog';

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

import { StoreProvider } from '@/store/StoreProvider';

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (err) {
    notFound();
  }

  const fontVariable = locale === "ar" ? cairo.variable : poppins.variable;
  const fontClass = locale === "ar" ? "font-cairo" : "font-poppins";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${fontVariable} ${fontClass} antialiased`}
      >
        <StoreProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
            <Toaster position="top-center" expand={false} richColors />
            <AuthDialog />
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
