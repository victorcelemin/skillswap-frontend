/**
 * Root layout de Next.js App Router.
 *
 * HydrationProvider: dispara useAuthStore.persist.rehydrate() en el primer
 * useEffect del cliente para que Zustand lea localStorage sin bloquear SSR.
 * Ref: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#skiphydration
 */
import type { Metadata } from 'next';
import './globals.css';
import { HydrationProvider } from '@/components/HydrationProvider';

export const metadata: Metadata = {
  title: 'SkillSwap — Intercambia lo que sabes',
  description:
    'Plataforma de intercambio de habilidades. Enseña lo que sabes, aprende lo que quieres. Usando créditos, no dinero.',
  keywords: 'aprendizaje, habilidades, intercambio, cursos, comunidad',
  openGraph: {
    title: 'SkillSwap',
    description: 'Donde el conocimiento es la moneda',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <HydrationProvider />
        {children}
      </body>
    </html>
  );
}
