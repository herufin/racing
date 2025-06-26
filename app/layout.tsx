import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Racing By heru',
  description: 'Racing',
  generator: 'heru',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
