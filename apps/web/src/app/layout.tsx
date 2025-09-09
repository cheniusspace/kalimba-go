import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kalimba Suite',
  description: 'Cross-platform application suite',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

