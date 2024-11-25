'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { UploadDropzone } from '@bytescale/upload-widget-react'
import type { UploadWidgetResult } from '@bytescale/upload-widget'
import { Download } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { ProcessSteps } from './ProcessSteps'
import { ImageComparison } from './ImageComparison'

interface UploadUpdateEvent {
  uploadedFiles: UploadWidgetResult[]
}

export const ImageUploader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'complete'>('upload')
  const [progress, setProgress] = useState(0)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const widgetConfig = {
    apiKey: process.env.NEXT_PUBLIC_BYTESCALE_API_KEY ?? "",
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png'],
    maxFileSizeBytes: 10 * 1024 * 1024,
    styles: {
      colors: {
        primary: '#8B5CF6'
      }
    },
    editor: {
      images: {
        preview: true,
        crop: false
      }
    }
  }

  const handleUploadComplete = async (files: UploadWidgetResult[]) => {
    try {
      setError(null)
      setCurrentStep('processing')
      setProgress(25)

      if (!files?.[0]?.fileUrl) {
        throw new Error('Upload failed')
      }

      const imageUrl = files[0].fileUrl
      setOriginalImage(imageUrl)
      setProgress(50)

      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const data = await response.json()
      
      if (data.success) {
        setProcessedImage(data.url)
        setCurrentStep('complete')
        setProgress(100)
      } else {
        throw new Error(data.error || 'Failed to process image')
      }
    } catch (error) {
      setError('Failed to process image')
      setCurrentStep('upload')
      setProgress(0)
    }
  }

  const handleDownload = async () => {
    if (!processedImage) return

    try {
      const response = await fetch(processedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `upscaled-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      setError('Failed to download image')
    }
  }

  return React.createElement(
    'div',
    { className: "space-y-8" },
    [
      React.createElement(ProcessSteps, { currentStep, progress, key: "steps" }),
      
      React.createElement(
        Card,
        { className: "overflow-hidden border-white/20", key: "upload-card" },
        React.createElement(
          'div',
          { className: "p-6" },
          React.createElement(UploadDropzone, {
            options: widgetConfig,
            onUpdate: ({ uploadedFiles }: UploadUpdateEvent) => {
              if (uploadedFiles.length > 0) {
                handleUploadComplete(uploadedFiles)
              }
            },
            width: "100%",
            height: "300px"
          })
        )
      ),

      error && React.createElement(
        'div',
        { 
          className: "rounded-lg bg-red-500/10 p-4 text-center text-red-500",
          key: "error"
        },
        error
      ),

      originalImage && processedImage && React.createElement(
        'div',
        { className: "space-y-6", key: "results" },
        [
          React.createElement(ImageComparison, {
            originalImage,
            processedImage,
            key: "comparison"
          }),
          
          React.createElement(
            'div',
            { className: "flex justify-center", key: "download" },
            React.createElement(
              Button,
              {
                onClick: handleDownload,
                size: "lg",
                className: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              },
              [
                React.createElement(Download, { 
                  className: "mr-2 h-5 w-5",
                  key: "icon"
                }),
                "Download Upscaled Image"
              ]
            )
          )
        ]
      )
    ]
  )
} 