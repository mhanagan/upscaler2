'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return React.createElement(
    'html',
    { lang: 'en', suppressHydrationWarning: true },
    [
      React.createElement(
        'head',
        { key: 'head' },
        [
          React.createElement('meta', { charSet: 'utf-8', key: 'charset' }),
          React.createElement('meta', { 
            name: 'viewport', 
            content: 'width=device-width, initial-scale=1',
            key: 'viewport'
          })
        ]
      ),
      React.createElement(
        'body',
        { 
          key: 'body',
          className: `${inter.className} min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900`
        },
        children
      )
    ]
  )
}
