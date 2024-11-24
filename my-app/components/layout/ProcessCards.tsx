'use client'

import { Upload, ArrowUpRight, Download } from 'lucide-react'
import { ProcessStep } from '@/types/process'

interface ProcessCardsProps {
  currentStep: ProcessStep
  progress: number
}

export default function ProcessCards({ currentStep, progress }: ProcessCardsProps) {
  const steps = [
    {
      icon: Upload,
      title: 'Upload an image',
      description: 'Start by uploading your image',
      step: 'upload' as ProcessStep,
    },
    {
      icon: ArrowUpRight,
      title: 'AI Upscaling',
      description: 'Enhance image quality with AI',
      step: 'upscaling' as ProcessStep,
    },
    {
      icon: Download,
      title: 'Download Result',
      description: 'Get your enhanced image',
      step: 'export' as ProcessStep,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.step}
          className={`rounded-xl bg-[#2A2A2A] p-6 transition-colors ${
            currentStep === step.step ? 'ring-2 ring-[#3B82F6]' : ''
          }`}
        >
          <step.icon size={32} className="mb-4 text-[#3B82F6]" />
          <h3 className="mb-2 text-lg font-medium">{step.title}</h3>
          <p className="text-sm text-gray-400">{step.description}</p>
          {currentStep === step.step && (
            <div className="mt-4 h-1 w-full rounded-full bg-gray-700">
              <div
                className="h-full rounded-full bg-[#3B82F6] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 