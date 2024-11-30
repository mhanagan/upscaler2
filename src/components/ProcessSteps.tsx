'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface ProcessStepsProps {
  currentStep: 'upload' | 'processing' | 'complete'
  progress?: number
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({ currentStep }) => {
  return React.createElement(
    'div',
    { className: "mx-auto max-w-2xl" },
    React.createElement(
      'div',
      { className: "flex justify-center" },
      [
        currentStep === 'processing' && React.createElement(
          'div',
          {
            className: "flex items-center justify-center rounded-lg bg-white/10 px-8 py-4 backdrop-blur-sm",
            key: "processing"
          },
          [
            React.createElement(Loader2, {
              className: "mr-2 h-6 w-6 animate-spin text-white",
              key: "spinner"
            }),
            React.createElement(
              'span',
              { 
                className: "text-lg font-medium text-white",
                key: "processing-text"
              },
              "Processing Image..."
            )
          ]
        )
      ]
    )
  )
}

export default ProcessSteps 