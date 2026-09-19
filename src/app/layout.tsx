import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import RoleSwitcherFloating from '@/components/layout/RoleSwitcherFloating';

export const metadata: Metadata = {
  title: 'EduGestion Africa | Plateforme SaaS de Gestion Scolaire Moderne',
  description: 'Logiciel tout-en-un de gestion des écoles privées en Afrique francophone (Sénégal, Côte d\'Ivoire, Mali, etc.). Élèves, Frais, Wave/Orange Money, Bulletins, Absences et Espace Parents.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-slate-50 text-slate-900">
        <AppProvider>
          <RoleSwitcherFloating />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
