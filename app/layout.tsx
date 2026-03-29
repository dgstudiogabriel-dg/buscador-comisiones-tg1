import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TG1 - Buscador de Comisiones 2026',
  description: 'Buscador de comisiones para Tecnología Gráfica 1 - UNNE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 m-0">{children}</body>
    </html>
  );
}
