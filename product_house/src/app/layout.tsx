// src/app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Product Development Assistant',
  description: 'AI-powered tool to streamline product requirements gathering',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}