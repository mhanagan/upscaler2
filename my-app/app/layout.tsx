import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Upscaler',
  description: 'Upscale your images with AI powered by Replicate',
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