'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Wand2 } from 'lucide-react'
import { Lightbox } from './Lightbox'

interface ImageComparisonProps {
  originalImage: string
  processedImage: string
}

export const ImageComparison: React.FC<ImageComparisonProps> = React.memo(({ originalImage, processedImage }) => {
  const [showLightbox, setShowLightbox] = useState(false)

  return React.createElement(
    React.Fragment,
    null,
    [
      React.createElement(
        'div',
        { className: "grid gap-8 md:grid-cols-2", key: "comparison" },
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
                React.createElement(CardTitle, { className: "text-2xl" }, "Original")
              ),
              React.createElement(
                CardContent,
                { key: "content", className: "p-8" },
                React.createElement(
                  'div',
                  { className: "relative aspect-square w-full overflow-hidden rounded-lg h-[500px]" },
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
              className: "overflow-hidden border-white/20 bg-white/5 backdrop-blur-lg cursor-pointer transition-transform hover:scale-[1.02]",
              key: "processed",
              onClick: () => setShowLightbox(true)
            },
            [
              React.createElement(
                CardHeader,
                { key: "header" },
                [
                  React.createElement(
                    CardTitle,
                    { className: "flex items-center gap-2 text-2xl" },
                    [
                      React.createElement(Wand2, { 
                        className: "h-6 w-6 text-purple-400",
                        key: "icon"
                      }),
                      "Upscaled"
                    ]
                  ),
                  React.createElement(
                    'p',
                    { 
                      className: "mt-4 text-center text-sm text-gray-400",
                      key: "click-note"
                    },
                    "(Click to View)"
                  )
                ]
              ),
              React.createElement(
                CardContent,
                { key: "content", className: "p-8" },
                [
                  React.createElement(
                    'div',
                    { className: "relative aspect-square w-full overflow-hidden rounded-lg h-[500px]" },
                    React.createElement(Image, {
                      src: processedImage,
                      alt: "Upscaled",
                      fill: true,
                      className: "object-contain",
                      unoptimized: true
                    })
                  ),
                  React.createElement(
                    'p',
                    { 
                      className: "mt-4 text-center text-sm text-gray-400",
                      key: "click-note"
                    },
                    "(Click to View)"
                  )
                ]
              )
            ]
          )
        ]
      ),
      showLightbox && React.createElement(Lightbox, {
        image: processedImage,
        onClose: () => setShowLightbox(false),
        key: "lightbox"
      })
    ]
  )
})

ImageComparison.displayName = 'ImageComparison' 