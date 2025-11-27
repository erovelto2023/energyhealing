import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Kathleen Heals - Natural Pain Relief Through Energy Healing',
  description: 'Find natural relief from pain through energy healing, Reiki, and holistic wellness practices. Book your healing session today.',
  keywords: 'energy healing, Reiki, holistic wellness, natural pain relief, chakra healing, spiritual healing'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang='en'
        className='scroll-smooth antialiased'
        suppressHydrationWarning
      >
        <body className={`${inter.variable} ${playfair.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
