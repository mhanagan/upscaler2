'use client'

import React from 'react'
import { Wand2 } from 'lucide-react'

export const Header: React.FC = () => {
  return React.createElement(
    'header',
    { className: "flex items-center justify-center gap-2 py-6" },
    [
      React.createElement(Wand2, { 
        className: "h-8 w-8 text-purple-400",
        key: "icon"
      }),
      React.createElement(
        'h1',
        { 
          className: "text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent",
          key: "title"
        },
        "AI Image Upscaler"
      )
    ]
  )
}

export default Header 