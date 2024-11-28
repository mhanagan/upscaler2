'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

const ImageUploader = dynamic<{}>(
  async () => {
    const mod = await import('@/components/ImageUploader')
    return {
      default: mod.ImageUploader as unknown as ComponentType<{}>
    }
  },
  { ssr: false }
)

export default function HomePage() {
  return React.createElement(
    'main',
    { className: "min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900" },
    React.createElement(
      'div',
      { className: "container mx-auto px-4 py-8" },
      [
        React.createElement(
          'div',
          { className: "mb-12 text-center", key: "header" },
          [
            React.createElement(
              'h1',
              { 
                className: "mb-4 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-5xl font-bold text-transparent",
                key: "title"
              },
              "AI Image Upscaler"
            ),
            React.createElement(
              'p',
              { 
                className: "text-lg text-blue-200",
                key: "description"
              },
              "Transform your images with AI-powered upscaling"
            ),
            React.createElement(
              'div',
              {
                className: "mt-4 text-sm text-blue-200/80",
                key: "specs"
              },
              [
                React.createElement(
                  'p',
                  { key: "specs-title", className: "font-medium" },
                  "Image Requirements:"
                ),
                React.createElement(
                  'p',
                  { key: "specs-details" },
                  "Maximum size: 2048x2048 pixels • File size limit: 5MB"
                )
              ]
            )
          ]
        ),
        React.createElement(
          'div',
          { className: "mx-auto max-w-4xl", key: "content" },
          React.createElement(
            'div',
            { className: "rounded-2xl bg-white/10 p-8 backdrop-blur-lg" },
            React.createElement(ImageUploader)
          )
        )
      ]
    )
  )
} 