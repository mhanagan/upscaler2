'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { UploadDropzone } from '@bytescale/upload-widget-react'
import type { UploadWidgetResult, UploadWidget } from '@bytescale/upload-widget'
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
  const uploadWidgetRef = useRef<UploadWidget | null>(null)

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

      console.log('Sending request with URL:', imageUrl)

      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          imageUrl,
          userAgent: window.navigator.userAgent,
          platform: window.navigator.platform
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers))

      let data
      try {
        const text = await response.text()
        console.log('Raw response:', text)
        
        if (!text) {
          throw new Error('Empty response from server')
        }
        
        data = JSON.parse(text)
      } catch (e: any) {
        console.error('Parse error:', e)
        throw new Error(`Failed to parse response: ${e?.message || 'Unknown error'}`)
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      
      if (data.success) {
        setProcessedImage(data.url)
        setCurrentStep('complete')
        setProgress(100)
      } else {
        throw new Error(data.error || 'Failed to process image')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      setError(error.message || 'Failed to process image')
      setCurrentStep('upload')
      setProgress(0)
      
      const uploadWidget = document.querySelector('.upl-file-entry-remove')
      if (uploadWidget) {
        (uploadWidget as HTMLElement).click()
      }
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
      
      setCurrentStep('upload')
      setProgress(0)
      
      const uploadWidget = document.querySelector('.upl-file-entry-remove')
      if (uploadWidget) {
        (uploadWidget as HTMLElement).click()
      }
      
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
            height: "200px"
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
                className: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-3 sm:px-4 py-2 text-sm sm:text-base"
              },
              [
                React.createElement(Download, { 
                  className: "mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5",
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