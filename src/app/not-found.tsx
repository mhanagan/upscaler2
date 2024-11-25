'use client'

import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return React.createElement(
    'div',
    { className: "flex min-h-screen flex-col items-center justify-center text-center" },
    [
      React.createElement(
        'h2',
        { 
          className: "mb-4 text-2xl font-bold",
          key: "title"
        },
        "Page Not Found"
      ),
      React.createElement(
        'p',
        { 
          className: "mb-8 text-gray-400",
          key: "description"
        },
        "Could not find requested resource"
      ),
      React.createElement(
        Link,
        { 
          href: "/",
          className: "rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-white hover:from-purple-600 hover:to-indigo-600",
          key: "link"
        },
        "Return Home"
      )
    ]
  )
} 