import type { Metadata } from "next";
import Script from "next/script";
import { absoluteUrl, siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteName} - Live Cricket & Football | Match Schedule | Playing XI`,
  description: siteDescription,
  keywords: [
    "YoSinTV",
    "live cricket",
    "live football",
    "match schedule",
    "playing XI",
    "match preview",
    "T20 World Cup 2026",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${siteName} - Live Cricket & Football | Match Schedule | Playing XI`,
    description: "YoSinTV is sports website that covers all the Cricket Matches, World Cup, International/Domestic Matches, Football Matches, etc. ",
    siteName,
    type: "website",
    url: absoluteUrl("/"),
    images: ["https://web.cricfoot.net/favico.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Live Cricket & Football`,
    description: siteDescription,
    images: ["https://web.cricfoot.net/favico.png"],
  },
  icons: {
    icon: "https://web.cricfoot.net/favico.png",
    apple: "https://web.cricfoot.net/favico.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5525538810839147"
        />
        {children}
      </body>
    </html>
  );
}
