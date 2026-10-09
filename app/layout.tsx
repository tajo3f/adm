import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'TAJO ADMIN', template: '%s | TAJO ADMIN' },
  description: 'Plataforma administrativa privada da TAJO Digital 3F.',
  robots: { index: false, follow: false, nocache: true },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#07111f',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>
}
