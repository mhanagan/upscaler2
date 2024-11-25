'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Wand2 } from 'lucide-react'

interface ImageComparisonProps {
  originalImage: string
  processedImage: string
}

export const ImageComparison: React.FC<ImageComparisonProps> = React.memo(({ originalImage, processedImage }) => {
  return React.createElement(
    'div',
    { className: "grid gap-6 md:grid-cols-2" },
    [
      React.createElement(
        Card,
        { 
          className: "overflow-hidden border-white/20 bg-white/5 backdrop-blur-lg",
          key: "original"
        },
        [
          React.createElement(
            CardHeader,
            { key: "header" },
            React.createElement(CardTitle, null, "Original")
          ),
          React.createElement(
            CardContent,
            { key: "content" },
            React.createElement(
              'div',
              { className: "relative aspect-square w-full overflow-hidden rounded-lg" },
              React.createElement(Image, {
                src: originalImage,
                alt: "Original",
                fill: true,
                className: "object-contain",
                unoptimized: true
              })
            )
          )
        ]
      ),
      React.createElement(
        Card,
        { 
          className: "overflow-hidden border-white/20 bg-white/5 backdrop-blur-lg",
          key: "processed"
        },
        [
          React.createElement(
            CardHeader,
            { key: "header" },
            React.createElement(
              CardTitle,
              { className: "flex items-center gap-2" },
              [
                React.createElement(Wand2, { 
                  className: "h-6 w-6 text-purple-400",
                  key: "icon"
                }),
                "Upscaled"
              ]
            )
          ),
          React.createElement(
            CardContent,
            { key: "content" },
            React.createElement(
              'div',
              { className: "relative aspect-square w-full overflow-hidden rounded-lg" },
              React.createElement(Image, {
                src: processedImage,
                alt: "Upscaled",
                fill: true,
                className: "object-contain",
                unoptimized: true
              })
            )
          )
        ]
      )
    ]
  )
})

ImageComparison.displayName = 'ImageComparison' 