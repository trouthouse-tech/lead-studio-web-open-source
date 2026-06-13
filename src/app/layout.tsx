import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/components/ReduxProvider";
import { RootToaster } from "@/components/RootToaster";
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
  title: {
    default: 'Lead Studio',
    template: '%s | Lead Studio',
  },
  description:
    'Find businesses, log calls, and send email from one list. Open-source software you run yourself. Your lead data stays in your database.',
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <ReduxProvider>
          {children}
          <RootToaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
