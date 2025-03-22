'use client';

import { SessionProvider } from 'next-auth/react';
import '@/app/globals.css';
import Header from '@/components/header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header/>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}