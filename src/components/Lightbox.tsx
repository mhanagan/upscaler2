'use client'

import React from 'react'
import { X } from 'lucide-react'

interface LightboxProps {
  image: string
  onClose: () => void
}

export const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  return React.createElement(
    'div',
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90",
      onClick: onClose
    },
    [
      React.createElement(
        'div',
        {
          className: "relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-black/50",
          key: "lightbox-container",
          onClick: (e) => e.stopPropagation()
        },
        [
          React.createElement(
            'button',
            {
              className: "absolute right-2 top-2 text-white/80 hover:text-white",
              onClick: onClose,
              key: "close-button"
            },
            React.createElement(X, { className: "h-6 w-6" })
          ),
          React.createElement(
            'img',
            {
              src: image,
              alt: "Upscaled Image",
              className: "h-auto w-auto object-contain",
              onClick: (e) => e.stopPropagation(),
              key: "lightbox-image"
            }
          )
        ]
      )
    ]
  )
} 