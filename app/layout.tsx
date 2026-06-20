import type { Metadata } from 'next';
import './global.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'ShaheenShield — Post-Quantum Cryptography Risk Assessment',
  description: 'Identify and eliminate quantum-vulnerable cryptography in your infrastructure. Protect your data against Harvest Now, Decrypt Later attacks.',
  keywords: ['quantum', 'cryptography', 'security', 'TLS', 'risk assessment', 'PQC', 'ShaheenShield'],
};

// This script runs before React hydrates — prevents flash of wrong theme
const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('shaheen-theme');
    if (!theme) { theme = 'dark'; }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}