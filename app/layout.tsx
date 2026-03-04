import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AuroraMail - Temporary Inbox',
  description: 'Modern disposable email with realtime inbox.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
