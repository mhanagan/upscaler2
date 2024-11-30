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
          React.createElement('title', { key: 'title' }, 'UpscalR'),
          React.createElement('meta', { charSet: 'utf-8', key: 'charset' }),
          React.createElement('meta', { 
            name: 'viewport', 
            content: 'width=device-width, initial-scale=1',
            key: 'viewport'
          }),
          React.createElement('meta', {
            httpEquiv: 'Content-Security-Policy',
            content: "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' bytescale.com *.bytescale.com vercel.live *.vercel.live https://vercel.live vercel.com *.vercel.com; " +
              "style-src 'self' 'unsafe-inline' https://vercel.live; " +
              "img-src 'self' data: blob: replicate.delivery *.replicate.delivery upcdn.io *.upcdn.io bytescale.com *.bytescale.com https://vercel.live https://vercel.com; " +
              "connect-src 'self' replicate.delivery *.replicate.delivery api.bytescale.com *.bytescale.com *.amazonaws.com *.s3.dualstack.us-east-1.amazonaws.com https://vercel.live wss://ws-us3.pusher.com; " +
              "frame-src 'self' upcdn.io *.upcdn.io bytescale.com *.bytescale.com vercel.live *.vercel.live https://vercel.live; " +
              "font-src 'self' https://vercel.live https://assets.vercel.com;",
            key: 'csp'
          }),
          React.createElement('link', {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/apple-touch-icon.png',
            key: 'apple-touch-icon'
          }),
          React.createElement('link', {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/favicon-32x32.png',
            key: 'favicon-32'
          }),
          React.createElement('link', {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/favicon-16x16.png',
            key: 'favicon-16'
          }),
          React.createElement('link', {
            rel: 'shortcut icon',
            type: 'image/x-icon',
            href: '/favicon.ico',
            key: 'favicon'
          }),
          React.createElement('link', {
            rel: 'manifest',
            href: '/site.webmanifest',
            key: 'manifest'
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
