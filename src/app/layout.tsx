import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Licença Parental | Simulador Portugal',
  description: 'Simule e compreenda como funciona a licença parental em Portugal. Calcule os dias, visualize o calendário e planeie a sua licença parental.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
