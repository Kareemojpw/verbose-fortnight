import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AuroraMail - Temporary Inbox',
  description: 'Modern disposable email with realtime inbox.',
  authors: [{ name: 'Karim Mohamed', url: 'https://github.com/kareemoopp760' }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="p-6 text-center text-xs text-slate-400">
          Developed by Karim Mohamed (@kareemoopp760) • © 2026 Karim Mohamed. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
