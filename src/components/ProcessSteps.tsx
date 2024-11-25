'use client'

import React from 'react'
import { Upload, Wand2, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface ProcessStepsProps {
  currentStep: 'upload' | 'processing' | 'complete'
  progress: number
}

export const ProcessSteps: React.FC<ProcessStepsProps> = React.memo(({ currentStep, progress }) => {
  const steps = [
    {
      id: 'upload',
      title: 'Upload',
      description: 'Upload your image',
      icon: Upload,
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'AI is enhancing your image',
      icon: Wand2,
    },
    {
      id: 'complete',
      title: 'Download',
      description: 'Get your upscaled image',
      icon: Download,
    },
  ] as const

  return React.createElement(
    'div',
    { className: "grid gap-4 md:grid-cols-3" },
    steps.map((step) => {
      const Icon = step.icon
      const isActive = currentStep === step.id
      const isCompleted = currentStep === 'complete' && step.id === 'complete'

      return React.createElement(
        Card,
        {
          key: step.id,
          className: `border-none bg-white/5 backdrop-blur-lg transition-all duration-300 ${
            isActive || isCompleted
              ? 'bg-purple-500/20 ring-2 ring-purple-500'
              : 'hover:bg-white/10'
          }`
        },
        [
          React.createElement(
            CardHeader,
            { key: "header" },
            React.createElement(
              CardTitle,
              { className: "flex items-center gap-2 text-lg" },
              [
                React.createElement(Icon, {
                  key: "icon",
                  className: `h-5 w-5 ${isActive || isCompleted ? 'text-purple-400' : 'text-gray-400'}`
                }),
                step.title
              ]
            )
          ),
          React.createElement(
            CardContent,
            { key: "content" },
            [
              React.createElement(
                'p',
                {
                  key: "description",
                  className: `text-sm ${isActive || isCompleted ? 'text-gray-200' : 'text-gray-400'}`
                },
                step.description
              ),
              step.id === 'processing' && isActive && React.createElement(
                'div',
                {
                  key: "progress-bar",
                  className: "mt-4 h-1 w-full rounded-full bg-gray-700"
                },
                React.createElement(
                  'div',
                  {
                    className: "h-full rounded-full bg-purple-500 transition-all duration-300",
                    style: { width: `${progress}%` }
                  }
                )
              )
            ]
          )
        ]
      )
    })
  )
})

ProcessSteps.displayName = 'ProcessSteps' 