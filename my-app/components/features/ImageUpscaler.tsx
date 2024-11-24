'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UploadDropzone } from '@bytescale/upload-widget-react'
import * as Bytescale from "@bytescale/upload-widget"
import Header from '@/components/layout/Header'
import ProcessCards from '@/components/layout/ProcessCards'
import { ProcessStep } from '@/types/process'
import { Download } from 'lucide-react'

export default function ImageUpscaler() {
  const [currentStep, setCurrentStep] = useState<ProcessStep>('upload')
  const [progress, setProgress] = useState(0)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const options: Bytescale.UploadWidgetConfig = {
    apiKey: process.env.NEXT_PUBLIC_BYTESCALE_API_KEY!,
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png'],
    maxFileSizeBytes: 10 * 1024 * 1024, // 10MB
    styles: {
      colors: {
        primary: '#3B82F6'
      }
    },
    editor: {
      images: {
        preview: true
      }
    }
  }

  const handleUploadComplete = async (files: Bytescale.UploadWidgetResult[]) => {
    try {
      setError(null)
      setCurrentStep('upscaling')
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
        setCurrentStep('export')
        setProgress(100)
      } else {
        throw new Error(data.error || 'Failed to process image')
      }
    } catch {
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

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <Header />
      
      <div className="mt-12">
        <UploadDropzone
          options={options}
          onUpdate={({ uploadedFiles }) => {
            if (uploadedFiles.length > 0) {
              handleUploadComplete(uploadedFiles)
            }
          }}
          width="100%"
          height="400px"
        />
      </div>

      <div className="mt-16">
        <ProcessCards 
          currentStep={currentStep}
          progress={progress}
        />
      </div>

      {error && (
        <div className="mt-8 text-center text-red-500">
          {error}
        </div>
      )}

      {processedImage && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            {originalImage && (
              <div className="rounded-lg bg-[#2A2A2A] p-4">
                <h3 className="mb-4 text-center text-lg">Original</h3>
                <div className="relative h-[400px] w-full">
                  <Image 
                    src={originalImage}
                    alt="Original"
                    fill
                    className="rounded-lg object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
            <div className="rounded-lg bg-[#2A2A2A] p-4">
              <h3 className="mb-4 text-center text-lg">Upscaled</h3>
              <div className="relative h-[400px] w-full">
                <Image 
                  src={processedImage}
                  alt="Upscaled"
                  fill
                  className="rounded-lg object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-3 font-medium hover:bg-blue-600"
          >
            <Download size={20} />
            Download Upscaled Image
          </button>
        </div>
      )}
    </div>
  )
} 