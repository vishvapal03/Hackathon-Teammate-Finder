import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HackMatch AI - AI Hackathon Teammate Finder & Companion",
  description: "Build your perfect hackathon team with AI. Discover events, analyze problem statements, check skill gaps, and connect with developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark-bg text-slate-100">
        {children}
      </body>
    </html>
  );
}
