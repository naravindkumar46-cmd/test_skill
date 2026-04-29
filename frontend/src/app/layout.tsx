import type { Metadata } from 'next';
import { Providers } from '@/context/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEL Marketplace',
  description: 'AI Skills & Expertise Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
