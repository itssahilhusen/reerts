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
    icon: "/images/logos/reerts-icon.svg",
    apple: "/images/logos/reerts-logo.png",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth font-sans" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased selection:bg-primary selection:text-primary-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
