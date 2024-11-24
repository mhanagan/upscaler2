import { Metadata } from 'next'
import ImageUpscaler from '@/components/features/ImageUpscaler'

export const metadata: Metadata = {
  title: 'AI Image Upscaler',
  description: 'Upscale your images with AI powered by Replicate',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1E1E1E] text-white">
      <ImageUpscaler />
    </main>
  )
} 