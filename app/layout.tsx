import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yatırımcı Onboarding Demo | Beta Space Studio",
  description: "SPK uygunluk testini chat-native deneyime dönüştüren yapay zeka destekli yatırımcı profilleme platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Libertinus+Serif+Display&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className={GeistSans.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
