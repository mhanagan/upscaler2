'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

interface DropZoneProps {
  onFileSelect: (file: File) => void
}

export default function DropZone({ onFileSelect }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  return (
    <div
      {...getRootProps()}
      className={`mx-auto flex h-[400px] w-full max-w-[800px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
        isDragging 
          ? 'border-[#3B82F6] bg-[#2A2A2A]/50' 
          : isDragReject 
          ? 'border-red-500 bg-red-500/10' 
          : 'border-gray-600 bg-[#2A2A2A]'
      }`}
    >
      <input {...getInputProps()} />
      <Upload 
        size={48} 
        className={`mb-4 ${isDragReject ? 'text-red-500' : 'text-gray-400'}`} 
      />
      <p className="mb-2 text-xl font-medium">
        {isDragReject 
          ? 'File type not supported' 
          : 'Drag & drop your image here'}
      </p>
      <p className="text-sm text-gray-400">
        Upload a PNG or JPG file under 5MB
      </p>
    </div>
  )
} 