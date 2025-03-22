'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react'; // Import Suspense
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
          {/* Wrap Header in Suspense with a fallback */}
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
          </Suspense>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}