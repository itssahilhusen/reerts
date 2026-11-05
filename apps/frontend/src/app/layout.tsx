import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "reerts — AI Marketing Automation for Founders & Agencies",
  description: "Automate social media marketing in minutes. Brand voice AI, AI-found content ideas, link-to-post drafts, and AI carousels — built for founders and agencies.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/logos/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    title: "reerts — AI Marketing Automation for Founders & Agencies",
    description: "Automate social media marketing in minutes. Brand voice AI, AI-found content ideas, link-to-post drafts, and AI carousels — built for founders and agencies.",
    url: "https://www.reerts.com",
    siteName: "reerts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "reerts — AI Marketing Automation for Founders & Agencies",
    description: "Automate social media marketing in minutes. Brand voice AI, AI-found content ideas, link-to-post drafts, and AI carousels — built for founders and agencies.",
  },
};

import { AuthProvider } from "@/components/providers/AuthProvider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif, Playfair_Display } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} ${playfairDisplay.variable} scroll-smooth font-sans`}
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600;700&display=swap" />
        <link rel="stylesheet" href="/swipera/templates.css" />
      </head>
      <body className="font-sans antialiased selection:bg-primary selection:text-primary-foreground min-h-screen">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("reerts-theme");if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
