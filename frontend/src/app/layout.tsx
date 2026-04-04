import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SCEMAS — Smart City Environmental Monitoring",
  description:
    "Real-time environmental monitoring and alerting across city zones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // Browser extensions (Dark Reader, Grammarly, password managers, etc.)
      // commonly inject attributes onto <html> before React hydrates, which
      // triggers a hydration mismatch warning. Scoping this to the single
      // <html> element neutralizes the extension noise without masking any
      // mismatches inside the tree.
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg text-sm text-text">{children}</body>
    </html>
  );
}
