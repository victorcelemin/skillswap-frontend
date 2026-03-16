import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillSwap — Intercambia lo que sabes',
  description: 'Plataforma de intercambio de habilidades. Enseña lo que sabes, aprende lo que quieres. Usando créditos, no dinero.',
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
      <body>{children}</body>
    </html>
  );
}
