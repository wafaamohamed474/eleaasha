import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Cairo, Poppins } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { AuthDialog } from "@/components/ui/AuthDialog";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 600,
          alt: t("title"),
        },
      ],
    },
  };
}

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

import { StoreProvider } from "@/store/StoreProvider";
import ScrollToTop from "@/components/molecules/ScrollToTop";

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
      <body className={`${fontVariable} ${fontClass} antialiased`}>
        <StoreProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ScrollToTop/>
            {children}
            <Toaster position="top-center" expand={false} richColors />
            <AuthDialog />
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
