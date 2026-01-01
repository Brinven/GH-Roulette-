import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GitHub Roulette',
  description: 'Discover random GitHub repositories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

