import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AI Tool Directory | Best AI Tools & Software 2026',
  description: 'Discover the best AI tools and software for writing, image generation, video, coding, audio, design, marketing, and productivity. Find the right AI tool for your needs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#10B981" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground h-full`}>
        {children}
      </body>
    </html>
  )
}
