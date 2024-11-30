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
        'button',
        {
          className: "absolute right-4 top-4 text-white hover:text-gray-300",
          onClick: onClose,
          key: "close-button"
        },
        React.createElement(X, { className: "h-8 w-8" })
      ),
      React.createElement(
        'img',
        {
          src: image,
          alt: "Upscaled Image",
          className: "max-h-[90vh] max-w-[90vw] object-contain",
          onClick: (e) => e.stopPropagation(),
          key: "lightbox-image"
        }
      )
    ]
  )
} 