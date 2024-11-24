'use client'

import { Upload, Menu } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="https://picsum.photos/40"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-xl font-bold">AI Image Upscaler</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 hover:bg-blue-600">
          <Upload size={20} />
          <span>Upload</span>
        </button>
        <button className="rounded-lg p-2 hover:bg-[#2A2A2A]">
          <Menu size={24} />
        </button>
      </div>
    </header>
  )
} 