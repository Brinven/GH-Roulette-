import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import HubHeader from '@/components/HubHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'GH Roulette',
  description: 'Discover random GitHub repositories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <HubHeader />
        {children}
      </body>
    </html>
  );
}
